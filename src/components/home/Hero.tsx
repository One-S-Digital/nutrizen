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

const ANNOTATIONS = [
  {
    title: "Metabolic support",
    sub: "500 mg · 60 capsules",
    side: "left" as const,
    top: "21%",
    delay: 1.05,
  },
  {
    title: "Digestive health",
    sub: "cellular detox support",
    side: "right" as const,
    top: "46%",
    delay: 1.2,
  },
  {
    title: "Clean label",
    sub: "no fillers · full disclosure",
    side: "left" as const,
    top: "71%",
    delay: 1.35,
  },
];

const TRUST_ITEMS = [
  "Free shipping over R690",
  "30-day guarantee",
  "4.9★ · 15 000+ customers",
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

function AnnotationLine({
  title,
  sub,
  side,
  top,
  delay,
  reduceMotion,
}: (typeof ANNOTATIONS)[number] & { reduceMotion: boolean }) {
  const isLeft = side === "left";
  return (
    <div
      className={`absolute z-20 hidden lg:flex items-center gap-3 ${
        isLeft ? "" : "flex-row-reverse"
      }`}
      style={{
        top,
        [isLeft ? "left" : "right"]: "-16%",
        width: "44%",
      }}
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: delay + 0.25, ease: scrollEase }}
        className={isLeft ? "text-right" : "text-left"}
      >
        <p className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.95),0_0_14px_rgba(217,232,196,0.5)]">
          {title}
        </p>
        <p className="mt-1 whitespace-nowrap font-mono text-[10px] tracking-[0.08em] text-glow [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]">
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
              ? "from-glow/15 via-glow/60 to-glow origin-left"
              : "from-glow via-glow/60 to-glow/15 origin-right"
          }`}
        />
      </div>
      <motion.span
        initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.7, ease: scrollEase }}
        className="relative block h-7 w-7 flex-shrink-0"
      >
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow shadow-[0_0_10px_rgba(217,232,196,0.9)]" />
        <span
          className="absolute inset-0"
          style={{ transform: `scaleY(0.42) rotate(${isLeft ? -18 : 18}deg)` }}
        >
          <span className="absolute inset-0 rounded-full border border-glow/30" />
          {!reduceMotion && (
            <>
              <span className="absolute inset-0 animate-orbit">
                <span className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-glow" />
              </span>
              <span className="absolute inset-1 animate-orbit-reverse">
                <span className="absolute bottom-0 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-primary" />
              </span>
            </>
          )}
        </span>
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
      <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_72%_18%,#1E3326_0%,#0E1B14_50%,#070F0B_100%)]" aria-hidden />
      <div
        className="absolute -bottom-28 -left-20 w-[400px] text-[#18291F] blur-[2px] lg:w-[560px]"
        aria-hidden
      >
        <BotanicalFrond className="h-auto w-full rotate-[26deg]" />
      </div>
      <div
        className="absolute -top-24 right-[-70px] w-[330px] text-[#16261D] blur-[3px] lg:w-[440px]"
        aria-hidden
      >
        <BotanicalSprig className="h-auto w-full rotate-[148deg]" />
      </div>
      <InfusionField
        getCursor={getCursor}
        reduceMotion={reduceMotion}
        className="absolute inset-0 h-full w-full"
      />
      <GrainOverlay className="opacity-[0.055]" />

      {/* ── Content grid ── */}
      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-7xl grid-cols-1 items-center gap-x-8 px-6 pb-20 pt-32 md:pt-36 lg:grid-cols-[1.04fr_0.96fr] lg:pb-12 lg:pt-28">
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
            className="mb-7 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-white"
          >
            <span className="h-px w-9 bg-glow/50" aria-hidden />
            NutriZen · Precision Wellness
          </motion.p>

          <motion.h1
            variants={childVariants}
            className="font-serif text-[2.35rem] leading-[1.06] tracking-[-0.015em] text-paper min-[420px]:text-[2.7rem] sm:text-[3.5rem] lg:text-[4.1rem] xl:text-[4.7rem]"
          >
            Supplements with
            <br />
            <em className="italic text-glow">nothing to hide.</em>
          </motion.h1>

          <motion.p
            variants={childVariants}
            className="mt-7 max-w-[46ch] text-base leading-relaxed text-white/55 md:text-lg"
          >
            No fillers. No proprietary blends. Clinically dosed nutrients in
            the forms your body actually absorbs — formulated in the open,
            delivered across South Africa.
          </motion.p>

          <motion.div
            variants={childVariants}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <Link
                href="/shop"
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-9 py-4 text-[15px] font-semibold text-ink-deep shadow-[0_14px_40px_-12px_rgba(140,171,119,0.7)] transition-colors duration-300 hover:bg-glow sm:w-auto"
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
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-white/15 px-7 py-4 text-[15px] font-medium text-white/75 transition-colors duration-300 hover:border-white/35 hover:text-white sm:w-auto"
            >
              How do you want to feel?
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

          <motion.ul
            variants={childVariants}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2.5"
          >
            {TRUST_ITEMS.map((item, i) => (
              <li
                key={item}
                className="flex items-center gap-x-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80"
              >
                {i > 0 && (
                  <span className="text-glow/40" aria-hidden>
                    ✦
                  </span>
                )}
                {item}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Specimen column */}
        <motion.div
          style={reduceMotion ? {} : { y: specimenY }}
          className="relative z-10 mx-auto mt-14 w-full max-w-[300px] sm:max-w-[360px] lg:mt-0 lg:max-w-[520px]"
        >
          <div className="relative" style={{ perspective: 1000 }}>
            {/* Backlight */}
            <div
              className="absolute left-1/2 top-1/2 h-[115%] w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(140,171,119,0.16)_0%,transparent_62%)]"
              aria-hidden
            />

            {/* Rotating double helix behind the specimen — disperses locally on hover */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[168%] w-[104%] -translate-x-1/2 -translate-y-1/2 opacity-90"
              aria-hidden
            >
              <DNAHelixMotion
                reduceMotion={reduceMotion}
                className="h-full w-full"
              />
            </div>

            {ANNOTATIONS.map((a) => (
              <AnnotationLine key={a.title} {...a} reduceMotion={reduceMotion} />
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
                <div className="relative aspect-square w-full">
                  <Image
                    src="/metabol.png"
                    alt="NutriZen Metabol+ — improve metabolism, digestive health and cellular detox"
                    fill
                    priority
                    sizes="(max-width: 640px) 300px, (max-width: 1024px) 360px, 520px"
                    className="select-none object-contain drop-shadow-[0_36px_44px_rgba(0,0,0,0.5)]"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Floor shadow */}
            <div
              className="absolute -bottom-2 left-1/2 h-7 w-[52%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-xl"
              aria-hidden
            />
          </div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.5 }}
            className="mt-7 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-glow/90"
          >
            Specimen 05 — Metabol+ · 500 mg · 60 capsules
          </motion.p>
        </motion.div>
      </div>

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
