import { notFound } from "next/navigation";
import {
  getAllProductsForShop,
  getCollectionByHandle,
  getNavCollections,
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

  const [navCollections] = await Promise.all([getNavCollections()]);

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
      collections={navCollections}
      currentCollection={collectionHandle}
    />
  );
}
