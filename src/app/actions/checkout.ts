"use server";

import type { CartItem } from "@/store/cartStore";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
// Explicit override — set this when your store uses a custom primary domain so
// Shopify embeds that domain in checkoutUrl instead of *.myshopify.com.
const explicitMyshopifyDomain = process.env.SHOPIFY_MYSHOPIFY_DOMAIN?.trim();

/** Strips protocol and trailing slash from a domain string. */
function bareHost(d: string): string {
  return d.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** Cached myshopify domain — populated once per cold start from the shop query. */
let cachedMyshopifyDomain: string | null = null;

/**
 * Queries shop.myshopifyDomain via the Storefront API so we can rewrite
 * checkout URLs that embed the store's custom primary domain.
 */
async function fetchMyshopifyDomain(endpoint: string): Promise<string | null> {
  if (cachedMyshopifyDomain) return cachedMyshopifyDomain;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken!,
      },
      body: JSON.stringify({ query: "{ shop { myshopifyDomain } }" }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: { shop?: { myshopifyDomain?: string } };
    };
    const host = json.data?.shop?.myshopifyDomain?.trim();
    if (host) {
      cachedMyshopifyDomain = host;
      console.log("[checkout] auto-detected myshopify domain:", host);
    }
    return host ?? null;
  } catch {
    return null;
  }
}

/**
 * Rewrites the checkoutUrl host to a *.myshopify.com domain so the browser
 * reaches Shopify's checkout servers instead of the Next.js app.
 *
 * Priority:
 *  1. SHOPIFY_MYSHOPIFY_DOMAIN env var (explicit override)
 *  2. Auto-detected via shop.myshopifyDomain query
 *  3. SHOPIFY_STORE_DOMAIN itself if it already ends in .myshopify.com
 *  4. Original URL unchanged (will likely 404 on a headless setup)
 */
async function rewriteCheckoutHost(
  checkoutUrl: string,
  endpoint: string,
): Promise<string> {
  try {
    const parsed = new URL(checkoutUrl);

    // Already on myshopify.com — nothing to do.
    if (parsed.host.endsWith(".myshopify.com")) return checkoutUrl;

    // 1. Explicit env override
    let target = explicitMyshopifyDomain;

    // 2. Auto-detect from Shopify's own shop query
    if (!target) {
      target = (await fetchMyshopifyDomain(endpoint)) ?? undefined;
    }

    // 3. SHOPIFY_STORE_DOMAIN if it's already a myshopify domain
    if (!target && domain && bareHost(domain).endsWith(".myshopify.com")) {
      target = bareHost(domain);
    }

    if (target) {
      parsed.host = bareHost(target);
      return parsed.toString();
    }

    console.warn(
      "[checkout] Could not resolve a *.myshopify.com host for checkout URL. " +
        "Set SHOPIFY_MYSHOPIFY_DOMAIN to your store's *.myshopify.com subdomain. URL:",
      checkoutUrl,
    );
  } catch {
    // URL parsing failed — fall through
  }
  return checkoutUrl;
}

function isVariantGid(id: string): boolean {
  return id.startsWith("gid://shopify/ProductVariant/");
}

export type CheckoutResult = {
  cartId: string;
  checkoutUrl: string;
};

/**
 * Creates a Shopify cart from the current cart items and returns both the
 * cart GID and the hosted checkout URL.
 *
 * Items without a valid Shopify variant GID are skipped.
 * Returns null when Shopify is not configured or the cart is empty after filtering.
 */
export async function createShopifyCheckout(
  items: CartItem[],
): Promise<CheckoutResult | null> {
  if (!domain?.trim() || !storefrontAccessToken?.trim()) {
    console.warn("[checkout] Shopify credentials not configured.");
    return null;
  }

  const lines = items
    .filter((item) => isVariantGid(item.id))
    .map((item) => ({ merchandiseId: item.id, quantity: item.quantity }));

  if (lines.length === 0) {
    console.warn("[checkout] No valid Shopify variant GIDs in cart.");
    return null;
  }

  const endpoint = `https://${bareHost(domain)}/api/2026-01/graphql.json`;

  const mutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({ query: mutation, variables: { input: { lines } } }),
    });

    if (!res.ok) {
      console.error("[checkout] Shopify cartCreate HTTP error:", res.status);
      return null;
    }

    const json = (await res.json()) as {
      data?: {
        cartCreate?: {
          cart?: { id: string; checkoutUrl: string };
          userErrors?: { field: string; message: string }[];
        };
      };
    };

    const userErrors = json.data?.cartCreate?.userErrors;
    if (userErrors?.length) {
      console.error("[checkout] Shopify cartCreate userErrors:", userErrors);
    }

    const cart = json.data?.cartCreate?.cart;
    if (!cart?.checkoutUrl || !cart?.id) return null;

    const checkoutUrl = await rewriteCheckoutHost(cart.checkoutUrl, endpoint);
    console.log("[checkout] cart:", cart.id, "→", checkoutUrl);

    return { cartId: cart.id, checkoutUrl };
  } catch (err) {
    console.error("[checkout] cartCreate fetch error:", err);
    return null;
  }
}
