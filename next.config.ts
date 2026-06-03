import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' data: blob: cdn.shopify.com",
      "media-src 'self' cdn.shopify.com",
      "connect-src 'self' *.myshopify.com *.shopify.com",
      "frame-src challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' *.myshopify.com *.shopify.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ["sanitize-html"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // Custom loader: Shopify CDN handles resizing/format via URL params.
    // Images are served directly from cdn.shopify.com (Fastly edge) — Render
    // server is never involved in image delivery.
    loader: "custom",
    loaderFile: "./src/lib/shopify-image-loader.ts",
    // deviceSizes drives the srcset widths passed to the loader.
    // Shopify CDN transforms to exactly these pixel widths.
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
  },
};

export default nextConfig;
