"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { ProductCard } from "@/components/ui/ProductCard";
import { scrollEase, scrollViewport } from "@/lib/motion";

export interface Product {
  id: string;
  variantId?: string | null;
  title: string;
  price: string;
  priceAmount?: string;
  currencyCode?: string;
  imageUrl?: string;
  handle: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  handle: string;
  products: Product[];
}

const GOAL_ICONS: Record<string, string> = {
  immunity: "🛡️",
  energy: "⚡",
  stress: "🧘",
  sleep: "🌙",
  detox: "🌿",
  metabolism: "🔥",
  recovery: "💪",
  focus: "🎯",
  heart: "❤️",
  gut: "🌱",
};

function getCategoryIcon(title: string): string {
  const lower = title.toLowerCase();
  for (const [key, icon] of Object.entries(GOAL_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "✦";
}

const BRAND_COLORS = ["#8CAB77", "#D87D4A", "#6995B1", "#425244", "#B35A5A", "#7C9C8C"];

function getCategoryColor(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BRAND_COLORS[Math.abs(hash) % BRAND_COLORS.length];
}

export default function CategoryShowcase({ categories }: { categories: Category[] }) {
  const reduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<Category>(categories[0]);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    setActiveCategory(categories[0]);
  }, [categories]);

  if (!categories || categories.length === 0) return null;

  const handleCategoryChange = (cat: Category) => {
    const oldIdx = categories.findIndex((c) => c.id === activeCategory.id);
    const newIdx = categories.findIndex((c) => c.id === cat.id);
    setDirection(newIdx >= oldIdx ? 1 : -1);
    setActiveCategory(cat);
  };

  const gridVariants: Variants = {
    enter: (dir: number) => ({
      opacity: 0,
      y: dir * 20,
    }),
    center: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.5,
        ease: scrollEase,
        staggerChildren: reduceMotion ? 0 : 0.07,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir * -16,
      transition: { duration: reduceMotion ? 0 : 0.3, ease: [0.4, 0, 1, 1] },
    }),
  };

  const cardVariants: Variants = {
    enter: { opacity: 0, y: 24, scale: 0.97 },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reduceMotion ? 0 : 0.55, ease: scrollEase },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      transition: { duration: reduceMotion ? 0 : 0.25 },
    },
  };

  return (
    <section className="py-28 bg-background-main relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(140,171,119,0.07),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-14"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.85, ease: scrollEase }}
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-4">
            Shop by Goal
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-darkest mb-4 leading-tight">
            Find Your Perfect Formula
          </h2>
          <p className="text-lg text-neutral-dark leading-relaxed">
            Every body is different. Start with your goal.
          </p>
        </motion.div>

        {/* Category pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2.5 mb-14"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.7, delay: 0.1, ease: scrollEase }}
        >
          {categories.map((category) => {
            const isActive = activeCategory.id === category.id;
            const color = getCategoryColor(category.title);
            const icon = getCategoryIcon(category.title);

            return (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryChange(category)}
                whileHover={reduceMotion ? {} : { scale: 1.05, y: -1 }}
                whileTap={reduceMotion ? {} : { scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                style={{
                  backgroundColor: isActive ? color : "rgba(242,244,240,1)",
                  color: isActive ? "#ffffff" : "#425244",
                  boxShadow: isActive
                    ? `0 6px 20px -4px ${color}55, 0 2px 8px -2px ${color}33`
                    : "none",
                }}
                aria-pressed={isActive}
              >
                <span className="text-base leading-none">{icon}</span>
                <span>{category.title}</span>
                {isActive && (
                  <motion.span
                    layoutId="pillActiveIndicator"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: color, zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Product grid with AnimatePresence */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeCategory.id}
              custom={direction}
              variants={gridVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {activeCategory.products.length > 0 ? (
                activeCategory.products.slice(0, 8).map((product) => (
                  <motion.div key={product.id} variants={cardVariants}>
                    <ProductCard
                      id={product.variantId ?? product.id}
                      title={product.title}
                      price={product.price.toString()}
                      priceAmount={product.priceAmount ?? product.price}
                      currencyCode={product.currencyCode ?? "ZAR"}
                      image={product.imageUrl || ""}
                      handle={product.handle}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  variants={cardVariants}
                  className="col-span-full py-16 text-center text-neutral-dark"
                >
                  No products found in this category.
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* View all CTA */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.6, ease: scrollEase }}
        >
          <Link
            href={`/shop?collection=${encodeURIComponent(activeCategory.handle)}`}
            className="group inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            Explore {activeCategory.title}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/shop"
            className="text-sm font-medium text-neutral-dark hover:text-primary transition-colors duration-200"
          >
            View all products →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
