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
  { title: "Clinically Dosed", sub: "Effective amounts you can trust.", icon: "leaf", side: "right", top: "22%", delay: 1.05 },
  { title: "Clean Label", sub: "No fillers. Full disclosure.", icon: "drop", side: "right", top: "47%", delay: 1.2 },
  { title: "Digestive Support", sub: "Supports detox and daily balance.", icon: "plus", side: "right", top: "70%", delay: 1.35 },
];

const TRUST_ITEMS = [
  { title: "Free Shipping", sub: "Over R690", icon: "truck" },
  { title: "30-Day Guarantee", sub: "No Questions Asked", icon: "shield" },
  { title: "4.9★", sub: "Customer Rating", icon: "star" },
  { title: "15 000+", sub: "Customers", icon: "users" },
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

function Magnetic({ children, strength = 0.22, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
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
  const handleLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ x: sx, y: sy }} className={className}>
      {children}
    </motion.div>
  );
}

function HeroIcon({ name, className = "" }: { name: string; className?: string }) {
  const common = { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className, "aria-hidden": true };
  if (name === "truck") return <svg {...common}><path d="M10 17H5V6h10v11h-1.5"/><path d="M15 9h3.5l2 3.2V17H19"/><circle cx="7" cy="17" r="1.7"/><circle cx="17.2" cy="17" r="1.7"/></svg>;
  if (name === "shield") return <svg {...common}><path d="M12 3 5.5 5.4v5.2c0 4.2 2.7 7.7 6.5 9.4 3.8-1.7 6.5-5.2 6.5-9.4V5.4L12 3Z"/><path d="m9 12 2 2 4-4"/></svg>;
  if (name === "star") return <svg {...common}><path d="m12 3.8 2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6L7.2 19l.9-5.5-4-3.9 5.5-.8L12 3.8Z"/></svg>;
  if (name === "users") return <svg {...common}><path d="M16 18.5c0-2-1.8-3.5-4-3.5s-4 1.5-4 3.5"/><circle cx="12" cy="10" r="3"/><path d="M4.5 17c0-1.4 1.1-2.6 2.7-3"/><path d="M19.5 17c0-1.4-1.1-2.6-2.7-3"/><path d="M6.8 9.3a2 2 0 1 1 2.4-3"/><path d="M17.2 9.3a2 2 0 1 0-2.4-3"/></svg>;
  if (name === "plus") return <svg {...common}><path d="M12 5v14"/><path d="M5 12h14"/><path d="M8.5 8.5h7v7h-7z"/></svg>;
  return <svg {...common}><path d="M19 5c-7.5.7-12.5 4.7-14 12 5.8.9 10.8-1.9 14-12Z"/><path d="M8 16c2.6-3.8 5.4-6 8.7-7.4"/></svg>;
}

function AnnotationLine({ title, sub, icon, side, top, delay, reduceMotion }: (typeof ANNOTATIONS)[number] & { reduceMotion: boolean }) {
  const isLeft = side === "left";
  return (
    <div
      className={`absolute z-20 hidden xl:flex items-center gap-4 ${isLeft ? "" : "flex-row-reverse"}`}
      style={{ top, [isLeft ? "left" : "right"]: "-25%", width: "54%" }}
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: delay + 0.25, ease: scrollEase }}
        className={isLeft ? "text-right" : "text-left"}
      >
        <p className="whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.34em] text-paper [text-shadow:0_1px_3px_rgba(0,0,0,0.95)]">{title}</p>
        <p className="mt-2 max-w-[18ch] text-sm leading-relaxed tracking-[0.02em] text-paper/70 [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]">{sub}</p>
      </motion.div>
      <div className="relative h-px flex-1">
        <motion.span
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay, ease: scrollEase }}
          className={`absolute inset-0 bg-gradient-to-r ${isLeft ? "from-primary/10 via-[#D89455]/60 to-[#D89455] origin-left" : "from-[#D89455] via-[#D89455]/60 to-primary/10 origin-right"}`}
        />
      </div>
      <motion.span
        initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
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
  const handleMouseLeave = () => { cursorRef.current = { x: -9999, y: -9999 }; };

  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, -56]);
  const textOpacity = useTransform(scrollY, [0, 420], [1, 0]);
  const specimenY = useTransform(scrollY, [0, 600], [0, 60]);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1, delayChildren: reduceMotion ? 0 : 0.15 } },
  };
  const childVariants: Variants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: scrollEase } },
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={canHover ? handleMouseMove : undefined}
      onMouseLeave={canHover ? handleMouseLeave : undefined}
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#071209]"
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#071209]/92 via-[#071209]/35 to-[#071209]/15" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071209]/55 via-transparent to-[#071209]/85" />
      </div>

      {/* ── Layer 2: InfusionField sparkle (existing hover effect, untouched) ── */}
      <InfusionField
        getCursor={getCursor}
        reduceMotion={reduceMotion}
        className="absolute inset-0 z-[1] h-full w-full"
      />

      {/* ── Layer 3: Left leaf cluster ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-[2] w-[200px] sm:w-[260px] lg:w-[320px] xl:w-[380px]"
        aria-hidden
      >
        <Image
          src="/hero-leaves-left.png"
          alt=""
          width={380}
          height={570}
          className="h-auto w-full object-contain"
          style={{ objectPosition: "bottom left" }}
        />
      </div>

      {/* ── Layer 4: Right leaf cluster ── */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 z-[2] w-[160px] sm:w-[200px] lg:w-[260px] xl:w-[300px]"
        aria-hidden
      >
        <Image
          src="/hero-leaves-right.png"
          alt=""
          width={300}
          height={450}
          className="h-auto w-full object-contain"
          style={{ objectPosition: "bottom right" }}
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
      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-[1540px] grid-cols-1 items-center gap-x-8 px-6 pb-[160px] pt-28 md:pt-32 lg:grid-cols-[1fr_1fr] lg:px-10 lg:pb-[140px] lg:pt-24 xl:px-16">

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
            className="mb-6 font-mono text-[11px] uppercase tracking-[0.42em] text-[#E7A46C]"
          >
            NutriZen · Precision Wellness
          </motion.p>

          <motion.h1
            variants={childVariants}
            className="font-serif text-[2.4rem] leading-[1.03] tracking-[-0.02em] text-[#F6F3EA] min-[420px]:text-[2.8rem] sm:text-[3.6rem] lg:text-[4.4rem] xl:text-[5.2rem]"
          >
            Supplements with
            <br />
            <em className="italic text-[#8CAB77]">nothing to hide</em>
            <span className="text-[#E7A46C] not-italic">.</span>
          </motion.h1>

          <motion.p
            variants={childVariants}
            className="mt-6 max-w-[46ch] text-base leading-relaxed text-[#F6F3EA]/72 md:text-[1.05rem]"
          >
            No fillers. No proprietary blends. Clinically dosed nutrients in the
            forms your body actually absorbs — formulated in the open, delivered
            across South Africa.
          </motion.p>

          <motion.div
            variants={childVariants}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <Link
                href="/shop"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#D9E8C4] px-8 py-[14px] text-[15px] font-semibold text-[#10201A] shadow-[0_16px_40px_-12px_rgba(217,232,196,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F6F3EA] sm:w-auto"
              >
                Shop bestsellers
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href="#goals"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#D89455]/55 bg-[#10201A]/30 px-8 py-[14px] text-[15px] font-semibold text-[#F6F3EA]/90 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D9E8C4]/60 hover:bg-white/[0.05] hover:text-white sm:w-auto"
              >
                Find your formula
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Specimen column */}
        <motion.div
          style={reduceMotion ? {} : { y: specimenY }}
          className="relative z-10 mx-auto mt-12 flex w-full flex-col items-center lg:mt-0"
        >
          <div className="relative w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[500px] xl:max-w-[560px]">

            {/* Backlight halo */}
            <div
              className="absolute left-1/2 top-[40%] h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(229,150,79,0.18)_0%,rgba(140,171,119,0.12)_35%,transparent_65%)]"
              aria-hidden
            />

            {/* DNA helix — existing component, hover effects untouched */}
            <div
              className="pointer-events-none absolute left-1/2 top-[44%] h-[190%] w-[105%] -translate-x-1/2 -translate-y-1/2 opacity-95 mix-blend-screen"
              aria-hidden
            >
              <DNAHelixMotion reduceMotion={reduceMotion} className="h-full w-full" />
            </div>

            {/* Annotation lines */}
            {ANNOTATIONS.map((a) => (
              <AnnotationLine key={a.title} {...a} reduceMotion={reduceMotion} />
            ))}

            {/* Product bottle — floats above stone */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.25, delay: 0.2, ease: scrollEase }}
              className="relative z-20"
            >
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                transition={reduceMotion ? undefined : { duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative mx-auto aspect-[3/4] w-[70%]">
                  <Image
                    src="/metabol.png"
                    alt="NutriZen Metabol+ — improve metabolism, digestive health and cellular detox"
                    fill
                    priority
                    sizes="(max-width: 640px) 210px, (max-width: 1024px) 280px, 392px"
                    className="select-none object-contain"
                    style={{
                      filter: "drop-shadow(0 28px 44px rgba(0,0,0,0.78)) drop-shadow(0 6px 14px rgba(229,150,79,0.16)) brightness(1.05) contrast(1.02)",
                    }}
                  />
                  {/* Warm light overlay on product */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: "radial-gradient(ellipse 55% 70% at 58% 18%, rgba(229,150,79,0.07) 0%, transparent 55%)",
                      mixBlendMode: "screen",
                    }}
                    aria-hidden
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Stone / moss base */}
            <div className="relative z-10 -mt-[10%] w-full">
              <Image
                src="/hero-stone-base.png"
                alt=""
                width={560}
                height={315}
                className="h-auto w-full object-contain"
                style={{
                  filter: "drop-shadow(0 20px 36px rgba(0,0,0,0.72)) brightness(0.85) saturate(0.88)",
                }}
              />
              {/* Ground shadow */}
              <div
                className="absolute -bottom-3 left-1/2 h-7 w-[65%] -translate-x-1/2 rounded-[50%] bg-black/55 blur-xl"
                aria-hidden
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Trust bar ── */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.15, ease: scrollEase }}
        className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/[0.08] bg-[#071209]/82 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-[1540px] px-4 lg:px-10 xl:px-16">
          <ul className="grid grid-cols-2 divide-x divide-y divide-white/[0.08] sm:grid-cols-4 sm:divide-y-0">
            {TRUST_ITEMS.map((item) => (
              <li key={item.title} className="flex items-center gap-4 px-5 py-5 sm:justify-center sm:px-6">
                <span className="flex-shrink-0 text-[#E7A46C]">
                  <HeroIcon name={item.icon} className="h-7 w-7" />
                </span>
                <span>
                  <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[#F6F3EA]">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#F6F3EA]/55">
                    {item.sub}
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
