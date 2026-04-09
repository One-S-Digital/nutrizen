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
