"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

const PILLARS = [
  { icon: "🔬", label: "Bioavailability" },
  { icon: "⚖️", label: "Clinical dosing" },
  { icon: "🔗", label: "Nutrient synergy" },
  { icon: "📋", label: "Transparent labels" },
];

export default function ScienceHero() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const rightY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -50]);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_60%_at_20%_50%,rgba(105,149,177,0.18),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_30%,rgba(140,171,119,0.12),transparent)] pointer-events-none" />

      {/* Decorative rings */}
      <motion.div
        className="absolute top-8 right-[10%] w-64 h-64 rounded-full border border-white/6 pointer-events-none"
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-14 left-[15%] w-48 h-48 rounded-full border border-white/4 pointer-events-none"
        animate={reduceMotion ? {} : { rotate: -360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
      />
      {/* Floating particles */}
      <motion.div
        className="absolute top-1/4 right-[40%] w-2.5 h-2.5 rounded-full bg-secondary/60 pointer-events-none"
        animate={reduceMotion ? {} : { y: [0, -14, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-[25%] w-2 h-2 rounded-full bg-primary/50 pointer-events-none"
        animate={reduceMotion ? {} : { y: [0, 10, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
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
            className="inline-block text-secondary font-bold text-xs uppercase tracking-[0.22em] mb-5"
          >
            The Science
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.06] mb-5 tracking-tight"
          >
            Formulation you can feel —{" "}
            <span className="text-primary">explained without the noise</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-white/65 text-lg mb-8 max-w-lg leading-relaxed"
          >
            NutriZen formulas are built around bioavailability, intentional dosing, and
            complementary nutrients. A calm look at what &ldquo;science-backed&rdquo; means in
            practice — not a lab report, but a clearer standard.
          </motion.p>

          {/* Science pillars */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-10 max-w-sm">
            {PILLARS.map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-xl border border-white/12 bg-white/8 px-3.5 py-2.5 text-sm font-medium text-white/80"
              >
                <span>{icon}</span>
                {label}
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_-4px_rgba(140,171,119,0.45)] hover:bg-primary/90 transition-colors"
              >
                Shop formulas
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
            <Link
              href="/pages/about"
              className="inline-flex items-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all"
            >
              Our Story →
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT: orbiting molecule-style visual */}
        <motion.div
          style={{ y: rightY }}
          className="hidden lg:flex items-center justify-center"
        >
          <div className="relative w-72 h-72">
            {/* Outer orbit ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-white/10"
              animate={reduceMotion ? {} : { rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              {/* Orbiting product dot */}
              <motion.div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <img src="/cellunex.png" alt="" className="w-14 h-14 object-contain drop-shadow-lg" />
              </motion.div>
            </motion.div>

            {/* Inner orbit ring */}
            <motion.div
              className="absolute inset-8 rounded-full border border-white/8"
              animate={reduceMotion ? {} : { rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              <motion.div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <img src="/iron.png" alt="" className="w-10 h-10 object-contain drop-shadow-md opacity-80" />
              </motion.div>
            </motion.div>

            {/* Center glow + main product */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-primary/25 blur-2xl absolute" />
              <motion.div
                animate={reduceMotion ? {} : { y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <img
                  src="/vitacore.png"
                  alt="NutriZen Vitacore"
                  className="w-28 h-28 object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
                />
              </motion.div>
            </div>

            {/* Label chip */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 text-xs font-semibold text-white/80"
            >
              Bioavailability-first formulation
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom stat strip */}
      <div className="relative z-10 border-t border-white/8">
        <div className="max-w-2xl mx-auto px-6 py-6 grid grid-cols-3 gap-4 text-center">
          {[
            { value: "Forms", label: "chosen for absorption" },
            { value: "Doses", label: "aligned with evidence" },
            { value: "Labels", label: "fully transparent" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-base font-bold text-secondary">{value}</p>
              <p className="text-xs text-white/50 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
