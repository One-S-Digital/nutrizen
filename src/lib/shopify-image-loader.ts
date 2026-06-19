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
 *
 * Local /public images: the built-in optimizer is disabled (custom loader), so
 * heavy PNGs would otherwise ship full-size to every device. Instead we map them
 * to pre-generated responsive WebP variants (scripts/optimize-images.js writes
 * optimized-images.ts) and pick the smallest variant ≥ the requested width.
 */
import { OPTIMIZED_IMAGES } from "./optimized-images";

interface ShopifyLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function shopifyLoader({ src, width, quality }: ShopifyLoaderProps): string {
  if (src.startsWith("https://cdn.shopify.com")) {
    const url = new URL(src);
    url.searchParams.set("width", String(width));
    url.searchParams.set("format", "webp");
    url.searchParams.set("quality", String(quality ?? 85));
    return url.toString();
  }

  // Local image with pre-generated WebP variants — serve the right-sized one.
  const key = src.includes("%") ? decodeURI(src) : src;
  const variant = OPTIMIZED_IMAGES[key];
  if (variant) {
    const w = variant.widths.find((x) => x >= width) ?? variant.widths[variant.widths.length - 1];
    return `/optimized/${variant.slug}/${w}.webp`;
  }

  // Other local / non-Shopify images — return untransformed.
  return src;
}
