"use server";

import type { CartItem } from "@/store/cartStore";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

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

    return json.data?.cartCreate?.cart?.checkoutUrl ?? null;
  } catch (err) {
    console.error("[checkout] cartCreate fetch error:", err);
    return null;
  }
}
