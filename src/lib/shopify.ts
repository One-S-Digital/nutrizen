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

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

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

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, ...(variables && { variables }) }),
      // cache: "force-cache",
    });

    const body = await response.json();

    if (body.errors) {
      console.error("[shopify] GraphQL errors:", JSON.stringify(body.errors));
      throw body.errors[0];
    }

    if (!body.data) {
      console.error("[shopify] Response had no data. Status:", response.status, "Body:", JSON.stringify(body));
    }

    return {
      status: response.status,
      body: body.data, // Return just the data part by default
    };
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
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
            products(first: 12, sortKey: BEST_SELLING, query: "available_for_sale:true") {
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
          };
        }) => {
          const pNode = productEdge.node;
          const amount = pNode.priceRange.minVariantPrice.amount;
          const currencyCode = pNode.priceRange.minVariantPrice.currencyCode;
          return {
            id: pNode.id,
            title: pNode.title,
            handle: pNode.handle,
            price: formatPrice(amount, currencyCode),
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
  title: string;
  handle: string;
  priceDisplay: string;
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
          };
        }[];
      };
    }>({ query, variables: { first: Math.min(limit, 250) } });

    if (!response.body?.products?.edges?.length) {
      return [];
    }

    return response.body.products.edges.map(({ node: n }) => ({
      id: n.id,
      title: n.title,
      handle: n.handle,
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
  if (shouldUseShopifyMock()) {
    return getMockCollectionByHandle(handle);
  }

  const query = `
    query getCollectionByHandle($handle: String!) {
      collection(handle: $handle) {
        id
        title
        description
        handle
        products(first: 48, query: "available_for_sale:true") {
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
            };
          }[];
        };
      } | null;
    }>({ query, variables: { handle } });
  } catch {
    return null;
  }

  const col = response.body?.collection;
  if (!col) {
    return null;
  }

  const products: CollectionProductSummary[] = col.products.edges.map(({ node: n }) => ({
    id: n.id,
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
export async function getProductDetail(handle: string): Promise<ProductDetail | null> {
  const clean = handle?.trim();
  if (!clean) return null;

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
    descriptionHtml: p.descriptionHtml ?? plain,
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
