"use server";

import type { CartItem } from "@/store/cartStore";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const explicitMyshopifyDomain = process.env.SHOPIFY_MYSHOPIFY_DOMAIN?.trim();

// ─── startup diagnostic ────────────────────────────────────────────────────────
// Printed once when this module is first loaded on the server so Render logs
// immediately show the resolved config without needing to trigger a request.
console.log(
  "[checkout:boot]",
  "SHOPIFY_STORE_DOMAIN         :", domain ? `"${domain}"` : "MISSING",
  "\n[checkout:boot]",
  "SHOPIFY_STOREFRONT_ACCESS_TOKEN :", storefrontAccessToken
    ? `set (${storefrontAccessToken.length} chars, starts "${storefrontAccessToken.slice(0, 4)}…")`
    : "MISSING",
  "\n[checkout:boot]",
  "SHOPIFY_MYSHOPIFY_DOMAIN     :", explicitMyshopifyDomain ? `"${explicitMyshopifyDomain}"` : "not set (will auto-detect)",
);

function bareHost(d: string): string {
  return d.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function isVariantGid(id: string): boolean {
  return id.startsWith("gid://shopify/ProductVariant/");
}

// ─── myshopify domain auto-detection ──────────────────────────────────────────

let cachedMyshopifyDomain: string | null = null;

async function fetchMyshopifyDomain(endpoint: string): Promise<string | null> {
  if (cachedMyshopifyDomain) {
    console.log("[checkout:domain] using cached myshopify domain:", cachedMyshopifyDomain);
    return cachedMyshopifyDomain;
  }

  console.log("[checkout:domain] querying shop { myshopifyDomain } from", endpoint);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken!,
      },
      body: JSON.stringify({ query: "{ shop { myshopifyDomain } }" }),
    });

    console.log("[checkout:domain] shop query HTTP status:", res.status);

    if (!res.ok) {
      const body = await res.text();
      console.error("[checkout:domain] shop query failed — status:", res.status, "body:", body);
      return null;
    }

    const json = (await res.json()) as {
      data?: { shop?: { myshopifyDomain?: string } };
      errors?: unknown[];
    };

    console.log("[checkout:domain] shop query raw response:", JSON.stringify(json));

    if (json.errors?.length) {
      console.error("[checkout:domain] shop query GraphQL errors:", JSON.stringify(json.errors));
    }

    const host = json.data?.shop?.myshopifyDomain?.trim();
    if (host) {
      cachedMyshopifyDomain = host;
      console.log("[checkout:domain] resolved myshopify domain:", host);
    } else {
      console.warn("[checkout:domain] shop.myshopifyDomain was empty or missing in response");
    }
    return host ?? null;
  } catch (err) {
    console.error("[checkout:domain] shop query threw:", err);
    return null;
  }
}

// ─── URL rewrite ───────────────────────────────────────────────────────────────

async function rewriteCheckoutHost(
  checkoutUrl: string,
  endpoint: string,
): Promise<string> {
  console.log("[checkout:rewrite] raw checkoutUrl from Shopify:", checkoutUrl);

  let parsed: URL;
  try {
    parsed = new URL(checkoutUrl);
  } catch (err) {
    console.error("[checkout:rewrite] URL parse failed:", err, "returning as-is");
    return checkoutUrl;
  }

  console.log("[checkout:rewrite] checkoutUrl host:", parsed.host);

  if (parsed.host.endsWith(".myshopify.com")) {
    console.log("[checkout:rewrite] host is already *.myshopify.com — no rewrite needed");
    return checkoutUrl;
  }

  console.log("[checkout:rewrite] host is NOT *.myshopify.com — attempting rewrite");

  // Priority 1: explicit env var
  if (explicitMyshopifyDomain) {
    const target = bareHost(explicitMyshopifyDomain);
    parsed.host = target;
    console.log("[checkout:rewrite] rewritten via SHOPIFY_MYSHOPIFY_DOMAIN →", parsed.toString());
    return parsed.toString();
  }

  // Priority 2: auto-detect from shop query
  const autoDetected = await fetchMyshopifyDomain(endpoint);
  if (autoDetected) {
    const target = bareHost(autoDetected);
    parsed.host = target;
    console.log("[checkout:rewrite] rewritten via auto-detect →", parsed.toString());
    return parsed.toString();
  }

  // Priority 3: SHOPIFY_STORE_DOMAIN is already a myshopify domain
  if (domain && bareHost(domain).endsWith(".myshopify.com")) {
    const target = bareHost(domain);
    parsed.host = target;
    console.log("[checkout:rewrite] rewritten via SHOPIFY_STORE_DOMAIN →", parsed.toString());
    return parsed.toString();
  }

  // No rewrite possible — return original and warn loudly
  console.error(
    "[checkout:rewrite] ⚠️  COULD NOT REWRITE — no *.myshopify.com host available.",
    "The browser will be redirected to:", checkoutUrl,
    "— this will 404 if that domain points to this Next.js app.",
    "FIX: set SHOPIFY_MYSHOPIFY_DOMAIN=your-store.myshopify.com in your Render environment.",
  );
  return checkoutUrl;
}

// ─── main export ───────────────────────────────────────────────────────────────

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

  // Guard: credentials
  if (!domain?.trim()) {
    console.error("[checkout] ABORT — SHOPIFY_STORE_DOMAIN is not set");
    return null;
  }
  if (!storefrontAccessToken?.trim()) {
    console.error("[checkout] ABORT — SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set");
    return null;
  }

  // Filter to valid variant GIDs
  const lines = items
    .filter((item) => isVariantGid(item.id))
    .map((item) => ({ merchandiseId: item.id, quantity: item.quantity }));

  console.log("[checkout] valid GID lines to send:", lines.length, "of", items.length);

  if (lines.length === 0) {
    console.error(
      "[checkout] ABORT — no valid Shopify variant GIDs in cart.",
      "Items must have IDs like gid://shopify/ProductVariant/12345.",
      "All item IDs received:", items.map((i) => i.id),
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
    console.log("[checkout] POSTing cartCreate mutation …");
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({ query: mutation, variables: { input: { lines } } }),
    });
  } catch (err) {
    console.error("[checkout] fetch to Shopify threw:", err);
    return null;
  }

  console.log("[checkout] cartCreate HTTP status:", res.status, res.statusText);

  if (!res.ok) {
    const body = await res.text();
    console.error("[checkout] cartCreate HTTP error — body:", body);
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
    console.error("[checkout] failed to parse Shopify JSON response:", err);
    return null;
  }

  console.log("[checkout] cartCreate full response:", JSON.stringify(json));

  if (json.errors?.length) {
    console.error("[checkout] top-level GraphQL errors:", JSON.stringify(json.errors));
  }

  const userErrors = json.data?.cartCreate?.userErrors;
  if (userErrors?.length) {
    console.error("[checkout] cartCreate userErrors:", JSON.stringify(userErrors));
  }

  const cart = json.data?.cartCreate?.cart;
  if (!cart?.id) {
    console.error("[checkout] ABORT — cartCreate returned no cart.id");
    return null;
  }
  if (!cart?.checkoutUrl) {
    console.error("[checkout] ABORT — cartCreate returned no cart.checkoutUrl");
    return null;
  }

  console.log("[checkout] cart created successfully:", cart.id);

  const finalUrl = await rewriteCheckoutHost(cart.checkoutUrl, endpoint);

  console.log("[checkout] ── returning to client ─────────────────────────────");
  console.log("[checkout] cartId     :", cart.id);
  console.log("[checkout] checkoutUrl:", finalUrl);

  return { cartId: cart.id, checkoutUrl: finalUrl };
}
