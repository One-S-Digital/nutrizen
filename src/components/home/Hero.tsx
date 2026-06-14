"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  BotanicalFrond,
  BotanicalSprig,
  GrainOverlay,
} from "@/components/ui/Texture";
import DNAHelixMotion from "@/components/home/DNAHelixMotion";
import InfusionField from "@/components/home/InfusionField";
import { scrollEase } from "@/lib/motion";

const ANNOTATIONS: Array<{
  title: string;
  sub: string;
  icon: string;
  side: "left" | "right";
  top: string;
  delay: number;
}> = [
  {
    title: "Clinically dosed",
    sub: "Effective amounts you can trust.",
    icon: "leaf",
    side: "right",
    top: "24%",
    delay: 1.05,
  },
  {
    title: "Clean label",
    sub: "No fillers. Full disclosure.",
    icon: "drop",
    side: "right",
    top: "48%",
    delay: 1.2,
  },
  {
    title: "Digestive support",
    sub: "Supports detox and daily balance.",
    icon: "plus",
    side: "right",
    top: "72%",
    delay: 1.35,
  },
];

const TRUST_ITEMS = [
  {
    title: "Free shipping",
    sub: "Over R690",
    icon: "truck",
  },
  {
    title: "30-day guarantee",
    sub: "No questions asked",
    icon: "shield",
  },
  {
    title: "4.9★",
    sub: "Customer rating",
    icon: "star",
  },
  {
    title: "15 000+",
    sub: "Customers",
    icon: "users",
  },
];

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

function Magnetic({
  children,
  strength = 0.22,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HeroIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
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

  if (name === "truck") {
    return (
      <svg {...common}>
        <path d="M10 17H5V6h10v11h-1.5" />
        <path d="M15 9h3.5l2 3.2V17H19" />
        <circle cx="7" cy="17" r="1.7" />
        <circle cx="17.2" cy="17" r="1.7" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="M12 3 5.5 5.4v5.2c0 4.2 2.7 7.7 6.5 9.4 3.8-1.7 6.5-5.2 6.5-9.4V5.4L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  if (name === "star") {
    return (
      <svg {...common}>
        <path d="m12 3.8 2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6L7.2 19l.9-5.5-4-3.9 5.5-.8L12 3.8Z" />
      </svg>
    );
  }
  if (name === "users") {
    return (
      <svg {...common}>
        <path d="M16 18.5c0-2-1.8-3.5-4-3.5s-4 1.5-4 3.5" />
        <circle cx="12" cy="10" r="3" />
        <path d="M4.5 17c0-1.4 1.1-2.6 2.7-3" />
        <path d="M19.5 17c0-1.4-1.1-2.6-2.7-3" />
        <path d="M6.8 9.3a2 2 0 1 1 2.4-3" />
        <path d="M17.2 9.3a2 2 0 1 0-2.4-3" />
      </svg>
    );
  }
  if (name === "plus") {
    return (
      <svg {...common}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
        <path d="M8.5 8.5h7v7h-7z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M19 5c-7.5.7-12.5 4.7-14 12 5.8.9 10.8-1.9 14-12Z" />
      <path d="M8 16c2.6-3.8 5.4-6 8.7-7.4" />
    </svg>
  );
}

function AnnotationLine({
  title,
  sub,
  icon,
  side,
  top,
  delay,
  reduceMotion,
}: (typeof ANNOTATIONS)[number] & { reduceMotion: boolean }) {
  const isLeft = side === "left";
  return (
    <div
      className={`absolute z-20 hidden xl:flex items-center gap-4 ${
        isLeft ? "" : "flex-row-reverse"
      }`}
      style={{
        top,
        [isLeft ? "left" : "right"]: "-25%",
        width: "54%",
      }}
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: delay + 0.25, ease: scrollEase }}
        className={isLeft ? "text-right" : "text-left"}
      >
        <p className="whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.34em] text-paper [text-shadow:0_1px_3px_rgba(0,0,0,0.95)]">
          {title}
        </p>
        <p className="mt-2 max-w-[18ch] text-sm leading-relaxed tracking-[0.02em] text-paper/70 [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]">
          {sub}
        </p>
      </motion.div>
      <div className="relative h-px flex-1">
        <motion.span
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay, ease: scrollEase }}
          className={`absolute inset-0 bg-gradient-to-r ${
            isLeft
              ? "from-primary/10 via-[#D89455]/60 to-[#D89455] origin-left"
              : "from-[#D89455] via-[#D89455]/60 to-primary/10 origin-right"
          }`}
        />
      </div>
      <motion.span
        initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.7, ease: scrollEase }}
        className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full border border-[#D89455]/40 bg-ink-deep/65 text-[#E7A46C] shadow-[0_0_0_6px_rgba(216,148,85,0.08),0_0_24px_rgba(216,148,85,0.2)] backdrop-blur-sm"
      >
        <HeroIcon name={icon} className="h-5 w-5" />
      </motion.span>
    </div>
  );
}

export default function Hero() {
  const reduceMotion = !!useReducedMotion();
  const canHover = useCanHover();
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

  // Scroll: text lifts and fades, specimen drifts slower.
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, -56]);
  const textOpacity = useTransform(scrollY, [0, 420], [1, 0]);
  const specimenY = useTransform(scrollY, [0, 600], [0, 60]);

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
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: scrollEase },
    },
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={canHover ? handleMouseMove : undefined}
      onMouseLeave={canHover ? handleMouseLeave : undefined}
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink-deep"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-[radial-gradient(95%_78%_at_76%_35%,rgba(48,70,45,0.78)_0%,rgba(13,32,22,0.82)_42%,#07120D_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(44%_54%_at_70%_48%,rgba(229,150,79,0.12)_0%,transparent_64%),linear-gradient(90deg,rgba(2,10,7,0.48)_0%,transparent_36%,rgba(2,8,6,0.22)_100%)]"
        aria-hidden
      />
      <div
        className="absolute -bottom-28 -left-24 w-[440px] text-[#8FA77C]/50 blur-[1px] lg:w-[650px]"
        aria-hidden
      >
        <BotanicalFrond className="h-auto w-full rotate-[18deg] opacity-55" />
      </div>
      <div
        className="absolute -bottom-32 right-[-120px] w-[420px] text-[#607852]/45 blur-[1.5px] lg:w-[620px]"
        aria-hidden
      >
        <BotanicalSprig className="h-auto w-full rotate-[210deg] opacity-60" />
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-[29%] bg-[radial-gradient(70%_120%_at_70%_0%,rgba(116,88,49,0.5)_0%,rgba(20,26,17,0.78)_42%,rgba(4,11,8,0.98)_82%),linear-gradient(180deg,transparent_0%,rgba(4,12,9,0.96)_76%)]"
        aria-hidden
      />
      <InfusionField
        getCursor={getCursor}
        reduceMotion={reduceMotion}
        className="absolute inset-0 h-full w-full"
      />
      <GrainOverlay className="opacity-[0.055]" />

      {/* ── Content grid ── */}
      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-[1540px] grid-cols-1 items-center gap-x-8 px-6 pb-40 pt-32 md:pt-36 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:pb-28 lg:pt-28 xl:px-16">
        {/* Editorial column */}
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          style={reduceMotion ? {} : { y: textY, opacity: textOpacity }}
          className="relative z-20 max-w-2xl"
        >
          <motion.p
            variants={childVariants}
            className="mb-7 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.42em] text-[#E7A46C]"
          >
            <span className="h-px w-9 bg-glow/50" aria-hidden />
            NutriZen · Precision Wellness
          </motion.p>

          <motion.h1
            variants={childVariants}
            className="font-serif text-[2.55rem] leading-[1.02] tracking-[-0.02em] text-paper min-[420px]:text-[2.95rem] sm:text-[3.8rem] lg:text-[4.65rem] xl:text-[5.55rem]"
          >
            Supplements with
            <br />
            <em className="italic text-glow">nothing to hide.</em>
          </motion.h1>

          <motion.p
            variants={childVariants}
            className="mt-7 max-w-[48ch] text-base leading-relaxed text-paper/78 md:text-xl"
          >
            No fillers. No proprietary blends. Clinically dosed nutrients in the
            forms your body actually absorbs — formulated in the open, delivered
            across South Africa.
          </motion.p>

          <motion.div
            variants={childVariants}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <Link
                href="/shop"
                className="group inline-flex w-full items-center justify-center gap-4 rounded-full bg-glow px-9 py-4 text-[15px] font-bold text-ink-deep shadow-[0_18px_45px_-14px_rgba(217,232,196,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-paper sm:w-auto"
              >
                Shop bestsellers
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </Magnetic>
            <a
              href="#goals"
              className="group inline-flex w-full items-center justify-center gap-4 rounded-full border border-[#D89455]/60 bg-ink-deep/20 px-8 py-4 text-[15px] font-semibold text-paper/90 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-glow hover:bg-white/[0.04] hover:text-white sm:w-auto"
            >
              Find your formula
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
                className="transition-transform duration-300 group-hover:translate-y-0.5"
                aria-hidden
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        {/* Specimen column */}
        <motion.div
          style={reduceMotion ? {} : { y: specimenY }}
          className="relative z-10 mx-auto mt-14 w-full max-w-[330px] sm:max-w-[390px] lg:mt-0 lg:max-w-[620px]"
        >
          <div className="relative" style={{ perspective: 1000 }}>
            {/* Backlight */}
            <div
              className="absolute left-1/2 top-1/2 h-[132%] w-[132%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-glow/[0.08] bg-[radial-gradient(circle,rgba(229,150,79,0.15)_0%,rgba(140,171,119,0.11)_34%,transparent_66%)]"
              aria-hidden
            />

            {/* Rotating double helix behind the specimen — disperses locally on hover */}
            <div
              className="pointer-events-none absolute left-1/2 top-[47%] h-[188%] w-[100%] -translate-x-1/2 -translate-y-1/2 opacity-95 mix-blend-screen"
              aria-hidden
            >
              <DNAHelixMotion
                reduceMotion={reduceMotion}
                className="h-full w-full"
              />
            </div>

            {ANNOTATIONS.map((a) => (
              <AnnotationLine
                key={a.title}
                {...a}
                reduceMotion={reduceMotion}
              />
            ))}

            <motion.div
              initial={
                reduceMotion ? false : { opacity: 0, y: 36, scale: 0.93 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.25, delay: 0.2, ease: scrollEase }}
            >
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -11, 0] }}
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 7.5, repeat: Infinity, ease: "easeInOut" }
                }
              >
                <div className="relative aspect-square w-full translate-y-4">
                  <Image
                    src="/metabol.png"
                    alt="NutriZen Metabol+ — improve metabolism, digestive health and cellular detox"
                    fill
                    priority
                    sizes="(max-width: 640px) 300px, (max-width: 1024px) 360px, 520px"
                    className="select-none object-contain drop-shadow-[0_42px_54px_rgba(0,0,0,0.62)]"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Floor shadow */}
            <div
              className="absolute -bottom-4 left-1/2 h-10 w-[62%] -translate-x-1/2 rounded-[50%] bg-black/65 blur-2xl"
              aria-hidden
            />
          </div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.5 }}
            className="mt-9 text-center font-mono text-[10px] uppercase tracking-[0.34em] text-glow/85"
          >
            Specimen 05 — Metabol+ · 500 mg · 60 capsules
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.15, ease: scrollEase }}
        className="absolute bottom-9 left-1/2 z-20 hidden w-[min(76rem,calc(100%-3rem))] -translate-x-1/2 rounded-[1.6rem] border border-white/10 bg-[#08150F]/72 px-8 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl lg:block"
      >
        <ul className="grid grid-cols-4 divide-x divide-white/14">
          {TRUST_ITEMS.map((item) => (
            <li
              key={item.title}
              className="flex items-center justify-center gap-5 px-6"
            >
              <span className="grid h-10 w-10 place-items-center text-[#E7A46C]">
                <HeroIcon name={item.icon} className="h-8 w-8" />
              </span>
              <span>
                <span className="block font-mono text-[12px] uppercase tracking-[0.28em] text-paper">
                  {item.title}
                </span>
                <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.24em] text-paper/68">
                  {item.sub}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.9 }}
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/30">
          Scroll
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            animate={reduceMotion ? undefined : { y: [-14, 44] }}
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 1.9,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.6, 1],
                  }
            }
            className="absolute left-0 top-0 h-3.5 w-px bg-glow/80"
          />
        </span>
      </motion.div>
    </section>
  );
}
