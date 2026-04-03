"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  id: string;
  title: string;
  /** Display string from Shopify (includes currency). */
  price: string;
  image: string;
  badge?: string;
  handle: string;
}

export function ProductCard({ id, title, price, image, badge, handle }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const hasImage = image && image.startsWith("https://");

  return (
    <div className="group flex flex-col bg-white rounded-[2rem] border border-neutral-light overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative">
      {badge && (
        <span className="absolute top-4 left-4 z-10 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase">
          {badge}
        </span>
      )}

      <Link href={`/products/${handle}`} className="block relative aspect-[4/5] bg-background-main overflow-hidden w-full">
        <div className="w-full h-full bg-white rounded-t-full shadow-inner border border-neutral-light flex items-center justify-center group-hover:scale-105 transition-transform duration-700 ease-out overflow-hidden relative">
          {hasImage ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain p-6"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="text-center opacity-30 pointer-events-none text-sm px-4">
              [Product
              <br />
              Image]
            </div>
          )}
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/products/${handle}`}>
          <h3 className="font-bold text-lg text-neutral-darkest mb-2 line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-neutral-dark font-medium mb-6">{price}</p>

        <div className="mt-auto">
          <Button
            fullWidth
            variant="primary"
            className="py-4"
            onClick={() =>
              addToCart({
                id,
                title,
                price,
                image: hasImage ? image : "",
              })
            }
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
