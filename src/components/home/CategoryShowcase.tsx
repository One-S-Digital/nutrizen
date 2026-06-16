"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ContourField } from "@/components/ui/Texture";
import { optimizeShopifyImage } from "@/lib/optimize-shopify-image";
import { scrollEase, scrollViewport, springPanel } from "@/lib/motion";

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

type GoalMeta = { hue: string; blurb: string };

const GOAL_META: { match: string[]; meta: GoalMeta }[] = [
  {
    match: ["immun", "defen"],
    meta: { hue: "#42634C", blurb: "Daily defense, built from the inside out." },
  },
  {
    match: ["energy", "vital"],
    meta: { hue: "#A8762E", blurb: "Steady, clean energy — no crash, no hype." },
  },
  {
    match: ["stress", "sleep", "mood", "calm"],
    meta: { hue: "#5B5E80", blurb: "Switch off fully. Sleep deep. Wake clear." },
  },
  {
    match: ["bone", "muscle", "recover"],
    meta: { hue: "#8A5A40", blurb: "Rebuild stronger between every effort." },
  },
  {
    match: ["cell", "longev"],
    meta: { hue: "#2F5D5C", blurb: "Protect the systems that protect you." },
  },
  {
    match: ["metabol", "blood", "sugar"],
    meta: { hue: "#6B7240", blurb: "A metabolism that works with you, not against you." },
  },
  {
    match: ["detox", "digest", "gut", "cleanse"],
    meta: { hue: "#4E7050", blurb: "A clear gut and a lighter system." },
  },
];

const FALLBACK_HUES = ["#42634C", "#A8762E", "#5B5E80", "#8A5A40", "#2F5D5C", "#6B7240", "#4E7050"];

function getGoalMeta(title: string, index: number): GoalMeta {
  const lower = title.toLowerCase();
  for (const { match, meta } of GOAL_META) {
    if (match.some((m) => lower.includes(m))) return meta;
  }
  return {
    hue: FALLBACK_HUES[index % FALLBACK_HUES.length],
    blurb: "Targeted formulas for a real, felt difference.",
  };
}

function ProductChip({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="flex items-center gap-2.5 rounded-xl bg-black/20 p-2 pr-3.5 transition-colors duration-300 hover:bg-black/35"
    >
      <span className="relative h-11 w-9 flex-shrink-0 overflow-hidden rounded-md bg-white">
        {product.imageUrl ? (
          <Image
            src={optimizeShopifyImage(product.imageUrl)}
            alt=""
            fill
            className="object-cover"
            sizes="36px"
          />
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium text-paper">
          {product.title.replace(/^NutriZen\s+/i, "")}
        </span>
        <span className="mt-0.5 block font-mono text-[10px] tracking-[0.08em] text-paper/60">
          {product.price}
        </span>
      </span>
    </Link>
  );
}

function PanelContent({
  category,
  meta,
  index,
  expanded,
}: {
  category: Category;
  meta: GoalMeta;
  index: number;
  expanded: boolean;
}) {
  const reduceMotion = !!useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      {expanded ? (
        <motion.div
          key="expanded"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.5, delay: 0.12, ease: scrollEase }}
          className="relative z-10 flex h-full flex-col justify-between p-6 md:p-7"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/60">
            {String(index + 1).padStart(2, "0")} ·{" "}
            {category.products.length > 0
              ? `${category.products.length} formula${category.products.length === 1 ? "" : "s"}`
              : "collection"}
          </p>
          <div className="min-w-[230px]">
            <h3 className="font-serif text-[1.7rem] leading-tight text-paper md:text-3xl">
              {category.title}
            </h3>
            <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-paper/65">
              {meta.blurb}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {category.products.slice(0, 2).map((p) => (
                <ProductChip key={p.id} product={p} />
              ))}
            </div>
            <Link
              href={`/shop?collection=${encodeURIComponent(category.handle)}`}
              className="group mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/80 transition-colors hover:text-paper"
            >
              Explore
              <span className="block h-px w-7 bg-paper/40 transition-all duration-300 group-hover:w-10 group-hover:bg-paper" />
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="collapsed"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative z-10 flex h-full flex-col items-center justify-between py-6"
        >
          <span className="font-mono text-[10px] tracking-[0.2em] text-paper/55">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.28em] text-paper/85"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {category.title}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-paper/50" aria-hidden />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function CategoryShowcase({ categories }: { categories: Category[] }) {
  const reduceMotion = !!useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevCategories, setPrevCategories] = useState(categories);
  const shown = categories.slice(0, 7);

  if (prevCategories !== categories) {
    setPrevCategories(categories);
    setActiveIndex(0);
  }

  if (!categories || categories.length === 0) return null;

  return (
    <section id="goals" className="relative overflow-hidden bg-paper py-24 md:py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Editorial header */}
        <motion.div
          className="mb-12 grid grid-cols-1 items-end gap-6 md:mb-16 md:grid-cols-[1fr_auto]"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.85, ease: scrollEase }}
        >
          <div>
            <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-goal-immunity">
              <span className="h-px w-9 bg-goal-immunity/50" aria-hidden />
              02 · Shop by goal
            </p>
            <h2 className="font-serif text-4xl leading-[1.05] tracking-[-0.01em] text-ink sm:text-5xl md:text-[3.6rem]">
              How do you want to <em className="italic">feel</em>?
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink/60 md:pb-2 md:text-right">
            Start with the change you want to feel — we&rsquo;ll show you exactly
            what&rsquo;s inside the formulas built for it.
          </p>
        </motion.div>

        {/* Desktop: expanding goal panels */}
        <motion.div
          className="hidden h-[470px] gap-2.5 md:flex"
          initial={reduceMotion ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.9, delay: 0.1, ease: scrollEase }}
        >
          {shown.map((category, i) => {
            const meta = getGoalMeta(category.title, i);
            const isActive = activeIndex === i;
            return (
              <motion.div
                key={category.id}
                animate={{ flexGrow: isActive ? 3.4 : 1 }}
                transition={reduceMotion ? { duration: 0 } : springPanel}
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                aria-label={`${category.title} — show formulas`}
                className="relative min-w-0 flex-1 cursor-pointer overflow-hidden rounded-[1.3rem] outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ink/40"
                style={{ backgroundColor: meta.hue, flexBasis: 0 }}
              >
                <div
                  className="absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,255,255,0.13),transparent_55%)]"
                  aria-hidden
                />
                <ContourField className="absolute inset-0 h-full w-full text-white opacity-[0.07]" />
                <PanelContent category={category} meta={meta} index={i} expanded={isActive} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile: snap-scroll goal cards */}
        <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-3 scrollbar-hide md:hidden">
          {shown.map((category, i) => {
            const meta = getGoalMeta(category.title, i);
            return (
              <div
                key={category.id}
                className="relative h-[430px] min-w-[82%] snap-center overflow-hidden rounded-[1.3rem]"
                style={{ backgroundColor: meta.hue }}
              >
                <div
                  className="absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,255,255,0.13),transparent_55%)]"
                  aria-hidden
                />
                <ContourField className="absolute inset-0 h-full w-full text-white opacity-[0.07]" />
                <PanelContent category={category} meta={meta} index={i} expanded />
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-ink/35 md:hidden">
          Swipe to explore →
        </p>

        <motion.div
          className="mt-12 text-center"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={scrollViewport}
          transition={{ duration: 0.7, ease: scrollEase }}
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/70 transition-colors hover:text-ink"
          >
            View all formulas
            <span className="block h-px w-9 bg-ink/30 transition-all duration-300 group-hover:w-14 group-hover:bg-ink" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
