import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllProductsForShopCached,
  getCollectionByHandleCached,
  getNavCollectionsCached,
  getMainMenuLinksCached,
  type ShopProduct,
} from "@/lib/shopify";
import { formatPrice } from "@/lib/formatPrice";
import ShopPageClient from "@/components/shop/ShopPageClient";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export const metadata: Metadata = {
  title: "Buy Supplements Online South Africa",
  description:
    "Shop all 12 NutriZen supplements: magnesium, vitamin D, iron, zinc, B-vitamins, adaptogens and more. Made in South Africa. Free delivery over R690.",
  keywords: [
    "buy supplements South Africa",
    "online supplement store",
    "natural vitamins South Africa",
    "magnesium supplement",
    "immune support",
    "vitamin D South Africa",
    "iron supplement",
    "NutriZen shop",
  ],
  alternates: { canonical: `${SITE_URL}/shop` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/shop`,
    title: "Buy Supplements Online South Africa | NutriZen",
    description:
      "Shop all 12 NutriZen supplements: magnesium, vitamin D, iron, zinc, B-vitamins, adaptogens and more. Made in South Africa. Free delivery over R690.",
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>;
}) {
  const { collection: collectionParam } = await searchParams;
  const collectionHandle = collectionParam?.trim();

  // "frontpage" is Shopify's auto-generated Home page collection — never a real
  // shopping goal, so it's excluded from the Shop page's goal filters.
  const navCollections = (await getNavCollectionsCached()).filter((c) => c.handle !== "frontpage");
  const menuLinks = await getMainMenuLinksCached(navCollections);

  // Build an ordered list of collections matching the Shopify main-menu.
  // Fall back to all nav collections if the menu has no collection links.
  const menuHandles = menuLinks
    .map((l) => {
      const m = l.href.match(/^\/collections\/([^/?#]+)/);
      return m ? decodeURIComponent(m[1]!) : null;
    })
    .filter((h): h is string => h !== null);

  const filteredCollections =
    menuHandles.length > 0
      ? menuHandles
          .map((h) => navCollections.find((c) => c.handle === h))
          .filter((c): c is NonNullable<typeof c> => c !== undefined)
      : navCollections;

  let products: ShopProduct[];

  if (collectionHandle) {
    const col = await getCollectionByHandleCached(collectionHandle);
    if (!col) notFound();
    products = col.products.map((p) => ({
      id: p.id,
      variantId: p.variantId,
      title: p.title,
      handle: p.handle,
      priceAmount: p.price,
      currencyCode: p.currencyCode,
      priceDisplay: formatPrice(p.price, p.currencyCode),
      imageUrl: p.imageUrl,
      imageAlt: p.imageAlt,
    }));
  } else {
    products = await getAllProductsForShopCached();
  }

  return (
    <ShopPageClient
      products={products}
      collections={filteredCollections}
      currentCollection={collectionHandle}
    />
  );
}
