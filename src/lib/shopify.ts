import sanitizeHtml from "sanitize-html";
import { unstable_cache } from "next/cache";
import { formatPrice } from "@/lib/formatPrice";
import {
  parseIngredientReferences,
  parseTimelineReferences,
  parseFaqReferences,
  parseFaqJson,
  parseReviewReferences,
  type PdpFeaturedReview,
  type PdpIngredientEntry,
  type PdpTimelineMilestone,
  type PdpFaqItem,
  type PdpProductReview,
} from "@/lib/shopify-pdp-meta";
import {
  referencedProductsFromMetafield,
  variantFromGql,
  type ProductVariantSummary,
  type ReferencedProductSummary,
} from "@/lib/shopify-referenced-products";
import {
  buildFallbackFooterColumns,
  menuUrlToHref,
  type FooterNavColumn,
  type FooterNavLink,
} from "@/lib/footer-nav";
import { shouldUseShopifyMock } from "@/lib/shopify-mode";
import {
  getMockAllProductsForShop,
  getMockCollectionByHandle,
  getMockCollections,
  getMockMarqueeProducts,
  getMockFooterMenu,
  getMockMainMenuLinks,
  getMockNavCollections,
  getMockProductDetail,
} from "@/lib/shopify-mock";

/** Allowed HTML tags/attributes for product description rendering */
const DESCRIPTION_HTML_ALLOWED_TAGS = [
  "p", "br", "b", "i", "em", "strong", "ul", "ol", "li", "a", "span", "h2", "h3", "h4",
];

function sanitizeDescriptionHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: DESCRIPTION_HTML_ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      span: ["class"],
    },
    allowedSchemes: ["https", "mailto"],
    // Force external links to be safe
    transformTags: {
      a: (tagName, attribs) => {
        const result: { tagName: string; attribs: Record<string, string> } = {
          tagName,
          attribs: { ...attribs, rel: "noopener noreferrer" },
        };
        if (!attribs.href?.startsWith("mailto:")) {
          result.attribs.target = "_blank";
        }
        return result;
      },
    },
  });
}

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Startup diagnostic — logs once when the module is first loaded on the server.
// Prints the resolved endpoint and whether credentials are present so the Render
// logs immediately reveal misconfiguration without needing to trigger a request.
console.log(
  "[shopify] module loaded —",
  `NODE_ENV=${process.env.NODE_ENV}`,
  `SHOPIFY_USE_MOCK=${process.env.SHOPIFY_USE_MOCK ?? "(unset)"}`,
  `domain=${domain ? `"${domain}"` : "(unset)"}`,
  `token=${storefrontAccessToken ? `set (${storefrontAccessToken.length} chars)` : "(unset)"}`,
  domain
    ? `endpoint=https://${domain.replace(/^https?:\/\//, "").replace(/\/$/, "")}/api/2026-01/graphql.json`
    : "endpoint=(will not fetch — domain missing)"
);

// ---------------------------------------------------------------------------
// Concurrency limiter — prevents Render from sending too many simultaneous
// requests to Shopify, which causes ETIMEDOUT on the store's free/basic tier.
// Max 2 in-flight Storefront API requests at a time.
// ---------------------------------------------------------------------------
const MAX_CONCURRENT = 2;
let activeRequests = 0;
const waitQueue: Array<() => void> = [];

function acquireSlot(): Promise<void> {
  if (activeRequests < MAX_CONCURRENT) {
    activeRequests++;
    return Promise.resolve();
  }
  return new Promise((resolve) => waitQueue.push(() => { activeRequests++; resolve(); }));
}

function releaseSlot() {
  activeRequests--;
  const next = waitQueue.shift();
  if (next) next();
}

/** True when live Storefront credentials exist, or when preview/mock catalog is active. */
export function isShopifyConfigured(): boolean {
  if (shouldUseShopifyMock()) return true;
  return Boolean(domain?.trim() && storefrontAccessToken?.trim());
}

export { shouldUseShopifyMock, shouldUseShopifyMock as isShopifyMockMode } from "@/lib/shopify-mode";

export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: any;
}): Promise<{ status: number; body: T | undefined }> {
  if (!domain?.trim() || !storefrontAccessToken?.trim()) {
    return { status: 503, body: undefined };
  }

  const endpoint = `https://${domain.replace(/^https?:\/\//, "").replace(/\/$/, "")}/api/2026-01/graphql.json`;

  await acquireSlot();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
  };

  // Extract the first line of the query (e.g. "query ProductByHandle") for log readability
  const queryName = query.trim().split(/[\s({]/)[1] ?? "unknown";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.error(`[shopify] ⏱ 10s timeout — aborting query "${queryName}" to ${endpoint}`);
    controller.abort();
  }, 10_000);

  const startMs = Date.now();
  console.log(`[shopify] → ${queryName} vars=${JSON.stringify(variables ?? {})}`);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, ...(variables && { variables }) }),
      signal: controller.signal,
      // cache: "force-cache",
    });

    const elapsed = Date.now() - startMs;
    const text = await response.text();

    if (!response.ok || text.trimStart().startsWith("<")) {
      console.error(
        `[shopify] ✗ ${queryName} — HTTP ${response.status} after ${elapsed}ms — body: ${text.slice(0, 300)}`
      );
      clearTimeout(timeoutId);
      releaseSlot();
      return { status: response.status, body: undefined };
    }

    const body = JSON.parse(text);

    if (body.errors) {
      console.error(`[shopify] ✗ ${queryName} — GraphQL errors after ${elapsed}ms:`, JSON.stringify(body.errors));
      clearTimeout(timeoutId);
      releaseSlot();
      throw body.errors[0];
    }

    if (!body.data) {
      console.error(`[shopify] ✗ ${queryName} — no data after ${elapsed}ms — body: ${JSON.stringify(body)}`);
    } else {
      console.log(`[shopify] ✓ ${queryName} — ${elapsed}ms`);
    }

    clearTimeout(timeoutId);
    releaseSlot();
    return {
      status: response.status,
      body: body.data,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    releaseSlot();
    const elapsed = Date.now() - startMs;
    const isAbort = (error as any)?.name === "AbortError";
    const cause = (error as any)?.cause;
    console.error(
      `[shopify] ✗ ${queryName} — ${isAbort ? "AbortError (10s timeout)" : `${cause?.code ?? "fetch failed"}`} after ${elapsed}ms — endpoint: ${endpoint}`,
      error
    );
    throw error;
  }
}

/** Homepage category tabs + product grids (all collections from Shopify, capped). */
export async function getCollections() {
  if (shouldUseShopifyMock()) {
    return getMockCollections();
  }

  const query = `
    query getCollections {
      collections(first: 50) {
        edges {
          node {
            id
            title
            description
            handle
            products(first: 12, sortKey: BEST_SELLING) {
              edges {
                node {
                  id
                  title
                  handle
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  featuredImage {
                    url
                    altText
                  }
                  variants(first: 1) {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  let response: { status: number; body: { collections: { edges: { node: any }[] } } | undefined };
  try {
    response = await shopifyFetch<{
      collections: {
        edges: {
          node: {
            id: string;
            title: string;
            description: string;
            handle: string;
            products: {
              edges: {
                node: {
                  id: string;
                  title: string;
                  handle: string;
                  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
                  featuredImage: { url: string; altText: string | null } | null;
                  variants: { edges: { node: { id: string } }[] };
                };
              }[];
            };
          };
        }[];
      };
    }>({ query });
  } catch (err) {
    console.error("[shopify] getCollections fetch error:", err);
    return [];
  }

  if (!response.body?.collections) {
    console.error("[shopify] getCollections: no collections in response body. Status:", response.status, "Body:", JSON.stringify(response.body));
    return [];
  }

  const rows = response.body.collections.edges
    .map((edge) => {
      const node = edge.node;
      const products = node.products.edges.map(
        (productEdge: {
          node: {
            id: string;
            title: string;
            handle: string;
            priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
            featuredImage: { url: string; altText: string | null } | null;
            variants: { edges: { node: { id: string } }[] };
          };
        }) => {
          const pNode = productEdge.node;
          const amount = pNode.priceRange.minVariantPrice.amount;
          const currencyCode = pNode.priceRange.minVariantPrice.currencyCode;
          return {
            id: pNode.id,
            variantId: pNode.variants.edges[0]?.node.id ?? null,
            title: pNode.title,
            handle: pNode.handle,
            price: formatPrice(amount, currencyCode),
            priceAmount: amount,
            currencyCode,
            imageUrl: pNode.featuredImage?.url ?? "",
          };
        }
      );

      return {
        id: node.id,
        title: node.title,
        description: node.description ?? "",
        handle: node.handle,
        products,
      };
    })
    .filter((c) => c.products.length > 0);

  rows.sort((a, b) => a.title.localeCompare(b.title));
  return rows;
}

export type MarqueeProduct = {
  id: string;
  title: string;
  handle: string;
  imageUrl: string | null;
};

/** Scrolling marquee strip — bestsellers from the catalog. */
export async function getMarqueeProducts(limit = 24): Promise<MarqueeProduct[]> {
  if (shouldUseShopifyMock()) {
    return getMockMarqueeProducts(limit);
  }

  const query = `
    query MarqueeProducts($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING, query: "available_for_sale:true") {
        edges {
          node {
            id
            title
            handle
            featuredImage {
              url
              altText
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch<{
      products: {
        edges: {
          node: {
            id: string;
            title: string;
            handle: string;
            featuredImage: { url: string; altText: string | null } | null;
          };
        }[];
      };
    }>({ query, variables: { first: Math.min(limit, 50) } });

    if (!response.body?.products?.edges?.length) {
      return [];
    }

    return response.body.products.edges.map((e) => ({
      id: e.node.id,
      title: e.node.title,
      handle: e.node.handle,
      imageUrl: e.node.featuredImage?.url ?? null,
    }));
  } catch {
    return [];
  }
}

export type ShopProduct = {
  id: string;
  variantId: string | null;
  title: string;
  handle: string;
  priceDisplay: string;
  priceAmount: string;
  currencyCode: string;
  imageUrl: string | null;
  imageAlt: string | null;
};

/** Full shop grid (up to 250 products per request). */
export async function getAllProductsForShop(limit = 250): Promise<ShopProduct[]> {
  if (shouldUseShopifyMock()) {
    return getMockAllProductsForShop().slice(0, limit);
  }

  const query = `
    query ShopProducts($first: Int!) {
      products(first: $first, sortKey: TITLE, query: "available_for_sale:true") {
        edges {
          node {
            id
            title
            handle
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch<{
      products: {
        edges: {
          node: {
            id: string;
            title: string;
            handle: string;
            featuredImage: { url: string; altText: string | null } | null;
            priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
            variants: { edges: { node: { id: string } }[] };
          };
        }[];
      };
    }>({ query, variables: { first: Math.min(limit, 250) } });

    if (!response.body?.products?.edges?.length) {
      return [];
    }

    return response.body.products.edges.map(({ node: n }) => ({
      id: n.id,
      variantId: n.variants.edges[0]?.node.id ?? null,
      title: n.title,
      handle: n.handle,
      priceAmount: n.priceRange.minVariantPrice.amount,
      currencyCode: n.priceRange.minVariantPrice.currencyCode,
      priceDisplay: formatPrice(
        n.priceRange.minVariantPrice.amount,
        n.priceRange.minVariantPrice.currencyCode
      ),
      imageUrl: n.featuredImage?.url ?? null,
      imageAlt: n.featuredImage?.altText ?? n.title,
    }));
  } catch {
    return [];
  }
}

/** Lightweight collection row for navigation / mega menu (Storefront API). */
export type NavCollection = {
  id: string;
  title: string;
  handle: string;
  imageUrl: string | null;
  imageAlt: string | null;
};

export async function getNavCollections(): Promise<NavCollection[]> {
  if (shouldUseShopifyMock()) {
    return getMockNavCollections();
  }

  const query = `
    query getNavCollections {
      collections(first: 50) {
        edges {
          node {
            id
            title
            handle
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  let response: {
    status: number;
    body:
      | {
          collections: {
            edges: {
              node: {
                id: string;
                title: string;
                handle: string;
                image: { url: string; altText: string | null } | null;
              };
            }[];
          };
        }
      | undefined;
  };

  try {
    response = await shopifyFetch<{
      collections: {
        edges: {
          node: {
            id: string;
            title: string;
            handle: string;
            image: { url: string; altText: string | null } | null;
          };
        }[];
      };
    }>({ query });
  } catch {
    return [];
  }

  if (!response.body?.collections?.edges?.length) {
    return [];
  }

  const rows = response.body.collections.edges.map((edge) => {
    const n = edge.node;
    return {
      id: n.id,
      title: n.title,
      handle: n.handle,
      imageUrl: n.image?.url ?? null,
      imageAlt: n.image?.altText ?? n.title,
    };
  });
  rows.sort((a, b) => a.title.localeCompare(b.title));
  return rows;
}

export type { FooterNavColumn, FooterNavLink } from "@/lib/footer-nav";

type MenuItemGql = {
  id: string;
  title: string;
  url: string | null;
  items: MenuItemGql[];
};

function flattenFooterLeafLinks(items: MenuItemGql[]): FooterNavLink[] {
  const out: FooterNavLink[] = [];
  for (const it of items) {
    if (it.items?.length) {
      out.push(...flattenFooterLeafLinks(it.items));
    } else if (it.url) {
      const { href, external } = menuUrlToHref(it.url);
      out.push({ id: it.id, title: it.title, href, external });
    }
  }
  return out;
}

function menuItemsToFooterColumns(items: MenuItemGql[]): FooterNavColumn[] {
  return items
    .map((item) => {
      if (item.items?.length) {
        const links = flattenFooterLeafLinks(item.items);
        return { id: item.id, title: item.title, links };
      }
      const { href, external } = menuUrlToHref(item.url);
      return {
        id: item.id,
        title: item.title,
        links: [{ id: `${item.id}-link`, title: item.title, href, external }],
      };
    })
    .filter((col) => col.links.length > 0);
}

async function fetchFooterMenuFromShopify(handle: string): Promise<FooterNavColumn[] | null> {
  const query = `
    query FooterMenu($handle: String!) {
      menu(handle: $handle) {
        id
        items {
          ...MenuItemFields
        }
      }
    }
    fragment MenuItemFields on MenuItem {
      id
      title
      url
      items {
        id
        title
        url
        items {
          id
          title
          url
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch<{
      menu: { id: string; items: MenuItemGql[] } | null;
    }>({ query, variables: { handle } });
    const items = response.body?.menu?.items;
    if (!items?.length) {
      return null;
    }
    const columns = menuItemsToFooterColumns(items);
    return columns.length ? columns : null;
  } catch {
    return null;
  }
}

/**
 * Footer link columns from the Shopify navigation menu (handle via SHOPIFY_FOOTER_MENU_HANDLE, default `footer`),
 * or the same structure as mock/fallback from collections + core pages when the menu is missing or empty.
 */
export async function getFooterColumns(collections: NavCollection[]): Promise<FooterNavColumn[]> {
  if (shouldUseShopifyMock()) {
    return getMockFooterMenu();
  }

  const handle = process.env.SHOPIFY_FOOTER_MENU_HANDLE?.trim() || "footer";
  const fromStore = await fetchFooterMenuFromShopify(handle);
  if (fromStore?.length) {
    return fromStore;
  }
  return buildFallbackFooterColumns(collections);
}

/**
 * Flat link list from the Shopify `main-menu` navigation (used as the "Shop" column in the footer).
 * Falls back to collection-based mock links when using mock mode or the menu is unavailable.
 */
export async function getMainMenuLinks(
  fallbackCollections: NavCollection[],
): Promise<FooterNavLink[]> {
  if (shouldUseShopifyMock()) {
    return getMockMainMenuLinks();
  }

  try {
    const query = `
      query MainMenu($handle: String!) {
        menu(handle: $handle) {
          items {
            id
            title
            url
            items {
              id
              title
              url
            }
          }
        }
      }
    `;
    const response = await shopifyFetch<{
      menu: { items: MenuItemGql[] } | null;
    }>({ query, variables: { handle: "main-menu" } });
    const items = response.body?.menu?.items;
    if (items?.length) {
      return flattenFooterLeafLinks(items).map((link) => {
        // Convert /collections/<handle> → /shop?collection=<handle>
        const collectionMatch = link.href.match(/^\/collections\/([^/?#]+)/);
        if (collectionMatch) {
          return { ...link, href: `/shop?collection=${encodeURIComponent(collectionMatch[1]!)}`, external: false };
        }
        return link;
      });
    }
  } catch {
    // fall through to fallback
  }

  // Fallback: derive links from nav collections
  return [
    { id: "fb-all", title: "All Products", href: "/shop", external: false },
    ...fallbackCollections.slice(0, 8).map((c) => ({
      id: c.id,
      title: c.title,
      href: `/shop?collection=${encodeURIComponent(c.handle)}`,
      external: false,
    })),
  ];
}

export type CollectionProductSummary = {
  id: string;
  variantId: string | null;
  title: string;
  handle: string;
  price: string;
  currencyCode: string;
  imageUrl: string | null;
  imageAlt: string | null;
};

export type CollectionPageData = {
  id: string;
  title: string;
  description: string;
  handle: string;
  products: CollectionProductSummary[];
};

export async function getCollectionByHandle(handle: string): Promise<CollectionPageData | null> {
  const cleanHandle = handle?.trim().toLowerCase();
  if (!cleanHandle || cleanHandle.length > 255 || !HANDLE_RE.test(cleanHandle)) return null;

  if (shouldUseShopifyMock()) {
    return getMockCollectionByHandle(cleanHandle);
  }

  const query = `
    query getCollectionByHandle($handle: String!) {
      collection(handle: $handle) {
        id
        title
        description
        handle
        products(first: 48) {
          edges {
            node {
              id
              title
              handle
              featuredImage {
                url
                altText
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  let response: {
    body:
      | {
          collection: {
            id: string;
            title: string;
            description: string;
            handle: string;
            products: {
              edges: {
                node: {
                  id: string;
                  title: string;
                  handle: string;
                  featuredImage: { url: string; altText: string | null } | null;
                  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
                  variants: { edges: { node: { id: string } }[] };
                };
              }[];
            };
          } | null;
        }
      | undefined;
  };

  try {
    response = await shopifyFetch<{
      collection: {
        id: string;
        title: string;
        description: string;
        handle: string;
        products: {
          edges: {
            node: {
              id: string;
              title: string;
              handle: string;
              featuredImage: { url: string; altText: string | null } | null;
              priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
              variants: { edges: { node: { id: string } }[] };
            };
          }[];
        };
      } | null;
    }>({ query, variables: { handle } });
  } catch (err) {
    console.error("[shopify] getCollectionByHandle fetch error for handle:", handle, err);
    return null;
  }

  const col = response.body?.collection;
  if (!col) {
    console.error("[shopify] getCollectionByHandle: null collection for handle:", handle, "status:", (response as any).status, "body:", JSON.stringify(response.body));
    return null;
  }

  const products: CollectionProductSummary[] = col.products.edges.map(({ node: n }) => ({
    id: n.id,
    variantId: n.variants.edges[0]?.node.id ?? null,
    title: n.title,
    handle: n.handle,
    price: n.priceRange.minVariantPrice.amount,
    currencyCode: n.priceRange.minVariantPrice.currencyCode,
    imageUrl: n.featuredImage?.url ?? null,
    imageAlt: n.featuredImage?.altText ?? n.title,
  }));

  return {
    id: col.id,
    title: col.title,
    description: col.description ?? "",
    handle: col.handle,
    products,
  };
}

export type ProductDetail = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  priceDisplay: string;
  amount: string;
  currencyCode: string;
  featuredImageUrl: string | null;
  imageAlt: string | null;
  gallery: { url: string; alt: string | null }[];
  benefits: string[];
  ingredients: { name: string; amount: string }[];
  source: "shopify" | "mock";
  /** Variant pack sizing / SKUs — empty when single default variant only. */
  variants: ProductVariantSummary[];
  /** Product-reference bundle (metafield custom.bundle_products). */
  bundleProducts: ReferencedProductSummary[];
  /** Merchandising companions (metafield custom.frequently_bought_together). */
  frequentlyBoughtTogether: ReferencedProductSummary[];
  /** Featured quote (metafields custom.featured_review_*). */
  featuredReview: PdpFeaturedReview | null;
  /** Ingredient rows from metaobject list custom.ingredients_detailed. */
  ingredientEntries: PdpIngredientEntry[];
  /** Short directions copy for the card (custom.directions_summary). */
  directionsSummary: string | null;
  /** Expanded copy for “Read more” (custom.directions_full). */
  directionsFull: string | null;
  /** Journey milestones (metaobject list custom.timeline_items). */
  timelineItems: PdpTimelineMilestone[];
  /** Trust badges shown below description (custom.trust_badges — multi-line, one per line). */
  trustBadges: string[];
  /** FAQ accordion items (metaobject list custom.faq_items). */
  faqItems: PdpFaqItem[];
  /** Customer reviews (metaobject list custom.product_reviews). */
  productReviews: PdpProductReview[];
  /** SEO title from global.title_tag metafield (used in <title>). */
  seoTitle: string | null;
  /** SEO description from global.description_tag metafield (used in <meta description>). */
  seoDescription: string | null;
};

export type { ProductVariantSummary, ReferencedProductSummary } from "@/lib/shopify-referenced-products";
export type { PdpFeaturedReview, PdpIngredientEntry, PdpTimelineMilestone, PdpFaqItem, PdpProductReview } from "@/lib/shopify-pdp-meta";

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** PDP: live Storefront product or mock row (preview). */
const HANDLE_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;

export async function getProductDetail(handle: string): Promise<ProductDetail | null> {
  const clean = handle?.trim().toLowerCase();
  if (!clean || clean.length > 255 || !HANDLE_RE.test(clean)) return null;

  if (shouldUseShopifyMock()) {
    const m = getMockProductDetail(clean);
    if (!m) return null;
    return {
      id: m.id,
      title: m.title,
      handle: m.handle,
      description: m.description,
      descriptionHtml: m.description,
      priceDisplay: m.priceDisplay,
      amount: m.amount,
      currencyCode: m.currencyCode,
      featuredImageUrl: m.featuredImageUrl,
      imageAlt: m.imageAlt,
      gallery: m.gallery.map((g) => ({ url: g.url, alt: g.alt })),
      benefits: m.benefits,
      ingredients: m.ingredients,
      source: "mock",
      variants: m.variants,
      bundleProducts: m.bundleProducts,
      frequentlyBoughtTogether: m.frequentlyBoughtTogether,
      featuredReview: m.featuredReview,
      ingredientEntries: m.ingredientEntries,
      directionsSummary: m.directionsSummary,
      directionsFull: m.directionsFull,
      timelineItems: m.timelineItems,
      trustBadges: m.trustBadges,
      faqItems: m.faqItems,
      productReviews: m.productReviews,
      seoTitle: null,
      seoDescription: null,
    };
  }

  const query = `
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        featuredImage {
          url
          altText
        }
        images(first: 8) {
          edges {
            node {
              url
              altText
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
        bundle_products: metafield(namespace: "custom", key: "bundle_products") {
          references(first: 10) {
            edges {
              node {
                ... on Product {
                  id
                  handle
                  title
                  featuredImage {
                    url
                    altText
                  }
                  variants(first: 1) {
                    edges {
                      node {
                        id
                        availableForSale
                        price {
                          amount
                          currencyCode
                        }
                        compareAtPrice {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        frequently_bought_together: metafield(namespace: "custom", key: "frequently_bought_together") {
          references(first: 10) {
            edges {
              node {
                ... on Product {
                  id
                  handle
                  title
                  featuredImage {
                    url
                    altText
                  }
                  variants(first: 1) {
                    edges {
                      node {
                        id
                        availableForSale
                        price {
                          amount
                          currencyCode
                        }
                        compareAtPrice {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        featured_review_text: metafield(namespace: "custom", key: "featured_review_text") {
          value
        }
        featured_review_author: metafield(namespace: "custom", key: "featured_review_author") {
          value
        }
        featured_review_since: metafield(namespace: "custom", key: "featured_review_since") {
          value
        }
        directions_summary: metafield(namespace: "custom", key: "directions_summary") {
          value
        }
        directions_full: metafield(namespace: "custom", key: "directions_full") {
          value
        }
        ingredients_detailed: metafield(namespace: "custom", key: "ingredients_detailed") {
          references(first: 50) {
            edges {
              node {
                ... on Metaobject {
                  fields {
                    key
                    value
                  }
                }
              }
            }
          }
        }
        timeline_items: metafield(namespace: "custom", key: "timeline_items") {
          references(first: 10) {
            edges {
              node {
                ... on Metaobject {
                  fields {
                    key
                    value
                  }
                }
              }
            }
          }
        }
        trust_badges: metafield(namespace: "custom", key: "trust_badges") {
          value
        }
        faq_items: metafield(namespace: "custom", key: "faq_items") {
          references(first: 20) {
            edges {
              node {
                ... on Metaobject {
                  fields {
                    key
                    value
                  }
                }
              }
            }
          }
        }
        product_reviews: metafield(namespace: "custom", key: "product_reviews") {
          references(first: 50) {
            edges {
              node {
                ... on Metaobject {
                  fields {
                    key
                    value
                  }
                }
              }
            }
          }
        }
        faq: metafield(namespace: "custom", key: "faq") {
          value
        }
        seo_title: metafield(namespace: "global", key: "title_tag") {
          value
        }
        seo_description: metafield(namespace: "global", key: "description_tag") {
          value
        }
      }
    }
  `;

  let response: {
    body:
      | {
          product: {
            id: string;
            title: string;
            handle: string;
            description: string | null;
            descriptionHtml: string | null;
            featuredImage: { url: string; altText: string | null } | null;
            images: {
              edges: { node: { url: string; altText: string | null } }[];
            };
            priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
            variants: {
              edges: {
                node: {
                  id: string;
                  title: string;
                  availableForSale: boolean;
                  price: { amount: string; currencyCode: string };
                  compareAtPrice: { amount: string; currencyCode: string } | null;
                };
              }[];
            };
            bundle_products: Parameters<typeof referencedProductsFromMetafield>[0];
            frequently_bought_together: Parameters<typeof referencedProductsFromMetafield>[0];
            featured_review_text: { value: string } | null;
            featured_review_author: { value: string } | null;
            featured_review_since: { value: string } | null;
            directions_summary: { value: string } | null;
            directions_full: { value: string } | null;
            ingredients_detailed: {
              references: {
                edges: { node: { fields: { key: string; value: string | null }[] } | null }[];
              } | null;
            } | null;
            timeline_items: {
              references: {
                edges: { node: { fields: { key: string; value: string | null }[] } | null }[];
              } | null;
            } | null;
            trust_badges: { value: string } | null;
            faq_items: {
              references: {
                edges: { node: { fields: { key: string; value: string | null }[] } | null }[];
              } | null;
            } | null;
            product_reviews: {
              references: {
                edges: { node: { fields: { key: string; value: string | null }[] } | null }[];
              } | null;
            } | null;
            faq: { value: string } | null;
            seo_title: { value: string } | null;
            seo_description: { value: string } | null;
          } | null;
        }
      | undefined;
  };

  try {
    response = await shopifyFetch<{
      product: {
        id: string;
        title: string;
        handle: string;
        description: string | null;
        descriptionHtml: string | null;
        featuredImage: { url: string; altText: string | null } | null;
        images: {
          edges: { node: { url: string; altText: string | null } }[];
        };
        priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
        variants: {
          edges: {
            node: {
              id: string;
              title: string;
              availableForSale: boolean;
              price: { amount: string; currencyCode: string };
              compareAtPrice: { amount: string; currencyCode: string } | null;
            };
          }[];
        };
        bundle_products: Parameters<typeof referencedProductsFromMetafield>[0];
        frequently_bought_together: Parameters<typeof referencedProductsFromMetafield>[0];
        featured_review_text: { value: string } | null;
        featured_review_author: { value: string } | null;
        featured_review_since: { value: string } | null;
        directions_summary: { value: string } | null;
        directions_full: { value: string } | null;
        ingredients_detailed: {
          references: {
            edges: { node: { fields: { key: string; value: string | null }[] } | null }[];
          } | null;
        } | null;
        timeline_items: {
          references: {
            edges: { node: { fields: { key: string; value: string | null }[] } | null }[];
          } | null;
        } | null;
        trust_badges: { value: string } | null;
        faq_items: {
          references: {
            edges: { node: { fields: { key: string; value: string | null }[] } | null }[];
          } | null;
        } | null;
        product_reviews: {
          references: {
            edges: { node: { fields: { key: string; value: string | null }[] } | null }[];
          } | null;
        } | null;
        faq: { value: string } | null;
        seo_title: { value: string } | null;
        seo_description: { value: string } | null;
      } | null;
    }>({ query, variables: { handle: clean } });
  } catch {
    return null;
  }

  const p = response.body?.product;
  if (!p) return null;

  const plain =
    p.description?.trim() ||
    (p.descriptionHtml ? stripHtml(p.descriptionHtml) : "") ||
    "";

  const variantEdges = p.variants?.edges ?? [];
  const variants: ProductVariantSummary[] = variantEdges.map((e) => variantFromGql(e.node));
  const firstVariant = variants[0];
  const min = firstVariant
    ? { amount: firstVariant.priceAmount, currencyCode: firstVariant.currencyCode }
    : p.priceRange.minVariantPrice;

  const galleryEdges = p.images?.edges ?? [];
  const gallery = galleryEdges.map((e) => ({
    url: e.node.url,
    alt: e.node.altText ?? p.title,
  }));
  const featured = p.featuredImage?.url ?? gallery[0]?.url ?? null;
  const featuredAlt = p.featuredImage?.altText ?? gallery[0]?.alt ?? p.title;

  const bundleProducts = referencedProductsFromMetafield(p.bundle_products ?? null);
  const frequentlyBoughtTogether = referencedProductsFromMetafield(p.frequently_bought_together ?? null);

  const quote = p.featured_review_text?.value?.trim();
  const author = p.featured_review_author?.value?.trim();
  const featuredReview: PdpFeaturedReview | null =
    quote && author
      ? {
          quote,
          author,
          customerSince: p.featured_review_since?.value?.trim() ?? null,
        }
      : null;

  const ingredientEntries = parseIngredientReferences(p.ingredients_detailed?.references?.edges);
  const directionsSummary = p.directions_summary?.value?.trim() ?? null;
  const directionsFull = p.directions_full?.value?.trim() ?? null;
  const timelineItems = parseTimelineReferences(p.timeline_items?.references?.edges);

  const rawBadges = p.trust_badges?.value?.trim() ?? "";
  const trustBadges = rawBadges
    ? rawBadges.split(/\n+/).map((s) => s.trim()).filter(Boolean)
    : [];
  const faqItems =
    parseFaqReferences(p.faq_items?.references?.edges).length > 0
      ? parseFaqReferences(p.faq_items?.references?.edges)
      : parseFaqJson(p.faq?.value);
  const productReviews = parseReviewReferences(p.product_reviews?.references?.edges);
  const seoTitle = p.seo_title?.value?.trim() || null;
  const seoDescription = p.seo_description?.value?.trim() || null;

  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    description: plain,
    descriptionHtml: sanitizeDescriptionHtml(p.descriptionHtml ?? plain),
    priceDisplay: formatPrice(min.amount, min.currencyCode),
    amount: min.amount,
    currencyCode: min.currencyCode,
    featuredImageUrl: featured,
    imageAlt: featuredAlt,
    gallery: gallery.length > 0 ? gallery : featured ? [{ url: featured, alt: featuredAlt }] : [],
    benefits: [],
    ingredients: [],
    source: "shopify",
    variants,
    bundleProducts,
    frequentlyBoughtTogether,
    featuredReview,
    ingredientEntries,
    directionsSummary,
    directionsFull,
    timelineItems,
    trustBadges,
    faqItems,
    productReviews,
    seoTitle,
    seoDescription,
  };
}

// ---------------------------------------------------------------------------
// Cached exports — use these in pages and layouts instead of the raw functions.
// unstable_cache stores results in Next.js's server-side data cache, keyed by
// the arguments, so concurrent requests and revalidations share one result.
// ---------------------------------------------------------------------------

/** Cached nav collections — 1 hour TTL. Used in layout on every page. */
export const getNavCollectionsCached = unstable_cache(
  getNavCollections,
  ["nav-collections"],
  { revalidate: 3600, tags: ["nav"] }
);

/** Cached footer columns — 1 hour TTL. Used in layout on every page. */
export const getFooterColumnsCached = unstable_cache(
  getFooterColumns,
  ["footer-columns"],
  { revalidate: 3600, tags: ["nav"] }
);

/** Cached main menu links — 1 hour TTL. Used in layout on every page. */
export const getMainMenuLinksCached = unstable_cache(
  getMainMenuLinks,
  ["main-menu-links"],
  { revalidate: 3600, tags: ["nav"] }
);

/** Cached collections (homepage tabs) — 5 min TTL. */
export const getCollectionsCached = unstable_cache(
  getCollections,
  ["collections"],
  { revalidate: 300, tags: ["collections"] }
);

/** Cached marquee products — 5 min TTL. */
export const getMarqueeProductsCached = unstable_cache(
  (limit: number) => getMarqueeProducts(limit),
  ["marquee-products"],
  { revalidate: 300, tags: ["products"] }
);

/** Cached full shop product list — 5 min TTL. */
export const getAllProductsForShopCached = unstable_cache(
  (limit?: number) => getAllProductsForShop(limit),
  ["all-products"],
  { revalidate: 300, tags: ["products"] }
);

/** Cached collection page data — 5 min TTL. */
export const getCollectionByHandleCached = unstable_cache(
  (handle: string) => getCollectionByHandle(handle),
  ["collection-by-handle"],
  { revalidate: 300, tags: ["collections"] }
);

/** Cached product detail — 5 min TTL. */
export const getProductDetailCached = unstable_cache(
  (handle: string) => getProductDetail(handle),
  ["product-detail"],
  { revalidate: 300, tags: ["products"] }
);
