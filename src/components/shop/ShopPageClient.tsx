"use client";

import { useState, useTransition, useRef, useCallback, useEffect } from "react";
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
import InfusionField from "@/components/home/InfusionField";
import type { ShopProduct, NavCollection } from "@/lib/shopify";
import { scrollEase, scrollViewport } from "@/lib/motion";
import {
  Truck,
  Shield,
  Star,
  Users,
  Scale,
  ClipboardList,
  Leaf,
  SlidersHorizontal,
  X,
  ArrowDown,
  ArrowRight,
} from "lucide-react";

const PRODUCTS_PER_PAGE = 12;

/* ── Premium icons (lucide-react), referenced by a stable semantic name ── */
const ICON_MAP = {
  truck: Truck,
  shield: Shield,
  star: Star,
  users: Users,
  scale: Scale,
  clipboard: ClipboardList,
  leaf: Leaf,
  filter: SlidersHorizontal,
  close: X,
  "arrow-down": ArrowDown,
  "arrow-right": ArrowRight,
} as const;

function Icon({ name, className = "" }: { name: keyof typeof ICON_MAP | string; className?: string }) {
  const Cmp = ICON_MAP[name as keyof typeof ICON_MAP] ?? ArrowRight;
  return <Cmp className={className} strokeWidth={1.7} aria-hidden />;
}

function getProductTag(_title: string, index: number): string | undefined {
  if (index % 7 === 0) return "Best Seller";
  if (index % 5 === 0) return "Daily Support";
  if (index % 9 === 0) return "Recovery";
  return undefined;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, delay: Math.min(i * 0.05, 0.35), ease: scrollEase },
  }),
};

function useCanHover() {
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return canHover;
}

/* ── Trust stats (pinned strip at the bottom of the hero) ── */
const TRUST = [
  { title: "Free Shipping", sub: "Over R690", icon: "truck" },
  { title: "30-Day Guarantee", sub: "Shop with confidence", icon: "shield" },
  { title: "4.9★", sub: "Customer rating", icon: "star" },
  { title: "15 000+", sub: "Customers", icon: "users" },
] as const;

/* ── Annotation callouts around the bottle (lg+ only) ── */
const ANNOTATIONS: Array<{
  title: string;
  sub: string;
  icon: string;
  side: "left" | "right";
  top: string;
  delay: number;
}> = [
  { title: "Clinically Dosed", sub: "Effective amounts you can trust", icon: "scale", side: "left", top: "16%", delay: 1.0 },
  { title: "Clean Label", sub: "No fillers. Full disclosure.", icon: "clipboard", side: "left", top: "calc(62% - 130px)", delay: 1.3 },
  { title: "Free Delivery", sub: "On orders over R690", icon: "truck", side: "right", top: "22%", delay: 1.15 },
  { title: "30-Day Guarantee", sub: "Love it or your money back", icon: "shield", side: "right", top: "calc(66% - 130px)", delay: 1.45 },
];

function Annotation({
  title, sub, icon, side, top, delay, reduceMotion,
}: (typeof ANNOTATIONS)[number] & { reduceMotion: boolean }) {
  const isLeft = side === "left";
  const connector = (
    <div className="annotation-connector w-8 sm:w-10 xl:w-14">
      <motion.span
        initial={reduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay, ease: scrollEase }}
        className={`block h-px w-full bg-gradient-to-r from-[#8CAB77]/70 to-[#8CAB77]/20 ${isLeft ? "origin-right" : "origin-left"}`}
      />
    </div>
  );
  const iconBadge = (
    <motion.span
      initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: delay + 0.45, ease: scrollEase }}
      className="hero-annotation-icon"
    >
      <Icon name={icon} className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
    </motion.span>
  );
  const text = (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: delay + 0.25, ease: scrollEase }}
      className={`min-w-0 ${isLeft ? "text-right" : "text-left"}`}
    >
      <p className="hero-annotation-title">{title}</p>
      <p className="hero-annotation-sub">{sub}</p>
    </motion.div>
  );
  return (
    <div className="hero-annotation hidden lg:flex" style={isLeft ? { top, right: "58%" } : { top, left: "58%" }}>
      {isLeft ? (<>{text}{iconBadge}{connector}</>) : (<>{connector}{iconBadge}{text}</>)}
    </div>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function ShopHero({
  collections,
  activeCollection,
  onFilterClick,
  productCount,
  isPending,
}: {
  collections: NavCollection[];
  activeCollection: string | undefined;
  onFilterClick: (handle: string | undefined) => void;
  productCount: number;
  isPending: boolean;
}) {
  const reduceMotion = !!useReducedMotion();
  const canHover = useCanHover();
  const heroRef = useRef<HTMLElement>(null);
  const cursorRef = useRef({ x: -9999, y: -9999 });
  const getCursor = useCallback(() => cursorRef.current, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    cursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const handleMouseLeave = () => { cursorRef.current = { x: -9999, y: -9999 }; };

  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], reduceMotion ? [0, 0] : [0, -56]);
  const textOpacity = useTransform(scrollY, [0, 420], reduceMotion ? [1, 1] : [1, 0]);
  const specimenY = useTransform(scrollY, [0, 600], reduceMotion ? [0, 0] : [0, 50]);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1, delayChildren: reduceMotion ? 0 : 0.15 } },
  };
  const childVariants: Variants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: scrollEase } },
  };

  const pill = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
      active
        ? "bg-[#D9E8C4] text-[#10201A] shadow-[0_8px_24px_-10px_rgba(217,232,196,0.8)]"
        : "border border-white/15 bg-white/[0.06] text-[#F6F3EA]/85 hover:border-[#D9E8C4]/45 hover:bg-white/[0.1]"
    }`;

  return (
    <section
      ref={heroRef}
      onMouseMove={canHover ? handleMouseMove : undefined}
      onMouseLeave={canHover ? handleMouseLeave : undefined}
      className="hero-shell"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image src="/hero-bg.png" alt="" fill priority sizes="100vw" className="object-cover object-center" quality={90} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071209]/92 via-[#071209]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071209]/55 via-transparent to-[#071209]/92" />
      </div>

      {/* Particle field */}
      <InfusionField getCursor={getCursor} reduceMotion={reduceMotion} className="absolute inset-0 z-[1] h-full w-full" />

      <div className="hero-grid lg:pt-[164px]">
        {/* Copy column */}
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          style={reduceMotion ? {} : { y: textY, opacity: textOpacity }}
          className="hero-copy"
        >
          <motion.p variants={childVariants} className="hero-eyebrow">
            NutriZen Shop · {productCount} formulas
          </motion.p>

          <motion.h1 variants={childVariants} className="hero-title sm:text-[3.1rem] lg:text-[3.4rem] xl:text-[3.95rem]">
            Find what your body{" "}
            <em className="italic text-[#8CAB77]">actually needs</em>
            <span className="text-[#E7A46C] not-italic">.</span>
          </motion.h1>

          <motion.p variants={childVariants} className="hero-lede">
            Every formula is transparent, clinically dosed, and built to actually
            work — not just to sell. Browse by goal, delivered free across South
            Africa.
          </motion.p>

          {/* Shop-by-goal filter pills */}
          <motion.div variants={childVariants} className="mt-7 w-full">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#F6F3EA]/45">
              Shop by goal
            </p>
            <div className="flex flex-wrap gap-2.5">
              <button onClick={() => onFilterClick(undefined)} className={pill(!activeCollection)}>
                All products
              </button>
              {collections.slice(0, 6).map((c) => (
                <button key={c.id} onClick={() => onFilterClick(c.handle)} className={pill(activeCollection === c.handle)}>
                  {c.title}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Specimen column */}
        <motion.div
          style={reduceMotion ? {} : { y: specimenY }}
          className="relative z-10 mx-auto mt-12 flex w-full flex-col items-center justify-end pb-[80px] lg:mt-0 lg:h-full lg:justify-center lg:pb-0"
        >
          <div className="relative w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[580px]">
            <div className="product-orbit" aria-hidden>
              <span className="orbit orbit-1" />
              <span className="orbit orbit-2" />
              <span className="orbit orbit-3" />
              <span className="orbit orbit-4" />
              <span className="orbit-node node-1" />
              <span className="orbit-node node-2 is-gold" />
              <span className="orbit-node node-3" />
              <span className="orbit-node node-4 is-gold" />
            </div>

            {ANNOTATIONS.map((a) => (
              <Annotation key={a.title} {...a} reduceMotion={reduceMotion} />
            ))}

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: scrollEase }}
              className="relative z-[3]"
            >
              <Image
                src="/science%20hero%20image.png"
                alt="NutriZen supplement on a natural stone base"
                width={1254}
                height={1254}
                priority
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 420px, 580px"
                className="h-auto w-full select-none"
                style={{ filter: "drop-shadow(0 40px 70px rgba(0,0,0,0.85))" }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Trust strip */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.1, ease: scrollEase }}
        className="hero-statbar"
      >
        <div className="hero-statbar-inner">
          <ul className="hero-statlist">
            {TRUST.map((item) => (
              <li key={item.title} className="hero-stat">
                <span className="hero-stat-icon"><Icon name={item.icon} className="h-6 w-6 lg:h-7 lg:w-7" /></span>
                <span>
                  <span className="hero-stat-title">{item.title}</span>
                  {item.sub && <span className="hero-stat-sub">{item.sub}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Filter-pending progress line */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            style={{ originX: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-[#8CAB77]"
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ───────────────────────── Sidebar (desktop) ───────────────────────── */

function ShopSidebar({
  collections,
  activeCollection,
  onFilterClick,
}: {
  collections: NavCollection[];
  activeCollection: string | undefined;
  onFilterClick: (handle: string | undefined) => void;
}) {
  const rowClass = (active: boolean) =>
    `w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-left transition-all duration-200 ${
      active
        ? "bg-primary/10 text-primary font-semibold"
        : "text-ink/60 hover:bg-paper hover:text-ink font-medium"
    }`;

  return (
    <aside className="hidden lg:block w-60 flex-shrink-0">
      <div className="sticky top-28 space-y-7">
        <div>
          <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-secondary">
            <span className="h-px w-7 bg-secondary/50" aria-hidden />
            Shop by goal
          </p>
          <ul className="space-y-0.5">
            <li>
              <button onClick={() => onFilterClick(undefined)} className={rowClass(!activeCollection)}>
                All products
                {!activeCollection && (
                  <motion.span layoutId="sidebarIndicator" className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            </li>
            {collections.map((c) => (
              <li key={c.id}>
                <button onClick={() => onFilterClick(c.handle)} className={rowClass(activeCollection === c.handle)}>
                  {c.title}
                  {activeCollection === c.handle && (
                    <motion.span layoutId="sidebarIndicator" className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-neutral-light/80 bg-white p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink/40">Not sure where to start?</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            Every formula is built for a specific outcome.
          </p>
          <Link href="/pages/science" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
            Read the science
            <Icon name="arrow-right" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

/* ───────────────────────── Mobile filter panel ───────────────────────── */

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
  const rowClass = (active: boolean) =>
    `w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-left transition-all ${
      active ? "bg-primary/10 text-primary font-semibold" : "text-ink/70 hover:bg-paper"
    }`;
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] lg:hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-ink/40" onClick={onClose} />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0, 0.16, 1] }}
            className="absolute left-0 top-0 bottom-0 w-[min(100%,22rem)] bg-background-main shadow-2xl flex flex-col overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-light/80">
              <h2 className="font-serif text-lg text-ink">Filter products</h2>
              <button onClick={onClose} aria-label="Close filters" className="p-2 rounded-lg hover:bg-paper text-ink/60">
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <div className="px-5 py-6 flex-grow">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.26em] text-secondary">Shop by goal</p>
              <ul className="space-y-1">
                <li>
                  <button onClick={() => { onFilterClick(undefined); onClose(); }} className={rowClass(!activeCollection)}>
                    All products
                  </button>
                </li>
                {collections.map((c) => (
                  <li key={c.id}>
                    <button onClick={() => { onFilterClick(c.handle); onClose(); }} className={rowClass(activeCollection === c.handle)}>
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

/* ───────────────────────── Guidance block ───────────────────────── */

function GuidanceBlock() {
  const reduceMotion = useReducedMotion();
  const goals = [
    { label: "Immune Support", handle: "immunity", icon: "shield" },
    { label: "Stress & Sleep", handle: "stress", icon: "leaf" },
    { label: "Energy & Focus", handle: "energy", icon: "star" },
    { label: "Gut Health", handle: "gut", icon: "scale" },
  ];
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={scrollViewport}
      transition={{ duration: 0.7, ease: scrollEase }}
      className="relative mb-14 overflow-hidden rounded-[2.2rem] border border-white/10 bg-ink p-8 text-paper md:p-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_85%_30%,rgba(140,171,119,0.18),transparent_70%)]" aria-hidden />
      <div className="relative z-10">
        <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#8CAB77]">
          <span className="h-px w-8 bg-[#8CAB77]/50" aria-hidden />
          Guidance
        </p>
        <h3 className="max-w-lg font-serif text-2xl leading-[1.1] text-paper md:text-[2.1rem]">
          Not sure where to start? Begin with your biggest goal.
        </h3>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {goals.map((g) => (
            <motion.div key={g.label} whileHover={reduceMotion ? {} : { y: -4 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={`/shop?collection=${g.handle}`}
                className="flex h-full flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition-all duration-200 hover:border-[#8CAB77]/40 hover:bg-white/[0.09]"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full border border-[#8CAB77]/35 text-[#8CAB77]">
                  <Icon name={g.icon} className="h-[18px] w-[18px]" />
                </span>
                <span className="text-sm font-semibold text-paper/90">{g.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ───────────────────────── Final CTA ───────────────────────── */

function ShopFinalCta() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="bg-background-main pb-24 pt-4">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.85, ease: scrollEase }}
          className="relative overflow-hidden rounded-[2.4rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-background-white to-secondary/10 px-8 py-14 shadow-[0_40px_100px_-44px_rgba(105,149,177,0.45)] md:px-16 md:py-20"
        >
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -right-10 bottom-0 opacity-90">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/zinc.png" alt="" className="h-[15rem] w-[15rem] object-contain drop-shadow-2xl md:h-[19rem] md:w-[19rem]" />
          </div>
          <div className="relative max-w-xl">
            <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-secondary">
              <span className="h-px w-8 bg-secondary/50" aria-hidden />
              Still exploring?
            </p>
            <h2 className="font-serif text-3xl leading-[1.08] tracking-[-0.01em] text-ink sm:text-4xl md:text-[2.9rem]">
              Not sure what to <em className="italic text-primary">take?</em>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">
              Every formula on this page has a clear purpose. Read the science, or
              start with your biggest goal.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/pages/science"
                className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-[0_16px_40px_-14px_rgba(140,171,119,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7a9d65]"
              >
                Read the science
              </Link>
              <Link
                href="/pages/about"
                className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-ink/20 bg-transparent px-8 py-4 text-base font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/40 hover:bg-ink/[0.04]"
              >
                Our story
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── Main ───────────────────────── */

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
  const productsRef = useRef<HTMLDivElement>(null);

  const handleFilterClick = (handle: string | undefined) => {
    setVisibleCount(PRODUCTS_PER_PAGE);
    startTransition(() => {
      router.push(handle ? `/shop?collection=${encodeURIComponent(handle)}` : "/shop", { scroll: false });
    });
  };

  // Hero pills filter, then glide down to the results.
  const handleHeroFilter = (handle: string | undefined) => {
    handleFilterClick(handle);
    requestAnimationFrame(() =>
      productsRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
    );
  };

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;
  const activeTitle = currentCollection
    ? collections.find((c) => c.handle === currentCollection)?.title ?? currentCollection
    : null;

  return (
    <div className="bg-background-main">
      <ShopHero
        collections={collections}
        activeCollection={currentCollection}
        onFilterClick={handleHeroFilter}
        productCount={products.length}
        isPending={isPending}
      />

      <MobileFilterPanel
        collections={collections}
        activeCollection={currentCollection}
        onFilterClick={handleFilterClick}
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      />

      <div ref={productsRef} className="scroll-mt-24 max-w-7xl mx-auto px-6 py-16 md:py-20">
        {/* Section intro */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.7, ease: scrollEase }}
          className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-secondary">
              <span className="h-px w-8 bg-secondary/50" aria-hidden />
              {activeTitle ? "Collection" : "The full range"}
            </p>
            <h2 className="font-serif text-3xl leading-[1.05] tracking-[-0.01em] text-ink sm:text-4xl md:text-[2.7rem]">
              {activeTitle ?? "Browse every formula"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-ink/55">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 rounded-full border border-neutral-light bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-primary/40 transition-colors"
            >
              <Icon name="filter" className="h-4 w-4" />
              Filter
              {currentCollection && <span className="h-2 w-2 rounded-full bg-primary" />}
            </button>
          </div>
        </motion.div>

        <div className="flex gap-10">
          <ShopSidebar
            collections={collections}
            activeCollection={currentCollection}
            onFilterClick={handleFilterClick}
          />

          <div className="flex-1 min-w-0">
            {!currentCollection && <GuidanceBlock />}

            {products.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-ink/70 text-lg mb-2">No products found.</p>
                <p className="text-ink/50 text-sm mb-6">Connect Shopify and ensure your Storefront API token is set.</p>
                <Link href="/shop" className="text-primary font-semibold hover:underline">Clear filter →</Link>
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
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
                          priceAmount={product.priceAmount}
                          currencyCode={product.currencyCode}
                          image={product.imageUrl ?? ""}
                          handle={product.handle}
                          badge={getProductTag(product.title, i)}
                          priority={i < 4}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {hasMore && (
                  <motion.div
                    className="mt-14 flex justify-center"
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={scrollViewport}
                    transition={{ duration: 0.5, ease: scrollEase }}
                  >
                    <motion.button
                      onClick={() => setVisibleCount((p) => p + PRODUCTS_PER_PAGE)}
                      whileHover={reduceMotion ? {} : { y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group inline-flex items-center gap-3 rounded-full border border-ink/20 px-10 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:border-ink/40 hover:bg-ink/[0.04]"
                    >
                      Show more products
                      <Icon name="arrow-down" className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                    </motion.button>
                  </motion.div>
                )}

                {!hasMore && products.length > PRODUCTS_PER_PAGE && (
                  <p className="mt-12 text-center text-sm text-ink/45">Showing all {products.length} products</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <ShopFinalCta />
    </div>
  );
}
