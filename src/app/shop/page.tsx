import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllProductsForShop,
  getCollectionByHandle,
  getNavCollections,
  getMainMenuLinks,
  type ShopProduct,
} from "@/lib/shopify";
import { formatPrice } from "@/lib/formatPrice";
import ShopPageClient from "@/components/shop/ShopPageClient";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export const metadata: Metadata = {
  title: "Shop Supplements",
  description:
    "Browse the full NutriZen supplement range. Immune support, magnesium, vitamin D3, iron, glutathione, and more – premium formulas with transparent ingredients, delivered across South Africa.",
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
    title: "Shop Supplements | NutriZen",
    description:
      "Premium natural supplements with transparent ingredients. Browse immune support, energy, sleep, and mineral formulas – delivered across South Africa.",
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>;
}) {
  const { collection: collectionParam } = await searchParams;
  const collectionHandle = collectionParam?.trim();

  const navCollections = await getNavCollections();
  const menuLinks = await getMainMenuLinks(navCollections);

  // Build an ordered list of collections matching the Shopify main-menu.
  // Fall back to all nav collections if the menu has no collection links.
  const menuHandles = menuLinks
    .map((l) => {
      const m = l.href.match(/[?&]collection=([^&]+)/);
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
    const col = await getCollectionByHandle(collectionHandle);
    if (!col) notFound();
    products = col.products.map((p) => ({
      id: p.id,
      variantId: p.variantId,
      title: p.title,
      handle: p.handle,
      priceDisplay: formatPrice(p.price, p.currencyCode),
      imageUrl: p.imageUrl,
      imageAlt: p.imageAlt,
    }));
  } else {
    products = await getAllProductsForShop();
  }

  return (
    <ShopPageClient
      products={products}
      collections={filteredCollections}
      currentCollection={collectionHandle}
    />
  );
}
