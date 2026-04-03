import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllProductsForShop,
  getCollectionByHandle,
  getNavCollections,
  type ShopProduct,
} from "@/lib/shopify";
import { formatPrice } from "@/lib/formatPrice";

export const revalidate = 300;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>;
}) {
  const { collection: collectionParam } = await searchParams;
  const collectionHandle = collectionParam?.trim();

  const navCollections = await getNavCollections();

  let heading = "Shop all";
  let products: ShopProduct[];

  if (collectionHandle) {
    const col = await getCollectionByHandle(collectionHandle);
    if (!col) {
      notFound();
    }
    heading = col.title;
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
    <div className="bg-background-main min-h-screen pb-24 pt-10">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="text-sm text-neutral-dark mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-darkest">Shop</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-darkest">{heading}</h1>
          <p className="mt-2 text-neutral-dark text-sm max-w-2xl">
            Everything below is loaded from your Shopify catalog. Filter by collection or browse the full store.
          </p>
        </header>

        {navCollections.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            <Link
              href="/shop"
              className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
                !collectionHandle
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-neutral-light bg-white text-neutral-dark hover:border-primary/40"
              }`}
            >
              All products
            </Link>
            {navCollections.map((c) => (
              <Link
                key={c.id}
                href={`/shop?collection=${encodeURIComponent(c.handle)}`}
                className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
                  collectionHandle === c.handle
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-neutral-light bg-white text-neutral-dark hover:border-primary/40"
                }`}
              >
                {c.title}
              </Link>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <p className="text-neutral-dark py-12">
            No products found. Add products in Shopify Admin and ensure the Storefront API token is set on Render
            (<code className="text-xs bg-neutral-light/80 px-1 rounded">SHOPIFY_STORE_DOMAIN</code>,{" "}
            <code className="text-xs bg-neutral-light/80 px-1 rounded">SHOPIFY_STOREFRONT_ACCESS_TOKEN</code>
            ).
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/products/${p.handle}`}
                  className="group block bg-white rounded-2xl border border-neutral-light/80 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[4/5] bg-background-alt flex items-center justify-center p-6">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.imageAlt ?? p.title}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <span className="text-neutral-dark text-sm opacity-40">No image</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="font-bold text-neutral-darkest group-hover:text-primary transition-colors line-clamp-2">
                      {p.title}
                    </h2>
                    <p className="mt-2 font-semibold text-neutral-dark">{p.priceDisplay}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
