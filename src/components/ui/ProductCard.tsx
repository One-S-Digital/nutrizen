"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { optimizeShopifyImage } from "@/lib/optimize-shopify-image";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  id: string;
  title: string;
  /** Display string from Shopify (includes currency symbol). */
  price: string;
  /** Raw numeric amount string, e.g. "299.00". Used for accurate cart totals. */
  priceAmount: string;
  /** ISO currency code, e.g. "ZAR". */
  currencyCode: string;
  image: string;
  badge?: string;
  handle: string;
  /** Pass true for above-the-fold cards (first row) to preload the image. */
  priority?: boolean;
}

export function ProductCard({ id, title, price, priceAmount, currencyCode, image, badge, handle, priority = false }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const hasImage = Boolean(image && image.startsWith("https://"));
  const optimizedImage = hasImage ? optimizeShopifyImage(image) : image;
  const reduceMotion = useReducedMotion();

  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 200, damping: 25 });
  const springY = useSpring(rawY, { stiffness: 200, damping: 25 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      style={
        reduceMotion
          ? { boxShadow: "0 2px 16px -4px rgba(47,58,51,0.08), 0 0 0 1px rgba(47,58,51,0.04)" }
          : {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              perspective: 800,
              boxShadow: "0 2px 16px -4px rgba(47,58,51,0.08), 0 0 0 1px rgba(47,58,51,0.04)",
            }
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={reduceMotion ? {} : { y: -8, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      className="group flex flex-col bg-white rounded-[2rem] border border-neutral-light overflow-hidden relative cursor-pointer"
    >
      {/* Hover shadow overlay — deepens on hover */}
      <motion.div
        className="absolute inset-0 rounded-[2rem] pointer-events-none z-0"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ boxShadow: "0 24px 60px -12px rgba(47,58,51,0.22), 0 8px 20px -6px rgba(47,58,51,0.12)" }}
      />

      {badge && (
        <span className="absolute top-4 left-4 z-10 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase">
          {badge}
        </span>
      )}

      {/* Image area */}
      <Link
        href={`/products/${handle}`}
        className="block relative aspect-[4/5] bg-background-main overflow-hidden w-full"
        tabIndex={-1}
      >
        <div className="w-full h-full bg-white rounded-t-full shadow-inner border border-neutral-light flex items-center justify-center overflow-hidden relative">
          {hasImage ? (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              whileHover={{ scale: 1.07 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={optimizedImage}
                alt={title}
                fill
                className="object-contain p-6"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={priority}
              />
            </motion.div>
          ) : (
            <div className="text-center opacity-30 pointer-events-none text-sm px-4">
              [Product<br />Image]
            </div>
          )}

          {/* Gradient overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-primary/6 via-transparent to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </Link>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col flex-grow">
        <Link href={`/products/${handle}`}>
          <h3 className="font-bold text-lg text-neutral-darkest mb-2 line-clamp-2 hover:text-primary transition-colors duration-200">
            {title}
          </h3>
        </Link>
        <p className="text-neutral-dark font-semibold mb-6 text-base">{price}</p>

        <div className="mt-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              fullWidth
              variant="primary"
              className="py-4 transition-shadow duration-300 group-hover:shadow-[0_4px_16px_-2px_rgba(140,171,119,0.4)]"
              onClick={() =>
                addToCart({
                  id,
                  title,
                  price: priceAmount,
                  currencyCode,
                  image: hasImage ? image : "",
                })
              }
            >
              Add to Cart
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
