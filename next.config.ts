import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Enable HSTS (1 year, include subdomains)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Limit referrer info sent to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict browser feature APIs
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js inline scripts + GSAP/Framer Motion need unsafe-inline; nonce-based CSP would be ideal but requires middleware
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' data: blob: cdn.shopify.com",
      "media-src 'self' cdn.shopify.com",
      "connect-src 'self' *.myshopify.com *.shopify.com",
      // Shopify checkout renders in a child browsing context — allow it to frame itself
      "frame-ancestors 'none'",
      "base-uri 'self'",
      // Shopify checkout submits payment forms; allow to Shopify domains
      "form-action 'self' *.myshopify.com *.shopify.com",
    ].join("; "),
  },
];

// ─── Shopify checkout proxy ────────────────────────────────────────────────────
// When the store has a custom primary domain set in Shopify Admin (e.g.
// nutrizen.co.za), Shopify embeds that domain in cartCreate checkoutUrls.
// Since nutrizen.co.za's DNS points to this Next.js app (not Shopify),
// requests to /cart/c/… and /checkouts/… would 404 here. These rewrites
// proxy those paths through to Shopify's servers transparently — the browser
// URL stays on nutrizen.co.za so Shopify doesn't redirect away.
//
// Requires SHOPIFY_MYSHOPIFY_DOMAIN=85jdm8-hq.myshopify.com in Render env.
function shopifyCheckoutRewrites() {
  const raw =
    process.env.SHOPIFY_MYSHOPIFY_DOMAIN?.trim() ??
    process.env.SHOPIFY_STORE_DOMAIN?.trim() ??
    "";
  const host = raw.replace(/^https?:\/\//, "").replace(/\/$/, "");

  if (!host.endsWith(".myshopify.com")) {
    console.warn(
      "[next.config] No *.myshopify.com host found — Shopify checkout proxy rewrites DISABLED.",
      "Set SHOPIFY_MYSHOPIFY_DOMAIN=your-store.myshopify.com in Render env.",
    );
    return [];
  }

  const base = `https://${host}`;
  console.log("[next.config] Shopify checkout proxy → ", base);

  return [
    // New Cart API checkout URL format (Shopify 2024+)
    { source: "/cart/c/:path*",      destination: `${base}/cart/c/:path*` },
    // Legacy checkout URL format
    { source: "/checkouts/:path*",   destination: `${base}/checkouts/:path*` },
    // Payment processing callbacks
    { source: "/payments/:path*",    destination: `${base}/payments/:path*` },
    // Checkout session / thank-you pages
    { source: "/thank_you/:path*",   destination: `${base}/thank_you/:path*` },
  ];
}

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling sanitize-html (CJS package) — load it from node_modules at runtime
  serverExternalPackages: ["sanitize-html"],

  async rewrites() {
    return shopifyCheckoutRewrites();
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
