"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import InfusionField from "@/components/home/InfusionField";
import { scrollEase } from "@/lib/motion";

const TRUST_CHIPS: Array<{ label: string; icon: string }> = [
  { label: "No fillers", icon: "leaf" },
  { label: "Targeted formulas", icon: "target" },
  { label: "Bioavailable ingredients", icon: "molecule" },
];

const STATS: Array<{ value: string; label: string; icon: string }> = [
  { value: "100%", label: "Transparent labels", icon: "leaf" },
  { value: "0", label: "Proprietary blends", icon: "shield" },
  { value: "30-day", label: "Guarantee", icon: "medal" },
];

// Three specimen bottles standing on the stone — centre is the hero.

function HeroIcon({ name, className = "" }: { name: string; className?: string }) {
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
  if (name === "target")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </svg>
    );
  if (name === "molecule")
    return (
      <svg {...common}>
        <circle cx="6" cy="7" r="2" />
        <circle cx="18" cy="9" r="2" />
        <circle cx="9" cy="17" r="2" />
        <path d="M7.7 8.4 14.8 14M8 7.7 16 8.7M10.2 15.3 16.3 10.6" />
      </svg>
    );
  if (name === "shield")
    return (
      <svg {...common}>
        <path d="M12 3 5.5 5.4v5.2c0 4.2 2.7 7.7 6.5 9.4 3.8-1.7 6.5-5.2 6.5-9.4V5.4L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  if (name === "medal")
    return (
      <svg {...common}>
        <circle cx="12" cy="14" r="5" />
        <path d="m9 9.5-2-6M15 9.5l2-6M12 12v4M10.5 14h3" />
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

export default function AboutHero() {
  const reduceMotion = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const cursorRef = useRef({ x: -9999, y: -9999 });
  const getCursor = useCallback(() => cursorRef.current, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    cursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const handleMouseLeave = () => {
    cursorRef.current = { x: -9999, y: -9999 };
  };

  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, -56]);
  const textOpacity = useTransform(scrollY, [0, 460], [1, 0]);
  const specimenY = useTransform(scrollY, [0, 600], [0, 56]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.1,
        delayChildren: reduceMotion ? 0 : 0.15,
      },
    },
  };
  const childVariants: Variants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: scrollEase } },
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate min-h-[100svh] overflow-x-hidden bg-[#071209] -mt-[152px] pt-0 lg:h-[100svh] lg:max-h-[100svh] lg:overflow-hidden"
    >
      {/* ── Layer 1: Background image ── */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071209]/95 via-[#071209]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071209]/60 via-transparent to-[#071209]/90" />
      </div>

      {/* ── Layer 2: InfusionField sparkle ── */}
      <InfusionField
        getCursor={getCursor}
        reduceMotion={reduceMotion}
        className="absolute inset-0 z-[1] h-full w-full"
      />

      {/* ── Layer 3: Left leaf cluster ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-[5] w-[220px] sm:w-[290px] lg:w-[370px] xl:w-[460px] -translate-x-1/2"
        style={{ opacity: 0.62 }}
        aria-hidden
      >
        <Image
          src="/left%20leaf%20element.png"
          alt=""
          width={814}
          height={1247}
          className="h-auto w-full object-contain object-bottom"
          style={{ filter: "brightness(0.75) saturate(1.1)" }}
        />
      </div>

      {/* ── Layer 5: Grain texture ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Layer 6: Main content grid ── */}
      <div className="relative z-10 mx-auto grid h-full w-full max-w-[1540px] grid-cols-1 items-stretch gap-x-0 px-6 pb-40 pt-[140px] md:pt-[150px] lg:grid-cols-[1fr_1fr] lg:px-10 lg:pb-[124px] lg:pt-[150px] xl:px-16">

        {/* ── Editorial / text column ── */}
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          style={reduceMotion ? {} : { y: textY, opacity: textOpacity }}
          className="relative z-20 flex flex-col justify-center lg:justify-start" style={{ maxWidth: "calc(42rem + 50px)" }}
        >
          <motion.p
            variants={childVariants}
            className="mb-6 font-mono text-[11px] uppercase tracking-[0.42em] text-[#E7A46C]"
          >
            Our Story
          </motion.p>

          <motion.h1
            variants={childVariants}
            className="font-serif text-[2.4rem] leading-[1.04] tracking-[-0.02em] text-[#F6F3EA] min-[420px]:text-[2.8rem] sm:text-[3.5rem] lg:text-[3.9rem] xl:text-[4.6rem]"
          >
            Supplements that
            <br />
            <em className="italic text-[#8CAB77]">actually make sense</em>
            <span className="not-italic text-[#E7A46C]">.</span>
          </motion.h1>

          <motion.p
            variants={childVariants}
            className="mt-5 max-w-[48ch] text-base leading-relaxed text-[#F6F3EA]/70 md:text-[1.02rem]"
          >
            NutriZen was built for people who want clean, transparent formulas they
            can trust. We choose ingredients for how they work together, not how they
            market on the front label — so every formula is purposeful, bioavailable,
            and easy to understand.
          </motion.p>

          <motion.div variants={childVariants} className="mt-6 flex flex-wrap gap-2.5 lg:flex-nowrap">
            {TRUST_CHIPS.map(({ label, icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#D89455]/35 bg-[#10201A]/40 px-4 py-2 text-[13px] font-medium text-[#F6F3EA]/85 backdrop-blur-sm"
              >
                <span className="text-[#E7A46C]">
                  <HeroIcon name={icon} className="h-[18px] w-[18px]" />
                </span>
                {label}
              </span>
            ))}
          </motion.div>

          <motion.div
            variants={childVariants}
            className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link
              href="/shop"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#D9E8C4] px-8 py-[14px] text-[15px] font-semibold text-[#10201A] shadow-[0_16px_40px_-12px_rgba(217,232,196,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F6F3EA] sm:w-auto"
            >
              Shop products
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/pages/science"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#D89455]/55 bg-[#10201A]/30 px-8 py-[14px] text-[15px] font-semibold text-[#F6F3EA]/90 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D9E8C4]/60 hover:bg-white/[0.05] hover:text-white sm:w-auto"
            >
              How we formulate
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Specimen column ── */}
        <motion.div
          style={reduceMotion ? {} : { y: specimenY }}
          className="relative z-10 mx-auto mt-12 flex w-full flex-col items-center justify-end pb-[60px] lg:mt-0 lg:h-full lg:pb-0"
        >
          <div className="relative w-full max-w-[440px] sm:max-w-[560px] lg:w-full lg:max-w-none">
            <div
              className="relative z-20 flex w-full items-end justify-center -translate-x-[20px] translate-y-[calc(13svh_-_135px)] md:translate-y-[calc(13svh_-_65px)]"
            >
              {/* Orange glow behind products */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                aria-hidden
                style={{
                  width: "83%",
                  paddingBottom: "83%",
                  borderRadius: "50%",
                  background: "radial-gradient(ellipse at center, rgba(231,164,108,0.55) 0%, rgba(216,148,85,0.28) 38%, transparent 72%)",
                  filter: "blur(32px)",
                  transform: "translate(-50%, calc(-50% - 70px))",
                }}
              />
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2, ease: scrollEase }}
                className="relative z-10"
              >
                <Image
                  src="/our%20story%20hero.png"
                  alt="Three NutriZen products — Zinc, Metabol+ and Cellunex — on a stone base"
                  width={1080}
                  height={1080}
                  priority
                  sizes="(max-width: 640px) 104vw, (max-width: 1024px) 69vw, 57.5vw"
                  className="select-none h-auto w-[132%] md:w-[161%] lg:w-[115%]"
                  style={{
                    maxWidth: "none",
                    filter: "drop-shadow(0 40px 70px rgba(0,0,0,0.85))",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Right leaf — sits above stats bar ── */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 z-[40] w-[220px] sm:w-[280px] lg:w-[360px] xl:w-[440px]"
        style={{ opacity: 0.72, transform: "translateX(55%)" }}
        aria-hidden
      >
        <Image
          src="/right%20leaf%20element.png"
          alt=""
          width={705}
          height={1240}
          className="h-auto w-full object-contain object-bottom"
          style={{ filter: "brightness(0.75) saturate(1.1)" }}
        />
      </div>

      {/* ── Stats bar — pinned to bottom ── */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.15, ease: scrollEase }}
        className="absolute inset-x-0 bottom-0 z-30 px-4 pb-5 lg:px-10 xl:px-16"
      >
        <div className="mx-auto max-w-[1540px] rounded-2xl border border-white/[0.10] bg-[#071209]/80 backdrop-blur-xl">
          <ul className="grid grid-cols-1 divide-y divide-white/[0.10] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STATS.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-center gap-4 px-6 py-4"
              >
                <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full border border-[#D89455]/35 bg-[#10201A]/60 text-[#E7A46C]">
                  <HeroIcon name={item.icon} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-serif text-2xl font-semibold text-[#D9E8C4]">
                    {item.value}
                  </span>
                  <span className="mt-0.5 block text-sm text-[#F6F3EA]/65">
                    {item.label}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
