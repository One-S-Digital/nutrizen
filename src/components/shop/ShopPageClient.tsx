"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ProductCard } from "@/components/ui/ProductCard";
import type { ShopProduct } from "@/lib/shopify";
import type { NavCollection } from "@/lib/shopify";
import { scrollEase, scrollViewport } from "@/lib/motion";

const PRODUCTS_PER_PAGE = 12;

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
  daily: "✦",
  vitamin: "💊",
};

function getGoalIcon(title: string): string {
  const lower = title.toLowerCase();
  for (const [key, icon] of Object.entries(GOAL_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "✦";
}

const PRODUCT_TAGS = ["Best Seller", "Daily Support", "Recovery", "Clean Formula", "New"];

function getProductTag(title: string, index: number): string | undefined {
  if (index % 7 === 0) return "Best Seller";
  if (index % 5 === 0) return "Daily Support";
  if (index % 9 === 0) return "Recovery";
  return undefined;
}

// ─── Animated product card for staggered grid ───────────────────────────────

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      delay: Math.min(i * 0.06, 0.4),
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// ─── Hero section ────────────────────────────────────────────────────────────

function ShopHero({
  collections,
  activeCollection,
  onFilterClick,
  isPending,
}: {
  collections: NavCollection[];
  activeCollection: string | undefined;
  onFilterClick: (handle: string | undefined) => void;
  isPending: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: scrollEase } },
  };

  return (
    <div
      ref={heroRef}
      className="relative overflow-hidden bg-[#2F3A33] text-white"
      style={{ minHeight: "52vh" }}
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_50%,rgba(140,171,119,0.18),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_60%,rgba(105,149,177,0.12),transparent)]" />

      {/* Floating decorative circles */}
      <motion.div
        className="absolute top-8 right-[12%] w-64 h-64 rounded-full border border-white/6"
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-12 right-[20%] w-48 h-48 rounded-full border border-white/4"
        animate={reduceMotion ? {} : { rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        style={reduceMotion ? {} : { y: heroY, opacity: heroOpacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        {/* Left: text */}
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block text-primary font-bold text-xs uppercase tracking-[0.22em] mb-5"
          >
            NutriZen Shop
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.06] mb-5 tracking-tight"
          >
            Find What Your Body <br className="hidden sm:block" />
            <span className="text-primary">Actually Needs</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-white/65 text-lg mb-8 max-w-md leading-relaxed"
          >
            Every formula is transparent, clinically dosed, and built to actually work — not just to sell.
          </motion.p>

          {/* Shop by goal pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onFilterClick(undefined)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-250 ${
                !activeCollection
                  ? "bg-primary text-white shadow-[0_4px_16px_-2px_rgba(140,171,119,0.5)]"
                  : "bg-white/10 text-white/80 hover:bg-white/18 border border-white/12"
              }`}
            >
              All Products
            </button>
            {collections.slice(0, 6).map((c) => (
              <button
                key={c.id}
                onClick={() => onFilterClick(c.handle)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-250 ${
                  activeCollection === c.handle
                    ? "bg-primary text-white shadow-[0_4px_16px_-2px_rgba(140,171,119,0.5)]"
                    : "bg-white/10 text-white/80 hover:bg-white/18 border border-white/12"
                }`}
              >
                <span className="text-xs">{getGoalIcon(c.title)}</span>
                {c.title}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: two floating product visuals */}
        <motion.div
          variants={itemVariants}
          className="hidden lg:flex items-center justify-center"
        >
          <div className="relative w-72 h-72">
            {/* Glow */}
            <div className="w-56 h-56 rounded-full bg-primary/25 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            {/* Front product — Vitacore */}
            <motion.div
              animate={reduceMotion ? {} : { y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-4 top-4 z-20"
            >
              <img
                src="/vitacore.png"
                alt="Vitacore B-Complex"
                className="w-48 h-48 object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
              />
            </motion.div>

            {/* Back product — Zinc, offset right + down, slightly smaller */}
            <motion.div
              animate={reduceMotion ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute right-0 bottom-0 z-10"
            >
              <img
                src="/zinc.png"
                alt="Zinc + Copper & Selenium"
                className="w-36 h-36 object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.35)] opacity-90"
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Pending indicator */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            style={{ originX: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sidebar filter (desktop) ────────────────────────────────────────────────

function ShopSidebar({
  collections,
  activeCollection,
  onFilterClick,
}: {
  collections: NavCollection[];
  activeCollection: string | undefined;
  onFilterClick: (handle: string | undefined) => void;
}) {
  return (
    <aside className="hidden lg:block w-60 flex-shrink-0">
      <div className="sticky top-28 space-y-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-dark mb-3">
            Shop by Goal
          </h3>
          <ul className="space-y-0.5">
            <li>
              <button
                onClick={() => onFilterClick(undefined)}
                className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-left transition-all duration-200 ${
                  !activeCollection
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-neutral-dark hover:bg-neutral-light/80 hover:text-neutral-darkest"
                }`}
              >
                <span className="text-sm">🏪</span>
                All Products
                {!activeCollection && (
                  <motion.span layoutId="sidebarIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            </li>
            {collections.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => onFilterClick(c.handle)}
                  className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-left transition-all duration-200 ${
                    activeCollection === c.handle
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-neutral-dark hover:bg-neutral-light/80 hover:text-neutral-darkest"
                  }`}
                >
                  <span className="text-sm">{getGoalIcon(c.title)}</span>
                  {c.title}
                  {activeCollection === c.handle && (
                    <motion.span layoutId="sidebarIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-neutral-light pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-dark mb-3">
            Not sure where to start?
          </p>
          <Link
            href="/pages/science"
            className="block text-sm text-neutral-dark hover:text-primary transition-colors leading-relaxed"
          >
            Read the science behind every formula →
          </Link>
        </div>
      </div>
    </aside>
  );
}

// ─── Mobile filter panel ──────────────────────────────────────────────────────

function MobileFilterPanel({
  collections,
  activeCollection,
  onFilterClick,
  isOpen,
  onClose,
}: {
  collections: NavCollection[];
  activeCollection: string | undefined;
  onFilterClick: (handle: string | undefined) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-darkest/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0, 0.16, 1] }}
            className="absolute left-0 top-0 bottom-0 w-[min(100%,22rem)] bg-background-main shadow-2xl flex flex-col overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-light/80">
              <h2 className="font-bold text-neutral-darkest">Filter Products</h2>
              <button onClick={onClose} aria-label="Close filters" className="p-2 rounded-lg hover:bg-neutral-light/60 text-neutral-dark">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-6 flex-grow">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-dark mb-4">Shop by Goal</p>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => { onFilterClick(undefined); onClose(); }}
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-left transition-all ${
                      !activeCollection ? "bg-primary/10 text-primary font-semibold" : "text-neutral-dark hover:bg-neutral-light/80"
                    }`}
                  >
                    <span>🏪</span> All Products
                  </button>
                </li>
                {collections.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => { onFilterClick(c.handle); onClose(); }}
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-left transition-all ${
                        activeCollection === c.handle ? "bg-primary/10 text-primary font-semibold" : "text-neutral-dark hover:bg-neutral-light/80"
                      }`}
                    >
                      <span>{getGoalIcon(c.title)}</span>
                      {c.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── "Not sure" guidance block ────────────────────────────────────────────────

function GuidanceBlock() {
  const reduceMotion = useReducedMotion();
  const goals = [
    { icon: "🛡️", label: "Immune Support", handle: "immunity" },
    { icon: "🧘", label: "Stress & Sleep", handle: "stress" },
    { icon: "⚡", label: "Energy & Focus", handle: "energy" },
    { icon: "🌱", label: "Gut Health", handle: "gut" },
  ];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={scrollViewport}
      transition={{ duration: 0.7, ease: scrollEase }}
      className="my-16 rounded-3xl bg-[#2F3A33] text-white p-8 md:p-12 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_50%,rgba(140,171,119,0.15),transparent)] pointer-events-none" />
      <div className="relative z-10">
        <p className="text-primary font-bold text-xs uppercase tracking-[0.18em] mb-3">Guidance</p>
        <h3 className="text-2xl md:text-3xl font-bold mb-2">Not sure where to start?</h3>
        <p className="text-white/60 mb-8 max-w-lg">
          Start with your biggest health goal. Every NutriZen formula is built for a specific outcome.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {goals.map((g) => (
            <motion.div
              key={g.label}
              whileHover={reduceMotion ? {} : { y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href={`/shop?collection=${g.handle}`}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/18 border border-white/10 p-4 text-center transition-all duration-200"
              >
                <span className="text-2xl">{g.icon}</span>
                <span className="text-sm font-semibold text-white/90">{g.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main ShopPageClient ──────────────────────────────────────────────────────

interface ShopPageClientProps {
  products: ShopProduct[];
  collections: NavCollection[];
  currentCollection: string | undefined;
}

export default function ShopPageClient({
  products,
  collections,
  currentCollection,
}: ShopPageClientProps) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleFilterClick = (handle: string | undefined) => {
    setVisibleCount(PRODUCTS_PER_PAGE);
    startTransition(() => {
      if (handle) {
        router.push(`/shop?collection=${encodeURIComponent(handle)}`, { scroll: false });
      } else {
        router.push("/shop", { scroll: false });
      }
    });
  };

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE);
  };

  return (
    <div className="bg-background-main min-h-screen">
      {/* Hero */}
      <ShopHero
        collections={collections}
        activeCollection={currentCollection}
        onFilterClick={handleFilterClick}
        isPending={isPending}
      />

      {/* Mobile filter panel */}
      <MobileFilterPanel
        collections={collections}
        activeCollection={currentCollection}
        onFilterClick={handleFilterClick}
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      />

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Mobile filter bar */}
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <p className="text-sm text-neutral-dark font-medium">
            {products.length} product{products.length !== 1 ? "s" : ""}
            {currentCollection && " in this collection"}
          </p>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-full border border-neutral-light bg-white px-4 py-2 text-sm font-semibold text-neutral-darkest shadow-sm hover:border-primary/40 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="6" y2="6" /><line x1="8" x2="16" y1="12" y2="12" /><line x1="11" x2="13" y1="18" y2="18" />
            </svg>
            Filter
            {currentCollection && <span className="w-2 h-2 rounded-full bg-primary" />}
          </button>
        </div>

        <div className="flex gap-10">
          {/* Sidebar */}
          <ShopSidebar
            collections={collections}
            activeCollection={currentCollection}
            onFilterClick={handleFilterClick}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumb + count */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <nav className="flex items-center gap-2 text-sm text-neutral-dark">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                {currentCollection && (
                  <>
                    <span>/</span>
                    <span className="text-neutral-darkest font-medium capitalize">
                      {collections.find((c) => c.handle === currentCollection)?.title ?? currentCollection}
                    </span>
                  </>
                )}
              </nav>
              <p className="text-sm text-neutral-dark">
                {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Guidance block */}
            {!currentCollection && <GuidanceBlock />}

            {/* Product grid */}
            {products.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-neutral-dark text-lg mb-2">No products found.</p>
                <p className="text-neutral-dark/60 text-sm mb-6">
                  Connect Shopify and ensure your Storefront API token is set.
                </p>
                <Link href="/shop" className="text-primary font-semibold hover:underline">
                  Clear filter →
                </Link>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCollection ?? "all"}
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {visibleProducts.map((product, i) => (
                      <motion.div
                        key={`${product.id}-${i}`}
                        custom={i}
                        variants={cardVariants}
                        initial={reduceMotion ? false : "hidden"}
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                      >
                        <ProductCard
                          id={product.variantId ?? product.id}
                          title={product.title}
                          price={product.priceDisplay}
                          image={product.imageUrl ?? ""}
                          handle={product.handle}
                          badge={getProductTag(product.title, i)}
                          priority={i < 4}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Load more */}
                {hasMore && (
                  <motion.div
                    className="mt-12 flex justify-center"
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: scrollEase }}
                  >
                    <motion.button
                      onClick={loadMore}
                      whileHover={reduceMotion ? {} : { scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="group flex items-center gap-3 rounded-full border-2 border-primary px-10 py-3.5 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    >
                      Show more products
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:translate-y-0.5 transition-transform"
                      >
                        <path d="M12 5v14" /><path d="m19 12-7 7-7-7" />
                      </svg>
                    </motion.button>
                  </motion.div>
                )}

                {!hasMore && products.length > PRODUCTS_PER_PAGE && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-10 text-center text-sm text-neutral-dark/60"
                  >
                    Showing all {products.length} products
                  </motion.p>
                )}
              </>
            )}

            {/* Final CTA */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={scrollViewport}
              transition={{ duration: 0.7, ease: scrollEase }}
              className="mt-24 rounded-3xl bg-background-alt border border-neutral-light p-10 md:p-14 text-center"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary mb-3">Still exploring?</p>
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">
                Not Sure What to Take?
              </h3>
              <p className="text-neutral-dark max-w-md mx-auto mb-8 leading-relaxed">
                Every formula on this page has a clear purpose. Read the science, or start with your biggest goal.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/pages/science"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-[0_6px_20px_-4px_rgba(140,171,119,0.45)] hover:bg-primary/90 transition-colors"
                  >
                    Read the Science
                  </Link>
                </motion.div>
                <Link
                  href="/pages/about"
                  className="text-sm font-medium text-neutral-dark hover:text-primary transition-colors"
                >
                  Our Story →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
