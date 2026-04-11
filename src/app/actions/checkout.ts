"use server";

import type { CartItem } from "@/store/cartStore";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
// The raw *.myshopify.com subdomain used to rewrite the checkoutUrl host.
// Shopify returns checkoutUrl using your custom domain (e.g. nutrizen.co.za)
// which resolves to your Next.js app and 404s. We rewrite it to the myshopify
// domain so the browser hits Shopify's checkout servers directly.
const myshopifyDomain = process.env.SHOPIFY_MYSHOPIFY_DOMAIN?.trim();

/** Returns true if the id looks like a real Shopify variant GID. */
function isVariantGid(id: string): boolean {
  return id.startsWith("gid://shopify/ProductVariant/");
}

/**
 * Creates a Shopify cart from the current cart items and returns the hosted
 * checkout URL. Items without a valid Shopify variant GID are skipped.
 *
 * Returns null when Shopify is not configured or the cart is empty after
 * filtering, so the caller can show a suitable error.
 */
export async function createShopifyCheckout(
  items: CartItem[]
): Promise<string | null> {
  if (!domain?.trim() || !storefrontAccessToken?.trim()) {
    return null;
  }

  const lines = items
    .filter((item) => isVariantGid(item.id))
    .map((item) => ({ merchandiseId: item.id, quantity: item.quantity }));

  if (lines.length === 0) {
    return null;
  }

  const endpoint = `https://${domain.replace(/^https?:\/\//, "").replace(/\/$/, "")}/api/2026-01/graphql.json`;

  const mutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
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
          cart?: { checkoutUrl: string };
          userErrors?: { field: string; message: string }[];
        };
      };
    };

    const userErrors = json.data?.cartCreate?.userErrors;
    if (userErrors?.length) {
      console.error("[checkout] Shopify cartCreate userErrors:", userErrors);
    }

    const checkoutUrl = json.data?.cartCreate?.cart?.checkoutUrl;
    if (!checkoutUrl) return null;

    // If the store uses a custom domain, Shopify embeds that domain in the
    // checkoutUrl. Rewrite the host to the raw myshopify.com domain so the
    // browser reaches Shopify's checkout servers instead of our Next.js app.
    if (myshopifyDomain) {
      try {
        const parsed = new URL(checkoutUrl);
        parsed.host = myshopifyDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
        return parsed.toString();
      } catch {
        // If URL parsing fails for any reason, fall back to the original URL.
      }
    }

    return checkoutUrl;
  } catch (err) {
    console.error("[checkout] cartCreate fetch error:", err);
    return null;
  }
}
