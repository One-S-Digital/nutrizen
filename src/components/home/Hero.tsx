"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DNAHelix from "@/components/ui/DNAHelix";
import AuroraBackground from "@/components/ui/AuroraBackground";

type ProductBottleProps = {
  src: string;
  alt: string;
  className?: string;
  baseRotate?: number;
  initialX: number;
  initialY: number;
  delay: number;
  floatDelay?: number;
  hoverTilt: { x: number; y: number };
  innerFloat?: boolean;
};

type HeroBottleConfig = {
  src: string;
  alt: string;
  mobileClassName: string;
  desktopClassName: string;
  baseRotate: number;
  initialX: number;
  initialY: number;
  delay: number;
  floatDelay: number;
  hoverTilt: { x: number; y: number };
};

const HERO_BOTTLES: HeroBottleConfig[] = [
  {
    src: "/vitacore.png",
    alt: "Vitacore B-Complex",
    mobileClassName: "w-36 h-36",
    desktopClassName:
      "absolute left-[-20%] md:left-[-14%] lg:left-[-8%] xl:left-[2%] top-[8%] md:top-[10%] lg:top-[12%] w-44 md:w-56 lg:w-72 xl:w-[380px] aspect-square z-10",
    baseRotate: -20,
    initialX: 260,
    initialY: 180,
    delay: 0.1,
    floatDelay: 0.05,
    hoverTilt: { x: -4, y: 5 },
  },
  {
    src: "/cellunex.png",
    alt: "Cellunex Insulin Support",
    mobileClassName: "w-32 h-32",
    desktopClassName:
      "absolute left-[4%] md:left-[8%] lg:left-[13%] xl:left-[17%] bottom-[3%] md:bottom-[6%] lg:bottom-[10%] w-[130px] md:w-[190px] lg:w-[260px] xl:w-[315px] aspect-square z-20",
    baseRotate: 23,
    initialX: 210,
    initialY: -120,
    delay: 0.18,
    floatDelay: 0.25,
    hoverTilt: { x: 4, y: -5 },
  },
  {
    src: "/zinc.png",
    alt: "Nutrizen Zinc + Copper & Selenium",
    mobileClassName: "w-32 h-32",
    desktopClassName: "",
    baseRotate: 0,
    initialX: -220,
    initialY: 120,
    delay: 0.22,
    floatDelay: 0.35,
    hoverTilt: { x: -4, y: 5 },
  },
];

function ProductBottle({
  src,
  alt,
  className = "",
  baseRotate = 0,
  initialX,
  initialY,
  delay,
  floatDelay = 0,
  hoverTilt,
  innerFloat = true,
}: ProductBottleProps) {
  const reduceMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className={className}>
      <motion.div
        className="h-full w-full min-h-0"
        initial={!reduceMotion ? { opacity: 0, x: initialX, y: initialY, scale: 0.9 } : false}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] }
        }
        style={{ willChange: "transform, opacity" }}
      >
        <motion.div
          className="h-full w-full min-h-0"
          animate={
            innerFloat && !reduceMotion ? { y: [0, -10, 0, 6, 0] } : undefined
          }
          transition={
            innerFloat && !reduceMotion
              ? { duration: 9, ease: "easeInOut", repeat: Infinity, delay: floatDelay }
              : undefined
          }
        >
          <motion.div
            className="select-none h-full w-full min-h-0 relative"
            initial={false}
            animate={{ rotateZ: baseRotate, rotateX: 0, rotateY: 0, y: 0 }}
            whileHover={
              !reduceMotion && canHover
                ? { rotateZ: baseRotate, rotateX: hoverTilt.x, rotateY: hoverTilt.y, y: -4 }
                : undefined
            }
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transformOrigin: "center center",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain filter drop-shadow-2xl opacity-90 pointer-events-none select-none"
              sizes="(max-width: 640px) 144px, (max-width: 1024px) 224px, (max-width: 1280px) 288px, 380px"
              priority
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const desktopBottles = [HERO_BOTTLES[0], HERO_BOTTLES[1]];
  const zincBottle = HERO_BOTTLES[2];

  // Scroll: fade + lift text only
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 400], [0, -40]);
  const textOpacity = useTransform(scrollY, [0, 350], [1, 0]);

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.95,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };

  const textChildVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <AuroraBackground>
      {/* section is the positioning context for all absolute bottles */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 w-full overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Mobile: bottles above text */}
        <div className="relative z-20 w-full md:hidden px-6">
          <div className="mx-auto max-w-sm flex items-end justify-between gap-4">
            {HERO_BOTTLES.slice(0, 2).map((bottle) => (
              <ProductBottle
                key={`mobile-top-${bottle.src}`}
                src={bottle.src}
                alt={bottle.alt}
                className={bottle.mobileClassName}
                baseRotate={bottle.baseRotate}
                initialX={bottle.initialX}
                initialY={bottle.initialY}
                delay={bottle.delay}
                floatDelay={bottle.floatDelay}
                hoverTilt={bottle.hoverTilt}
              />
            ))}
          </div>
          <div className="mx-auto mt-2 max-w-sm flex items-center justify-center">
            {HERO_BOTTLES.slice(2).map((bottle) => (
              <ProductBottle
                key={`mobile-bottom-${bottle.src}`}
                src={bottle.src}
                alt={bottle.alt}
                className={bottle.mobileClassName}
                baseRotate={bottle.baseRotate}
                initialX={0}
                initialY={24}
                delay={bottle.delay}
                floatDelay={bottle.floatDelay}
                hoverTilt={{ x: -3, y: 4 }}
              />
            ))}
          </div>
        </div>

        {/* Text — scroll parallax via motion.style, NOT position */}
        <motion.div
          className="relative z-20 max-w-4xl mx-auto px-6 text-center max-md:mt-8 md:-mt-[15vh]"
          style={reduceMotion ? {} : { y: textY, opacity: textOpacity }}
        >
          <motion.div
            variants={textVariants}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
          >
            <motion.span
              variants={textChildVariants}
              className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-4"
            >
              Precision Wellness
            </motion.span>

            <motion.h1
              variants={textChildVariants}
              className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-darkest mb-6 leading-[1.1]"
            >
              Clean Supplements. <br />
              <span className="text-primary relative inline-block mt-2">
                Real Results.
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originX: 0 }}
                  className="absolute -bottom-2 left-0 w-full h-[3px] bg-secondary/40 rounded-full"
                />
              </span>
            </motion.h1>

            <motion.p
              variants={textChildVariants}
              className="text-lg md:text-xl text-neutral-dark mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              No fillers. No hidden blends. Just scientifically formulated nutrients your body actually uses.
            </motion.p>

            <motion.div variants={textChildVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/shop">
                  <Button size="lg" variant="primary" className="px-10 text-lg group shadow-[0_8px_24px_-6px_rgba(140,171,119,0.5)]">
                    Shop Now
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/pages/science">
                  <Button size="lg" variant="outline" className="px-8 text-lg">
                    The Science
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={textChildVariants}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm font-medium text-neutral-dark/80"
            >
              {["Transparent ingredients", "Clinically effective doses", "Fast delivery"].map((trust) => (
                <span key={trust} className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {trust}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Desktop: vitacore + cellunex — absolutely positioned, section is containing block */}
        <div className="hidden md:block">
          {desktopBottles.map((bottle) => (
            <ProductBottle
              key={`desktop-${bottle.src}`}
              src={bottle.src}
              alt={bottle.alt}
              className={bottle.desktopClassName}
              baseRotate={bottle.baseRotate}
              initialX={bottle.initialX}
              initialY={bottle.initialY}
              delay={bottle.delay}
              floatDelay={bottle.floatDelay}
              hoverTilt={bottle.hoverTilt}
            />
          ))}

          {/* DNA + Zinc cluster — right side, original position */}
          <motion.div
            initial={!reduceMotion ? { opacity: 0, x: -260, y: 120, scale: 0.92 } : false}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 1.35, delay: 0.28, ease: [0.22, 1, 0.36, 1] }
            }
            className="absolute top-[8%] lg:top-[10%] right-[0%] lg:right-[5%] z-10 scale-[1] lg:scale-[1.2]"
            style={{ willChange: "transform, opacity" }}
          >
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
              }
              className="relative"
            >
              <div className="relative inline-block max-w-[min(92vw,420px)]">
                <div className="pointer-events-none opacity-[0.55]">
                  <DNAHelix />
                </div>
                <div className="pointer-events-auto absolute left-1/2 top-[25%] z-10 h-[252px] w-[189px] -translate-x-1/2 -translate-y-1/2 md:h-[315px] md:w-[231px] lg:h-[399px] lg:w-[273px] xl:h-[462px] xl:w-[315px]">
                  <ProductBottle
                    key="desktop-zinc-dna"
                    src={zincBottle.src}
                    alt={zincBottle.alt}
                    className="relative h-full w-full"
                    baseRotate={zincBottle.baseRotate}
                    initialX={zincBottle.initialX}
                    initialY={zincBottle.initialY}
                    delay={zincBottle.delay}
                    floatDelay={zincBottle.floatDelay}
                    hoverTilt={zincBottle.hoverTilt}
                    innerFloat={false}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium text-neutral-dark/50 tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-neutral-dark/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 bg-neutral-dark/30 rounded-full" />
          </motion.div>
        </motion.div>
      </section>
    </AuroraBackground>
  );
}
