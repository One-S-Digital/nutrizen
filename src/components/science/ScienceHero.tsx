"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import InfusionField from "@/components/home/InfusionField";
import { scrollEase } from "@/lib/motion";

/* Pointer-capability check so the cursor effects only run on hover-capable devices */
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

/* ── Feature chips (2×2 under the lede) ── */
const CHIPS = [
  { label: "Bioavailability", icon: "leaf" },
  { label: "Clinical dosing", icon: "scale" },
  { label: "Nutrient synergy", icon: "molecule" },
  { label: "Transparent labels", icon: "clipboard" },
] as const;

/* ── Annotation callouts arranged around the bottle (lg+ only) ── */
const ANNOTATIONS: Array<{
  title: string;
  sub: string;
  icon: string;
  side: "left" | "right";
  top: string;
  delay: number;
}> = [
  { title: "Bioavailability", sub: "Forms chosen for absorption", icon: "leaf", side: "left", top: "15%", delay: 1.0 },
  { title: "Nutrient Synergy", sub: "Ingredients that work together", icon: "molecule", side: "left", top: "calc(60% - 130px)", delay: 1.3 },
  { title: "Clinical Dosing", sub: "Doses aligned with evidence", icon: "scale", side: "right", top: "21%", delay: 1.15 },
  { title: "Transparent Labels", sub: "No fillers. No fluff. Just clarity.", icon: "clipboard", side: "right", top: "calc(65% - 130px)", delay: 1.45 },
];

/* ── Bottom stat strip ── */
const STATS = [
  { value: "Forms", label: "chosen for absorption", icon: "leaf" },
  { value: "Doses", label: "aligned with evidence", icon: "shield" },
  { value: "Labels", label: "fully transparent", icon: "award" },
] as const;

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  if (name === "scale")
    return (
      <svg {...common}>
        <path d="M12 3v3" /><path d="M5 7h14" /><path d="M9 20h6" /><path d="M12 6v14" />
        <path d="M5 7 2.5 13a3 3 0 0 0 5 0L5 7Z" /><path d="M19 7l-2.5 6a3 3 0 0 0 5 0L19 7Z" />
      </svg>
    );
  if (name === "molecule")
    return (
      <svg {...common}>
        <circle cx="6" cy="7" r="2" /><circle cx="18" cy="7" r="2" /><circle cx="12" cy="17" r="2" />
        <path d="M7.6 8.4 10.6 15.2" /><path d="M16.4 8.4 13.4 15.2" /><path d="M8 7h8" />
      </svg>
    );
  if (name === "clipboard")
    return (
      <svg {...common}>
        <rect x="5" y="5" width="14" height="16" rx="2" /><path d="M9 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
        <path d="M9 11h6" /><path d="M9 15h4" />
      </svg>
    );
  if (name === "shield")
    return (
      <svg {...common}>
        <path d="M12 3 5.5 5.4v5.2c0 4.2 2.7 7.7 6.5 9.4 3.8-1.7 6.5-5.2 6.5-9.4V5.4L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  if (name === "award")
    return (
      <svg {...common}>
        <circle cx="12" cy="9" r="5" /><path d="M8.5 13 7 21l5-2.6L17 21l-1.5-8" />
      </svg>
    );
  // leaf
  return (
    <svg {...common}>
      <path d="M19 5c-7.5.7-12.5 4.7-14 12 5.8.9 10.8-1.9 14-12Z" />
      <path d="M8 16c2.6-3.8 5.4-6 8.7-7.4" />
    </svg>
  );
}

function Annotation({
  title,
  sub,
  icon,
  side,
  top,
  delay,
  reduceMotion,
}: (typeof ANNOTATIONS)[number] & { reduceMotion: boolean }) {
  const isLeft = side === "left";

  const connector = (
    <div className="annotation-connector w-8 sm:w-10 xl:w-14">
      <motion.span
        initial={reduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay, ease: scrollEase }}
        className={`block h-px w-full bg-gradient-to-r from-[#8CAB77]/70 to-[#8CAB77]/20 ${
          isLeft ? "origin-right" : "origin-left"
        }`}
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
    <div
      className="hero-annotation hidden lg:flex"
      style={isLeft ? { top, right: "58%" } : { top, left: "58%" }}
    >
      {isLeft ? (
        <>
          {text}
          {iconBadge}
          {connector}
        </>
      ) : (
        <>
          {connector}
          {iconBadge}
          {text}
        </>
      )}
    </div>
  );
}

export default function ScienceHero() {
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
  const handleMouseLeave = () => {
    cursorRef.current = { x: -9999, y: -9999 };
  };

  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], reduceMotion ? [0, 0] : [0, -56]);
  const textOpacity = useTransform(scrollY, [0, 420], reduceMotion ? [1, 1] : [1, 0]);
  const specimenY = useTransform(scrollY, [0, 600], reduceMotion ? [0, 0] : [0, 50]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.1, delayChildren: reduceMotion ? 0 : 0.15 },
    },
  };
  const childVariants: Variants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: scrollEase } },
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={canHover ? handleMouseMove : undefined}
      onMouseLeave={canHover ? handleMouseLeave : undefined}
      className="hero-shell"
    >
      {/* ── Layer 0: Background image ── */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image
          src="/science%20heo%20bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={90}
        />
        {/* Left darkening for copy legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071209]/92 via-[#071209]/45 to-transparent" />
        {/* Top + bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#071209]/55 via-transparent to-[#071209]/92" />
      </div>

      {/* ── Layer 1: Floating particle field that reacts to the cursor ── */}
      <InfusionField
        getCursor={getCursor}
        reduceMotion={reduceMotion}
        className="absolute inset-0 z-[1] h-full w-full"
      />

      {/* ── Layer 2: Main content grid ── */}
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
            The Science
          </motion.p>

          <motion.h1
            variants={childVariants}
            className="hero-title sm:text-[3.1rem] lg:text-[3.4rem] xl:text-[3.95rem]"
          >
            Formulation you can feel —{" "}
            <em className="italic text-[#8CAB77]">explained without the noise</em>
          </motion.h1>

          <motion.p variants={childVariants} className="hero-lede">
            NutriZen formulas are built around bioavailability, intentional dosing,
            and complementary nutrients. A calm look at what &ldquo;science-backed&rdquo;
            means in practice — not a lab report, but a clearer standard.
          </motion.p>

          {/* Feature chips */}
          <motion.div
            variants={childVariants}
            className="mt-6 grid w-full max-w-md grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 lg:mt-5"
          >
            {CHIPS.map(({ label, icon }) => (
              <span key={label} className="hero-chip">
                <Icon name={icon} className="hero-chip-icon h-[18px] w-[18px]" />
                {label}
              </span>
            ))}
          </motion.div>

          <motion.div variants={childVariants} className="hero-actions mt-6 lg:mt-5">
            <Link href="/shop" className="group hero-btn hero-btn-primary">
              Shop formulas
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link href="/pages/about" className="group hero-btn hero-btn-ghost">
              Our Story
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Specimen column */}
        <motion.div
          style={reduceMotion ? {} : { y: specimenY }}
          className="relative z-10 mx-auto mt-10 flex w-full flex-col items-center justify-end pb-[80px] lg:mt-0 lg:h-full lg:justify-center lg:pb-0"
        >
          <div className="science-visual relative w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[600px]">
            {/* Orbit halo — behind the product (z-1) */}
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

            {/* Annotation callouts (lg+) */}
            {ANNOTATIONS.map((a) => (
              <Annotation key={a.title} {...a} reduceMotion={reduceMotion} />
            ))}

            {/* Product composite — bottle + stone base + glow baked in (z-3) */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: scrollEase }}
              className="relative z-[3]"
            >
              <Image
                src="/science%20hero%20image.png"
                alt="NutriZen Metabol+ supplement on a natural stone base"
                width={1254}
                height={1254}
                priority
                sizes="(max-width: 640px) 320px, (max-width: 1024px) 440px, 600px"
                className="h-auto w-full select-none"
                style={{ filter: "drop-shadow(0 40px 70px rgba(0,0,0,0.85))" }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Stat strip — pinned to bottom ── */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.1, ease: scrollEase }}
        className="hero-statbar"
      >
        <div className="hero-statbar-inner">
          <ul className="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-[#071209]/85 backdrop-blur-xl divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:backdrop-blur-none">
            {STATS.map(({ value, label, icon }) => (
              <li
                key={value}
                className="flex flex-row items-center justify-center gap-4 px-5 py-4 lg:px-8 lg:py-5"
              >
                <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full border border-[#8CAB77]/35 text-[#8CAB77] lg:h-12 lg:w-12">
                  <Icon name={icon} className="h-5 w-5" />
                </span>
                <span className="text-left">
                  <span className="block font-serif text-lg font-semibold text-[#F6F3EA]">{value}</span>
                  <span className="mt-0.5 block text-xs text-[#F6F3EA]/55">{label}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
