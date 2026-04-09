"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

const TRUST_CHIPS = [
  { label: "No fillers", icon: "✦" },
  { label: "Targeted formulas", icon: "🎯" },
  { label: "Bioavailable ingredients", icon: "⚡" },
] as const;

const STATS = [
  { value: "100%", label: "Transparent labels" },
  { value: "0", label: "Proprietary blends" },
  { value: "30-day", label: "Guarantee" },
];

export default function AboutHero() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const productsY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -60]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-[#2F3A33] text-white"
      style={{ minHeight: "58vh" }}
    >
      {/* Background layers */}
      <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_25%_50%,rgba(140,171,119,0.2),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_30%,rgba(105,149,177,0.14),transparent)]" />
      </motion.div>

      {/* Decorative rings */}
      <motion.div
        className="absolute top-6 right-[8%] w-72 h-72 rounded-full border border-white/6 pointer-events-none"
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-16 left-[10%] w-52 h-52 rounded-full border border-white/4 pointer-events-none"
        animate={reduceMotion ? {} : { rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />
      {/* Floating accent dot */}
      <motion.div
        className="absolute top-1/3 right-[38%] w-3 h-3 rounded-full bg-primary/60 pointer-events-none"
        animate={reduceMotion ? {} : { y: [0, -12, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 left-[30%] w-2 h-2 rounded-full bg-secondary/50 pointer-events-none"
        animate={reduceMotion ? {} : { y: [0, 10, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* LEFT: copy */}
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block text-primary font-bold text-xs uppercase tracking-[0.22em] mb-5"
          >
            Our Story
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.06] mb-5 tracking-tight"
          >
            Supplements Shouldn&apos;t Feel Like a{" "}
            <span className="text-primary">Guessing Game</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-white/65 text-lg mb-8 max-w-lg leading-relaxed"
          >
            For years, finding clean, trustworthy, effective supplements meant decoding labels,
            dodging proprietary blends, and hoping the dose was real. NutriZen exists to make
            that search feel calm, clear, and human again.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-10">
            {TRUST_CHIPS.map(({ label, icon }) => (
              <span
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white/85"
              >
                <span className="text-xs">{icon}</span>
                {label}
              </span>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_-4px_rgba(140,171,119,0.45)] hover:bg-primary/90 transition-colors"
              >
                Shop products
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
            <Link
              href="/pages/science"
              className="inline-flex items-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all"
            >
              How we formulate →
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT: floating product cluster */}
        <motion.div
          variants={itemVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          className="hidden lg:flex items-center justify-center"
        >
          <motion.div style={{ y: productsY }} className="relative w-80 h-80">
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-60 h-60 rounded-full bg-primary/20 blur-3xl" />
            </div>

            {/* Vitacore — top left, floating */}
            <motion.div
              className="absolute top-0 left-4 z-20"
              animate={reduceMotion ? {} : { y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src="/vitacore.png"
                alt="Vitacore B-Complex"
                className="w-44 h-44 object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
              />
            </motion.div>

            {/* Cellunex — bottom right, counter-float */}
            <motion.div
              className="absolute bottom-0 right-0 z-10"
              animate={reduceMotion ? {} : { y: [0, 10, 0] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            >
              <img
                src="/cellunex.png"
                alt="Cellunex Insulin Support"
                className="w-36 h-36 object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.4)] opacity-90"
              />
            </motion.div>

            {/* Zinc — mid-right, slow float */}
            <motion.div
              className="absolute bottom-12 left-0 z-10"
              animate={reduceMotion ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            >
              <img
                src="/zinc.png"
                alt="Zinc + Copper & Selenium"
                className="w-28 h-28 object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] opacity-80"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats strip */}
      <div className="relative z-10 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-xl font-bold text-primary">{value}</p>
              <p className="text-xs text-white/50 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
