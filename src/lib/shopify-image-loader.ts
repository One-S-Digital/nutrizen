/**
 * Custom Next.js Image loader that serves Shopify CDN images directly.
 *
 * Why: On Render (no edge CDN), the default /_next/image optimizer hits
 * the Node server for every image request. Shopify CDN (Fastly) already
 * handles resizing via URL params and caches globally — there's no benefit
 * in proxying through Render.
 *
 * Result: The browser receives direct cdn.shopify.com URLs with correct
 * width transforms and WebP format, served from Shopify's edge globally.
 * Non-Shopify images (e.g. local /public assets) are returned as-is.
 *
 * Shopify CDN transform params:
 *   width   — resize to this pixel width
 *   format  — webp (broad browser support, ~30% smaller than JPEG)
 *   quality — 1–100 (Shopify default: 100; we use 85 for a good size/quality balance)
 */

interface ShopifyLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function shopifyLoader({ src, width, quality }: ShopifyLoaderProps): string {
  // Local or non-Shopify images — return untransformed
  if (!src.startsWith("https://cdn.shopify.com")) {
    return src;
  }

  const url = new URL(src);
  url.searchParams.set("width", String(width));
  url.searchParams.set("format", "webp");
  url.searchParams.set("quality", String(quality ?? 85));
  return url.toString();
}
