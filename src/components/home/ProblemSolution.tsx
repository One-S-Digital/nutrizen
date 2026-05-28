"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion, useInView, type Variants } from "framer-motion";
import { BadgeCheck, Droplets, FlaskConical } from "lucide-react";
import Link from "next/link";
import { scrollEase, scrollViewport } from "@/lib/motion";

function CountStat({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion === true || value === 0) {
      setCount(value);
      return;
    }
    const start = performance.now();
    const duration = 1300;
    let frameId: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * value));
      if (t < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [inView, value, reduceMotion]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-extrabold text-white tabular-nums tracking-tight mb-2">
        {count}
        {suffix}
      </p>
      <p className="text-white/50 text-sm font-medium">{label}</p>
    </div>
  );
}

const PROBLEMS = [
  "Fillers & binders that add zero nutritional value",
  "Proprietary blends that hide exact ingredient amounts",
  "Underdosed actives that never reach effective levels",
];

const PILLARS = [
  {
    title: "Transparent Formulas",
    text: "No hidden ingredients. No unnecessary additives. You know exactly what you're putting into your body.",
    iconBg: "bg-[#8CAB77]/20 text-[#8CAB77]",
    hoverGlow: "rgba(140,171,119,0.10)",
    icon: <FlaskConical className="h-7 w-7" strokeWidth={1.75} aria-hidden />,
  },
  {
    title: "Clinically Effective Doses",
    text: "Formulated with nutrition science — not marketing hype. Precision dosages that drive actual results.",
    iconBg: "bg-[#6995B1]/20 text-[#6995B1]",
    hoverGlow: "rgba(105,149,177,0.10)",
    icon: <BadgeCheck className="h-7 w-7" strokeWidth={1.75} aria-hidden />,
  },
  {
    title: "Clean & Bioavailable",
    text: "Your body absorbs what it actually needs. Real targeted nutrients directly where your cells need them.",
    iconBg: "bg-[#8CAB77]/20 text-[#8CAB77]",
    hoverGlow: "rgba(140,171,119,0.10)",
    icon: <Droplets className="h-7 w-7" strokeWidth={1.75} aria-hidden />,
  },
];

const STATS = [
  { value: 100, suffix: "%", label: "Transparent Formulas" },
  { value: 0, suffix: "g", label: "Hidden Additives" },
  { value: 30, suffix: "-Day", label: "Money-Back Guarantee" },
];

export default function ProblemSolution() {
  const rm = !!useReducedMotion();

  const problemListVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: rm ? 0 : 0.1, delayChildren: rm ? 0 : 0.05 },
    },
  };

  const problemItemVariants: Variants = {
    hidden: rm ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: scrollEase } },
  };

  const cardContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: rm ? 0 : 0.13, delayChildren: rm ? 0 : 0.06 },
    },
  };

  const cardVariants: Variants = {
    hidden: rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: scrollEase } },
  };

  return (
    <section className="relative overflow-hidden bg-[#1C2E21]">
      {/* Background glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -left-40 h-[640px] w-[640px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(140,171,119,0.13),transparent_68%)]" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(105,149,177,0.08),transparent_68%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(140,171,119,0.04),transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ─── THE PROBLEM ─── */}
        <motion.div
          className="pt-28 pb-12 text-center max-w-3xl mx-auto"
          initial={rm ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.85, ease: scrollEase }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/8 text-white/50 text-xs font-bold uppercase tracking-[0.18em] mb-6 border border-white/10">
            The Problem
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Tired of guessing what&rsquo;s really
            <br className="hidden md:block" /> in your supplements?
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Most supplements are packed with fillers, underdosed ingredients, or{" "}
            <span className="font-semibold text-white/80">&ldquo;proprietary blends&rdquo;</span> that hide the truth.
          </p>
        </motion.div>

        {/* Problem bullets */}
        <motion.ul
          className="max-w-lg mx-auto space-y-3 pb-16"
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          variants={problemListVariants}
          aria-label="Common supplement problems"
        >
          {PROBLEMS.map((p) => (
            <motion.li
              key={p}
              variants={problemItemVariants}
              className="flex items-center gap-3.5 bg-white/[0.04] rounded-2xl px-5 py-3.5 border border-white/[0.07]"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
                  <line x1="2" y1="2" x2="7" y2="7" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                  <line x1="7" y1="2" x2="2" y2="7" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-white/65 text-sm">{p}</span>
            </motion.li>
          ))}
        </motion.ul>

        {/* ─── DIVIDER ─── */}
        <motion.div
          className="flex items-center gap-5 max-w-2xl mx-auto pb-16"
          initial={rm ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={scrollViewport}
          transition={{ duration: 1, ease: scrollEase }}
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-white/15" />
          <span className="flex-shrink-0 px-5 py-2 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-widest whitespace-nowrap border border-primary/25">
            The NutriZen Difference
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/15 to-white/15" />
        </motion.div>

        {/* ─── SOLUTION CARDS ─── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-20"
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          variants={cardContainerVariants}
        >
          {PILLARS.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              className="group relative rounded-3xl p-8 border border-white/10 bg-white/[0.045] overflow-hidden transition-all duration-300 hover:border-white/18 hover:bg-white/[0.07]"
              style={{ boxShadow: "0 4px 28px -4px rgba(0,0,0,0.35)" }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                style={{
                  background: `radial-gradient(ellipse at 50% -10%, ${item.hoverGlow} 0%, transparent 65%)`,
                }}
                aria-hidden
              />

              <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${item.iconBg}`}>
                {item.icon}
              </div>
              <h3 className="relative z-10 text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="relative z-10 text-white/55 leading-relaxed text-sm">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── STATS ROW ─── */}
        <motion.div
          className="grid grid-cols-3 gap-6 max-w-xl mx-auto pb-14"
          initial={rm ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.8, ease: scrollEase }}
        >
          {STATS.map((s) => (
            <CountStat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </motion.div>

        {/* Divider line */}
        <div className="max-w-xs mx-auto h-px bg-white/10 mb-12" aria-hidden />

        {/* ─── CTA ─── */}
        <motion.div
          className="text-center pb-28"
          initial={rm ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.75, ease: scrollEase, delay: 0.05 }}
        >
          <Link
            href="/pages/science"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 text-white/75 hover:text-white hover:border-white/35 hover:bg-white/[0.06] text-sm font-semibold transition-all duration-200"
          >
            See what&rsquo;s inside every formula
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
