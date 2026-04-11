"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/formatPrice";
import type { ReferencedProductSummary } from "@/lib/shopify-referenced-products";

type Props = {
  products: ReferencedProductSummary[];
  currencyCode: string;
};

export function FrequentlyBoughtTogetherSection({ products, currencyCode }: Props) {
  const { addToCart } = useCartStore();
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(products.map((p) => [p.variantId, true])),
  );

  const { subtotalAmount, selectedCount } = useMemo(() => {
    let sum = 0;
    let n = 0;
    for (const p of products) {
      if (!selected[p.variantId] || !p.availableForSale) continue;
      sum += parseFloat(p.priceAmount);
      n += 1;
    }
    return { subtotalAmount: sum.toFixed(2), selectedCount: n };
  }, [products, selected]);

  if (!products.length) return null;

  const toggle = (variantId: string) => {
    setSelected((prev) => ({ ...prev, [variantId]: !prev[variantId] }));
  };

  const addSelected = () => {
    for (const p of products) {
      if (!selected[p.variantId] || !p.availableForSale) continue;
      addToCart({
        id: p.variantId,
        productId: p.productId,
        title: p.title,
        price: p.priceAmount,
        currencyCode,
        image: p.imageUrl ?? "",
      });
    }
  };

  return (
    <section
      className="rounded-3xl border border-neutral-light bg-background-alt p-6 shadow-sm md:p-8"
      aria-labelledby="fbt-heading"
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <ShoppingBag className="h-6 w-6 text-secondary" aria-hidden />
        <h2 id="fbt-heading" className="font-serif text-2xl font-semibold tracking-tight text-neutral-darkest">
          Frequently bought together
        </h2>
      </div>
      <p className="mb-6 text-sm text-neutral-dark">
        Select the items you want and add them with one click. Uncheck any product to exclude it.
      </p>
      <ul className="space-y-4">
        {products.map((p) => {
          const isSelected = Boolean(selected[p.variantId]);
          const disabled = !p.availableForSale;
          return (
            <li
              key={p.variantId}
              className={`flex gap-4 rounded-2xl border border-white bg-white p-4 shadow-sm ${disabled ? "opacity-60" : ""}`}
            >
              <label className="flex min-w-0 flex-1 cursor-pointer gap-4">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 shrink-0 rounded border-neutral-light text-primary focus:ring-ring"
                  checked={isSelected}
                  disabled={disabled}
                  onChange={() => toggle(p.variantId)}
                />
                <Link href={`/products/${p.handle}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-neutral-light bg-background-main">
                  {p.imageUrl ? (
                    <Image src={p.imageUrl} alt={p.imageAlt ?? p.title} fill className="object-contain p-1" sizes="96px" />
                  ) : null}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${p.handle}`} className="font-semibold text-neutral-darkest hover:text-primary">
                    {p.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <span className="text-lg font-bold">{p.priceDisplay}</span>
                    {p.compareAtDisplay ? (
                      <span className="text-sm text-neutral-dark line-through">{p.compareAtDisplay}</span>
                    ) : null}
                  </div>
                  {disabled ? <p className="mt-1 text-xs text-destructive">Unavailable</p> : null}
                </div>
              </label>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 flex flex-col gap-4 border-t border-neutral-light pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-neutral-dark">Selected items ({selectedCount})</p>
          <p className="text-2xl font-bold text-neutral-darkest">{formatPrice(subtotalAmount, currencyCode)}</p>
        </div>
        <Button type="button" size="lg" disabled={selectedCount === 0} onClick={addSelected}>
          Add selected to cart
        </Button>
      </div>
    </section>
  );
}
