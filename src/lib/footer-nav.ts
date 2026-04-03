/** Footer navigation — shared types and URL handling for Shopify menu + fallbacks. */

export type FooterNavLink = {
  id: string;
  title: string;
  href: string;
  external: boolean;
};

export type FooterNavColumn = {
  id: string;
  title: string;
  links: FooterNavLink[];
};

function storeHostnames(): Set<string> {
  const raw = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").trim();
  const primary = raw?.split("/")[0]?.toLowerCase();
  const extra =
    process.env.SHOPIFY_PUBLIC_STORE_DOMAINS?.split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean) ?? [];
  return new Set([primary, ...extra].filter(Boolean) as string[]);
}

/**
 * Maps a Shopify Online Store menu URL to an in-app path when the link targets this store;
 * otherwise keeps the full URL and marks it external (e.g. social, external blog).
 */
export function menuUrlToHref(url: string | null | undefined): { href: string; external: boolean } {
  if (!url?.trim()) {
    return { href: "#", external: false };
  }

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    const hosts = storeHostnames();
    const checkoutPaths =
      parsed.pathname.startsWith("/cart") ||
      parsed.pathname.startsWith("/account") ||
      parsed.pathname.startsWith("/checkouts");

    if (checkoutPaths) {
      return { href: trimmed, external: true };
    }

    if (hosts.size > 0 && hosts.has(parsed.hostname.toLowerCase())) {
      return { href: parsed.pathname + parsed.search + parsed.hash, external: false };
    }

    return { href: trimmed, external: true };
  } catch {
    if (trimmed.startsWith("/")) {
      return { href: trimmed, external: false };
    }
    return { href: trimmed, external: true };
  }
}

export function buildFallbackFooterColumns(
  collections: { id: string; title: string; handle: string }[]
): FooterNavColumn[] {
  return [
    {
      id: "fallback-shop",
      title: "Shop",
      links: [
        { id: "fallback-all", title: "All products", href: "/shop", external: false },
        ...collections.slice(0, 8).map((c) => ({
          id: c.id,
          title: c.title,
          href: `/shop?collection=${encodeURIComponent(c.handle)}`,
          external: false,
        })),
      ],
    },
    {
      id: "fallback-about",
      title: "About",
      links: [
        { id: "fallback-story", title: "Our Story", href: "/pages/about", external: false },
        { id: "fallback-science", title: "The Science", href: "/pages/science", external: false },
        { id: "fallback-faq", title: "FAQ", href: "/pages/faq", external: false },
        { id: "fallback-contact", title: "Contact Us", href: "/pages/contact", external: false },
      ],
    },
  ];
}
