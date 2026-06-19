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
  { title: "Clinically Dosed", sub: "Effective amounts you can trust.", icon: "leaf", side: "right", top: "20%", delay: 1.05 },
  { title: "Clean Label", sub: "No fillers. Full disclosure.", icon: "drop", side: "right", top: "40%", delay: 1.2 },
  { title: "Digestive Support", sub: "Supports detox and daily balance.", icon: "plus", side: "right", top: "54%", delay: 1.35 },
];

const TRUST_ITEMS = [
  { title: "Free Shipping", sub: "Over R690", icon: "truck" },
  { title: "30-Day Guarantee", sub: "", icon: "shield" },
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

function AnnotationLine({ title, sub, icon, top, delay, reduceMotion }: (typeof ANNOTATIONS)[number] & { reduceMotion: boolean }) {
  return (
    <div className="hero-annotation" style={{ top, left: "58%", right: "0%" }}>
      {/* short connector line from bottle edge to icon */}
      <div className="hero-annotation-line">
        <motion.span
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay, ease: scrollEase }}
          className="absolute inset-0 origin-left bg-gradient-to-r from-[#D89455] to-[#D89455]/50"
        />
      </div>
      {/* icon */}
      <motion.span
        initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.5, ease: scrollEase }}
        className="hero-annotation-icon"
      >
        <HeroIcon name={icon} className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
      </motion.span>
      {/* text */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: delay + 0.25, ease: scrollEase }}
        className="min-w-0 text-left"
      >
        <p className="hero-annotation-title">{title}</p>
        <p className="hero-annotation-sub">{sub}</p>
      </motion.div>
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
      className="hero-shell"
    >
      {/* ── Layer 1: Background image ── */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image src="/hero-bg.png" alt="" fill priority sizes="100vw" className="object-cover object-center" quality={90} />
        {/* Left side darkening for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071209]/95 via-[#071209]/50 to-transparent" />
        {/* Top and bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#071209]/60 via-transparent to-[#071209]/90" />
      </div>

      {/* ── Layer 2: InfusionField sparkle (existing hover effect, untouched) ── */}
      <InfusionField getCursor={getCursor} reduceMotion={reduceMotion} className="absolute inset-0 z-[1] h-full w-full" />

      {/* ── Layer 3: Left leaf cluster — z-[5] keeps it behind text column ── */}
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
          sizes="(max-width: 640px) 220px, (max-width: 1024px) 370px, 460px"
          className="h-auto w-full object-contain object-bottom"
          style={{ filter: "brightness(0.75) saturate(1.1)" }}
        />
      </div>

      {/* Layer 4 placeholder — right leaf moved inside specimen column for correct z-ordering */}

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
      <div className="hero-grid">

        {/* ── Editorial / text column ── */}
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          style={reduceMotion ? {} : { y: textY, opacity: textOpacity }}
          className="hero-copy"
        >
          <motion.p variants={childVariants} className="hero-eyebrow">
            NutriZen · Precision Wellness
          </motion.p>

          <motion.h1 variants={childVariants} className="hero-title">
            Clean Supplements<span className="text-[#E7A46C] not-italic">.</span>
            <br />
            <em className="italic text-[#8CAB77]">Real Results</em>
            <span className="text-[#E7A46C] not-italic">.</span>
          </motion.h1>

          <motion.p variants={childVariants} className="hero-lede">
            No fillers. No proprietary blends. Clinically dosed nutrients in the
            forms your body actually absorbs — formulated in the open, delivered
            across South Africa.
          </motion.p>

          <motion.div variants={childVariants} className="hero-actions">
            <Magnetic>
              <Link href="/shop" className="group hero-btn hero-btn-primary">
                Shop bestsellers
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </Link>
            </Magnetic>
            <Magnetic>
              <a href="#goals" className="group hero-btn hero-btn-ghost">
                Find your formula
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* ── Specimen column ── */}
        <motion.div
          style={reduceMotion ? {} : { y: specimenY }}
          className="relative z-10 mx-auto mt-10 flex w-full flex-col items-center justify-end pb-[60px] lg:mt-0 lg:h-full lg:items-end lg:pb-0"
        >
          {/* Right leaf — z-[15] inside specimen: above stone (z-10) and below annotations (z-30) */}
          <div
            className="pointer-events-none absolute bottom-0 -right-10 xl:-right-16 z-[15] w-[200px] sm:w-[260px] lg:w-[320px] xl:w-[400px] translate-x-[30%]"
            style={{ opacity: 0.62 }}
            aria-hidden
          >
            <Image
              src="/right%20leaf%20element.png"
              alt=""
              width={705}
              height={1240}
              sizes="(max-width: 640px) 200px, (max-width: 1024px) 320px, 400px"
              className="h-auto w-full object-contain object-bottom"
              style={{ filter: "brightness(0.75) saturate(1.1)" }}
            />
          </div>

          {/*
            The specimen stage is built as a stacking context:
            - Stone base sits at the bottom
            - Product bottle overlaps the stone (negative margin-bottom on bottle wrapper)
            - DNA helix and annotations are absolutely positioned relative to the outer container
          */}
          <div             className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-none lg:w-full">

            {/* Backlight halo behind product */}
            <div
              className="absolute left-[40%] top-[35%] h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(229,150,79,0.15) 0%, rgba(140,171,119,0.10) 32%, transparent 62%)" }}
              aria-hidden
            />

            {/* DNA helix — existing component, hover effects untouched */}
            <div
              className="pointer-events-none absolute left-[40%] top-[42%] h-[185%] w-[100%] -translate-x-1/2 -translate-y-1/2 opacity-95 mix-blend-screen"
              aria-hidden
            >
              <DNAHelixMotion reduceMotion={reduceMotion} className="h-full w-full" />
            </div>

            {/* Annotation lines (right side, xl+ only) */}
            {ANNOTATIONS.map((a) => (
              <AnnotationLine key={a.title} {...a} reduceMotion={reduceMotion} />
            ))}

            {/* Product + stone: bottle in normal flow, stone overlaps bottom via negative margin */}
            <div className="flex flex-col items-center w-full -translate-x-[10%] translate-y-[2svh] md:translate-y-[8svh]">
              {/* Product bottle */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.3, delay: 0.2, ease: scrollEase }}
                className="relative z-20 flex justify-center"
              >
                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
                  transition={reduceMotion ? undefined : { duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/metabol%20hero%20image.png"
                    alt="NutriZen Metabol+ — improve metabolism, digestive health and cellular detox"
                    width={547}
                    height={1024}
                    priority
                    sizes="(max-width: 640px) 200px, (max-width: 1024px) 280px, 420px"
                    className="select-none w-auto h-[min(40svh,420px)] md:h-[min(48svh,540px)] lg:h-[min(54svh,620px)]"
                    style={{
                      maxWidth: "none",
                      display: "block",
                      filter:
                        "drop-shadow(0 50px 80px rgba(0,0,0,0.9)) drop-shadow(0 10px 30px rgba(229,150,79,0.35)) drop-shadow(0 0 60px rgba(140,171,119,0.15)) brightness(1.08) contrast(1.04) saturate(1.08)",
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Stone / moss base — pulls up to overlap bottle bottom */}
              <div className="relative z-10 w-full -mt-[18%]">
                <Image
                  src="/stone%20base.png"
                  alt=""
                  width={1254}
                  height={566}
                  sizes="(max-width: 640px) 340px, (max-width: 1024px) 420px, 770px"
                  className="h-auto w-full object-contain"
                  style={{
                    filter: "drop-shadow(0 32px 56px rgba(0,0,0,0.9)) brightness(0.92) saturate(1.05)",
                  }}
                />
                {/* Ground shadow beneath stone */}
                <div
                  className="absolute -bottom-4 left-1/2 h-8 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-3xl"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Trust bar — pinned to bottom ── */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.15, ease: scrollEase }}
        className="hero-statbar"
      >
        <div className="hero-statbar-inner">
          <ul className="hero-statlist">
            {TRUST_ITEMS.map((item) => (
              <li key={item.title} className="hero-stat">
                <span className="hero-stat-icon">
                  <HeroIcon name={item.icon} className="h-6 w-6 lg:h-7 lg:w-7" />
                </span>
                <span>
                  <span className="hero-stat-title">{item.title}</span>
                  {item.sub && <span className="hero-stat-sub">{item.sub}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
