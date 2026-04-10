export const revalidate = 300;

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCollectionByHandle } from "@/lib/shopify";
import { formatPrice } from "@/lib/formatPrice";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const data = await getCollectionByHandle(handle);
  if (!data) return {};

  const canonical = `${SITE_URL}/collections/${handle}`;
  const description =
    data.description
      ? `${data.description.slice(0, 140)} – Shop the ${data.title} range at NutriZen.`
      : `Shop the ${data.title} collection at NutriZen. Premium natural supplements with transparent ingredients, delivered across South Africa.`;

  return {
    title: data.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: `${data.title} | NutriZen`,
      description,
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const data = await getCollectionByHandle(handle);
  if (!data) {
    notFound();
  }

  const canonical = `${SITE_URL}/collections/${handle}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: data.title,
    url: canonical,
    description: data.description || undefined,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
        { "@type": "ListItem", position: 3, name: data.title, item: canonical },
      ],
    },
  };

  return (
    <div className="bg-background-main min-h-screen pb-24 pt-10">
      <JsonLd data={collectionSchema} />
      <div className="max-w-7xl mx-auto px-6">
        <nav className="text-sm text-neutral-dark mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-darkest">{data.title}</span>
        </nav>

        <header className="mb-12 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-darkest mb-3">{data.title}</h1>
          {data.description ? (
            <p className="text-neutral-dark text-lg leading-relaxed">{data.description}</p>
          ) : null}
        </header>

        {data.products.length === 0 ? (
          <p className="text-neutral-dark">No products in this collection yet.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {data.products.map((p) => (
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
                    <p className="mt-2 font-semibold text-neutral-dark">
                      {formatPrice(p.price, p.currencyCode)}
                    </p>
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
