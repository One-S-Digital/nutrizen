"use client";

import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { savingsPercent } from "@/lib/shopify-referenced-products";
import type { ReferencedProductSummary } from "@/lib/shopify-referenced-products";

type Props = {
  products: ReferencedProductSummary[];
};

export function BundleSaveSection({ products }: Props) {
  const { addToCart } = useCartStore();

  if (!products.length) return null;

  const handleAddBundle = () => {
    for (const p of products) {
      if (!p.availableForSale) continue;
      addToCart({
        id: p.variantId,
        productId: p.productId,
        title: p.title,
        price: p.priceAmount,
        image: p.imageUrl ?? "",
      });
    }
  };

  const allUnavailable = products.every((p) => !p.availableForSale);

  return (
    <section className="rounded-3xl border border-primary/25 bg-white p-6 shadow-sm md:p-8" aria-labelledby="bundle-save-heading">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Package className="h-6 w-6 text-primary" aria-hidden />
        <h2 id="bundle-save-heading" className="font-serif text-2xl font-semibold tracking-tight text-neutral-darkest">
          Bundle &amp; save
        </h2>
        <span className="rounded-full bg-primary/15 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-neutral-darkest">
          Multi-product offer
        </span>
      </div>
      <p className="mb-6 text-sm text-neutral-dark">
        Complete your routine with these paired products. Add all to your cart in one step, or open any item to view its page.
      </p>
      <ul className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const pct = savingsPercent(p.priceAmount, p.compareAtAmount);
          return (
            <li
              key={p.variantId}
              className="flex flex-col overflow-hidden rounded-2xl border border-neutral-light bg-background-main"
            >
              <Link href={`/products/${p.handle}`} className="group block flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <div className="relative aspect-square w-full bg-white p-4">
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.imageAlt ?? p.title}
                      fill
                      className="object-contain p-2 transition group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-neutral-dark/50">No image</div>
                  )}
                </div>
                <div className="space-y-1 px-4 pb-3 pt-1">
                  <p className="font-semibold text-neutral-darkest group-hover:text-primary">{p.title}</p>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-lg font-bold text-neutral-darkest">{p.priceDisplay}</span>
                    {p.compareAtDisplay ? (
                      <span className="text-sm text-neutral-dark line-through">{p.compareAtDisplay}</span>
                    ) : null}
                    {pct != null ? (
                      <span className="rounded-md bg-primary/20 px-2 py-0.5 text-xs font-semibold text-neutral-darkest">
                        Save {pct}%
                      </span>
                    ) : null}
                  </div>
                  {!p.availableForSale ? (
                    <p className="text-xs font-medium text-destructive">Out of stock</p>
                  ) : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <Button type="button" size="lg" className="w-full sm:w-auto" disabled={allUnavailable} onClick={handleAddBundle}>
        Add bundle to cart
      </Button>
    </section>
  );
}
