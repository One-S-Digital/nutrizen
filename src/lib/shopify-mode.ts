/**
 * When true, all catalog reads use `shopify-mock` instead of the Storefront API.
 *
 * Mock is used automatically when:
 * - **Vercel Preview** - `VERCEL_ENV === "preview"` (PR / preview deployments)
 * - **Local dev** - `NODE_ENV === "development"` (`next dev`) so you get a full catalog without secrets
 *
 * Override:
 * - `SHOPIFY_USE_MOCK=true` - force mock (e.g. `next start` with no store)
 * - `SHOPIFY_USE_MOCK=false` - force live Storefront API (local dev or preview with credentials)
 */
export function shouldUseShopifyMock(): boolean {
  const explicit = process.env.SHOPIFY_USE_MOCK?.trim().toLowerCase();
  if (explicit === "true" || explicit === "1") return true;
  if (explicit === "false" || explicit === "0") return false;
  if (process.env.VERCEL_ENV === "preview") return true;
  if (process.env.NODE_ENV === "development") return true;
  return false;
}

export const isShopifyMockMode = shouldUseShopifyMock;
