"use server";

import type { CartItem } from "@/store/cartStore";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const myshopifyDomain = process.env.SHOPIFY_MYSHOPIFY_DOMAIN?.trim();

/** Strips protocol and trailing slash from a domain string. */
function bareHost(d: string): string {
  return d.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/**
 * Ensures the checkout URL points to a *.myshopify.com host so the browser
 * reaches Shopify's checkout servers instead of our Next.js app.
 *
 * Priority: SHOPIFY_MYSHOPIFY_DOMAIN → SHOPIFY_STORE_DOMAIN (if it's a
 * myshopify domain) → original URL unchanged.
 */
function rewriteCheckoutHost(checkoutUrl: string): string {
  try {
    const parsed = new URL(checkoutUrl);

    if (parsed.host.endsWith(".myshopify.com")) return checkoutUrl;

    const target =
      myshopifyDomain ||
      (domain && bareHost(domain).endsWith(".myshopify.com") ? domain : null);

    if (target) {
      parsed.host = bareHost(target);
      return parsed.toString();
    }

    console.warn(
      "[checkout] checkoutUrl host is not *.myshopify.com and SHOPIFY_MYSHOPIFY_DOMAIN is not set. " +
        "Checkout may 404. URL:",
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

    const checkoutUrl = rewriteCheckoutHost(cart.checkoutUrl);
    console.log("[checkout] cart created:", cart.id, "→", checkoutUrl);

    return { cartId: cart.id, checkoutUrl };
  } catch (err) {
    console.error("[checkout] cartCreate fetch error:", err);
    return null;
  }
}
