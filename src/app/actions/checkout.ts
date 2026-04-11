"use server";

import type { CartItem } from "@/store/cartStore";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// ─── startup diagnostic ────────────────────────────────────────────────────────
console.log(
  "[checkout:boot] SHOPIFY_STORE_DOMAIN            :", domain ? `"${domain}"` : "MISSING",
  "\n[checkout:boot] SHOPIFY_STOREFRONT_ACCESS_TOKEN :",
    storefrontAccessToken
      ? `set (${storefrontAccessToken.length} chars, starts "${storefrontAccessToken.slice(0, 4)}…")`
      : "MISSING",
  "\n[checkout:boot] SHOPIFY_MYSHOPIFY_DOMAIN        :",
    process.env.SHOPIFY_MYSHOPIFY_DOMAIN
      ? `"${process.env.SHOPIFY_MYSHOPIFY_DOMAIN}"`
      : "not set",
);

function bareHost(d: string): string {
  return d.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function isVariantGid(id: string): boolean {
  return id.startsWith("gid://shopify/ProductVariant/");
}

export type CheckoutResult = {
  cartId: string;
  checkoutUrl: string;
};

export async function createShopifyCheckout(
  items: CartItem[],
): Promise<CheckoutResult | null> {
  console.log("[checkout] ── createShopifyCheckout called ──────────────────");
  console.log("[checkout] cart items received:", items.length);
  items.forEach((item, i) => {
    console.log(`[checkout] item[${i}]:`, {
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      isVariantGid: isVariantGid(item.id),
    });
  });

  if (!domain?.trim()) {
    console.error("[checkout] ABORT — SHOPIFY_STORE_DOMAIN is not set");
    return null;
  }
  if (!storefrontAccessToken?.trim()) {
    console.error("[checkout] ABORT — SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set");
    return null;
  }

  const lines = items
    .filter((item) => isVariantGid(item.id))
    .map((item) => ({ merchandiseId: item.id, quantity: item.quantity }));

  console.log("[checkout] valid GID lines:", lines.length, "of", items.length);

  if (lines.length === 0) {
    console.error(
      "[checkout] ABORT — no valid variant GIDs. Item IDs:",
      items.map((i) => i.id),
    );
    return null;
  }

  const endpoint = `https://${bareHost(domain)}/api/2026-01/graphql.json`;
  console.log("[checkout] Storefront API endpoint:", endpoint);

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
          code
        }
      }
    }
  `;

  let res: Response;
  try {
    console.log("[checkout] POSTing cartCreate …");
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({ query: mutation, variables: { input: { lines } } }),
    });
  } catch (err) {
    console.error("[checkout] fetch threw:", err);
    return null;
  }

  console.log("[checkout] cartCreate HTTP:", res.status, res.statusText);

  if (!res.ok) {
    const body = await res.text();
    console.error("[checkout] HTTP error body:", body);
    return null;
  }

  let json: {
    data?: {
      cartCreate?: {
        cart?: { id: string; checkoutUrl: string };
        userErrors?: { field: string; message: string; code?: string }[];
      };
    };
    errors?: unknown[];
  };

  try {
    json = await res.json();
  } catch (err) {
    console.error("[checkout] JSON parse failed:", err);
    return null;
  }

  console.log("[checkout] full response:", JSON.stringify(json));

  if (json.errors?.length) {
    console.error("[checkout] GraphQL errors:", JSON.stringify(json.errors));
  }

  const userErrors = json.data?.cartCreate?.userErrors;
  if (userErrors?.length) {
    console.error("[checkout] userErrors:", JSON.stringify(userErrors));
  }

  const cart = json.data?.cartCreate?.cart;
  if (!cart?.id || !cart?.checkoutUrl) {
    console.error("[checkout] ABORT — no cart.id or cart.checkoutUrl in response");
    return null;
  }

  // ── URL strategy ────────────────────────────────────────────────────────────
  // Shopify returns checkoutUrl on the store's primary domain.
  //
  // Case A — primary domain IS *.myshopify.com:
  //   checkoutUrl = https://85jdm8-hq.myshopify.com/cart/c/…  ← works directly
  //
  // Case B — primary domain is a custom domain (e.g. nutrizen.co.za):
  //   checkoutUrl = https://nutrizen.co.za/cart/c/…
  //   DNS for nutrizen.co.za → this Next.js app (not Shopify) → 404
  //
  //   FIX: next.config.ts rewrites /cart/c/* → Shopify transparently, so the
  //   browser stays on nutrizen.co.za and never hits a 404.
  //   We must return the ORIGINAL URL here — do NOT rewrite to myshopify.com —
  //   because sending the browser directly to myshopify.com bypasses the proxy
  //   and Shopify redirects back to the primary domain (nutrizen.co.za) → loop.
  //
  const checkoutUrl = cart.checkoutUrl;

  console.log("[checkout] ── returning to client ──────────────────────────");
  console.log("[checkout] cartId     :", cart.id);
  console.log("[checkout] checkoutUrl:", checkoutUrl);
  console.log(
    "[checkout] checkoutUrl host:",
    new URL(checkoutUrl).host,
    new URL(checkoutUrl).host.endsWith(".myshopify.com")
      ? "← direct (no proxy needed)"
      : "← custom domain (next.config proxy will intercept /cart/c/…)",
  );

  return { cartId: cart.id, checkoutUrl };
}
