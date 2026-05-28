"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { BadgeCheck, Droplets, FlaskConical } from "lucide-react";
import Link from "next/link";
import { scrollEase, scrollViewport } from "@/lib/motion";

// ─── Background science decorations ──────────────────────────────────────────

function AtomSVG() {
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none" aria-hidden>
      <defs>
        <filter id="aglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g filter="url(#aglow)">
        <circle cx="120" cy="120" r="12" fill="#8CAB77" opacity="0.9" />
        <circle cx="120" cy="120" r="7" fill="#d4f0a8" opacity="0.95" />
        <ellipse cx="120" cy="120" rx="105" ry="32" stroke="#8CAB77" strokeWidth="1.2" opacity="0.75" />
        <ellipse cx="120" cy="120" rx="105" ry="32" stroke="#8CAB77" strokeWidth="1.2" opacity="0.55" transform="rotate(60 120 120)" />
        <ellipse cx="120" cy="120" rx="105" ry="32" stroke="#8CAB77" strokeWidth="1.2" opacity="0.55" transform="rotate(120 120 120)" />
        {/* Electrons */}
        <circle cx="225" cy="120" r="5.5" fill="#6995B1" opacity="0.95" />
        <circle cx="67" cy="211" r="5.5" fill="#6995B1" opacity="0.90" />
        <circle cx="67" cy="29" r="5.5" fill="#8CAB77" opacity="0.90" />
      </g>
    </svg>
  );
}

function MoleculeFormulaSVG() {
  const r = 36; const cx = 85; const cy = 95;
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
  return (
    <svg width="200" height="220" viewBox="0 0 200 220" fill="none" aria-hidden>
      <defs>
        <filter id="mglow" x="-40%" y="-20%" width="180%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g filter="url(#mglow)" stroke="#8CAB77" strokeWidth="1.4">
        {hex.map((v, i) => {
          const n = hex[(i + 1) % 6];
          return <line key={i} x1={v.x} y1={v.y} x2={n.x} y2={n.y} opacity="0.75" />;
        })}
        {[0, 2, 4].map(i => {
          const v = hex[i]; const n = hex[(i + 1) % 6];
          const dx = n.x - v.x; const dy = n.y - v.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const nx = (-dy / len) * 5; const ny = (dx / len) * 5;
          return <line key={i} x1={v.x + nx} y1={v.y + ny} x2={n.x + nx} y2={n.y + ny} opacity="0.40" />;
        })}
        <line x1={hex[0].x} y1={hex[0].y} x2={hex[0].x} y2={hex[0].y - 28} opacity="0.65" />
        <text x={hex[0].x - 10} y={hex[0].y - 34} fill="#a8d080" fontSize="13" fontFamily="monospace" stroke="none" opacity="0.85">HO</text>
        <line x1={hex[1].x} y1={hex[1].y} x2={hex[1].x + 28} y2={hex[1].y} opacity="0.65" />
        <text x={hex[1].x + 30} y={hex[1].y + 5} fill="#a8d080" fontSize="13" fontFamily="monospace" stroke="none" opacity="0.85">NH₂</text>
        <line x1={hex[2].x} y1={hex[2].y} x2={hex[2].x + 24} y2={hex[2].y + 18} opacity="0.65" />
        <text x={hex[2].x + 26} y={hex[2].y + 22} fill="#a8d080" fontSize="13" fontFamily="monospace" stroke="none" opacity="0.85">NO₂</text>
        {hex.map((v, i) => <circle key={i} cx={v.x} cy={v.y} r="2.8" fill="#8CAB77" stroke="none" opacity="0.75" />)}
      </g>
    </svg>
  );
}

function FlaskSVG() {
  return (
    <svg width="130" height="170" viewBox="0 0 130 170" fill="none" aria-hidden>
      <defs>
        <filter id="fglow" x="-50%" y="-20%" width="200%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g filter="url(#fglow)" stroke="#8CAB77" strokeWidth="1.5">
        <line x1="48" y1="8" x2="48" y2="62" opacity="0.75" />
        <line x1="82" y1="8" x2="82" y2="62" opacity="0.75" />
        <line x1="42" y1="8" x2="88" y2="8" opacity="0.75" />
        <line x1="48" y1="62" x2="8" y2="150" opacity="0.75" />
        <line x1="82" y1="62" x2="122" y2="150" opacity="0.75" />
        <line x1="8" y1="150" x2="122" y2="150" opacity="0.75" />
        <path d="M14 118 Q65 108 116 118" stroke="#6995B1" strokeWidth="1.2" fill="none" opacity="0.5" />
        <circle cx="30" cy="132" r="3.5" fill="#8CAB77" stroke="none" opacity="0.65" />
        <circle cx="65" cy="138" r="2.5" fill="#8CAB77" stroke="none" opacity="0.55" />
        <circle cx="95" cy="130" r="3" fill="#8CAB77" stroke="none" opacity="0.60" />
        <line x1="12" y1="108" x2="24" y2="108" opacity="0.40" />
        <line x1="10" y1="126" x2="22" y2="126" opacity="0.40" />
        <line x1="9" y1="140" x2="21" y2="140" opacity="0.40" />
      </g>
    </svg>
  );
}

function DataBarsSVG() {
  const bars = [0.4, 0.75, 0.55, 0.9, 0.65, 0.5, 0.8];
  return (
    <svg width="80" height="120" viewBox="0 0 80 120" fill="none" aria-hidden>
      <defs>
        <filter id="bglow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g filter="url(#bglow)">
        {bars.map((h, i) => (
          <rect
            key={i}
            x={i * 11 + 2} y={120 - h * 100}
            width={8} height={h * 100}
            fill="#8CAB77" rx={2}
            opacity={0.5 + h * 0.25}
          />
        ))}
        <line x1="0" y1="120" x2="80" y2="120" stroke="#8CAB77" strokeWidth="0.8" opacity="0.5" />
      </g>
    </svg>
  );
}

// Small scattered particle dots
function ParticleDots() {
  const dots = [
    [12, 18], [45, 8], [180, 22], [320, 12], [460, 28], [580, 8], [720, 18],
    [90, 48], [230, 38], [380, 52], [510, 42], [650, 35],
  ] as [number, number][];
  const lines: [number, number, number, number][] = [
    [12, 18, 45, 8], [180, 22, 230, 38], [380, 52, 460, 28], [580, 8, 650, 35],
  ];
  return (
    <svg width="760" height="60" viewBox="0 0 760 60" fill="none" aria-hidden>
      {lines.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.5" opacity="0.2" />
      ))}
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2 : 1.5} fill="white" opacity={i % 2 === 0 ? 0.35 : 0.2} />
      ))}
    </svg>
  );
}

// ─── Section data ─────────────────────────────────────────────────────────────

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

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProblemSolution() {
  const rm = !!useReducedMotion();

  const cardContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: rm ? 0 : 0.13, delayChildren: rm ? 0 : 0.06 } },
  };
  const cardVariants: Variants = {
    hidden: rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: scrollEase } },
  };

  return (
    <section className="relative overflow-hidden bg-[#1A2C1E]">

      {/* ── Background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>

        {/* Atmospheric glow orbs */}
        <div className="absolute -top-60 -left-20 h-[700px] w-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(140,171,119,0.18),transparent_65%)]" />
        <div className="absolute top-1/3 left-1/3 h-[900px] w-[900px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(140,171,119,0.06),transparent_60%)]" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(105,149,177,0.10),transparent_65%)]" />

        {/* Particle dots — top strip */}
        <div className="absolute top-8 left-0 right-0 flex justify-center opacity-60">
          <ParticleDots />
        </div>
        {/* Particle dots — middle */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-center opacity-40 -translate-y-1/2">
          <ParticleDots />
        </div>

        {/* Atom — top right */}
        <div className="absolute top-10 right-10 md:right-24 opacity-[0.18]">
          <AtomSVG />
        </div>

        {/* Molecular formula — bottom left (inset from helix) */}
        <div className="absolute bottom-24 left-20 md:left-32 opacity-[0.16]">
          <MoleculeFormulaSVG />
        </div>

        {/* Flask — bottom right */}
        <div className="absolute bottom-10 right-6 md:right-20 opacity-[0.15]">
          <FlaskSVG />
        </div>

        {/* Data bars — right middle */}
        <div className="absolute top-1/2 right-12 md:right-28 -translate-y-1/2 opacity-[0.18]">
          <DataBarsSVG />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* THE PROBLEM */}
        <motion.div
          className="pt-28 pb-16 text-center max-w-3xl mx-auto"
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
            <span className="font-semibold text-white/85">&ldquo;proprietary blends&rdquo;</span> that hide the truth.
          </p>
        </motion.div>

        {/* DIVIDER */}
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

        {/* SOLUTION CARDS */}
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
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                style={{ background: `radial-gradient(ellipse at 50% -10%, ${item.hoverGlow} 0%, transparent 65%)` }}
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

        {/* CTA */}
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
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
