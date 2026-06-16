"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { ContourField, GrainOverlay } from "@/components/ui/Texture";
import { scrollEase, scrollViewport } from "@/lib/motion";

const PILLARS = [
  {
    index: "01",
    title: "Transparent formulas",
    text: "Every active ingredient named, every dose stated. No proprietary blends, no asterisks doing heavy lifting.",
  },
  {
    index: "02",
    title: "Clinically effective doses",
    text: "Formulated to the amounts used in research — not the amounts that look good on a label.",
  },
  {
    index: "03",
    title: "Forms your body absorbs",
    text: "Chelated minerals and bioavailable forms, because a nutrient you can't absorb is money you can't keep.",
  },
];

// Illustrative comparison — swap in real label data when content is finalized.
const INDUSTRY_ROWS = [
  { name: "Proprietary Energy Blend†", amount: "850 mg", hidden: false },
  { name: "— caffeine matrix", amount: "?? mg", hidden: true },
  { name: "— taurine, guarana extract", amount: "?? mg", hidden: true },
  { name: "— niacin (form unstated)", amount: "?? mg", hidden: true },
];

const NUTRIZEN_ROWS = [
  { name: "Every active ingredient", value: "named in full" },
  { name: "Every dose", value: "stated in mg" },
  { name: "Every nutrient form", value: "disclosed" },
  { name: "Fillers & colourants", value: "none — ever" },
];

export default function ProblemSolution() {
  const rm = !!useReducedMotion();

  const cardContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: rm ? 0 : 0.16, delayChildren: rm ? 0 : 0.08 } },
  };
  const cardVariants: Variants = {
    hidden: rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: scrollEase } },
  };
  const pillarVariants: Variants = {
    hidden: rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: scrollEase } },
  };

  return (
    <section className="relative overflow-hidden bg-ink">
      <div
        className="absolute inset-0 bg-[radial-gradient(110%_80%_at_50%_0%,#1A2C1E_0%,#10201A_55%,#0A1510_100%)]"
        aria-hidden
      />
      <ContourField className="absolute inset-0 h-full w-full text-primary opacity-[0.05]" />
      <GrainOverlay className="opacity-[0.05]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          className="mx-auto max-w-3xl pt-24 text-center md:pt-32"
          initial={rm ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.85, ease: scrollEase }}
        >
          <p className="mb-6 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            <span className="h-px w-9 bg-primary/50" aria-hidden />
            03 · The evidence
            <span className="h-px w-9 bg-primary/50" aria-hidden />
          </p>
          <h2 className="font-serif text-4xl leading-[1.06] tracking-[-0.01em] text-paper sm:text-5xl md:text-[3.4rem]">
            Tired of guessing what&rsquo;s
            <br className="hidden md:block" /> really in your supplements?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
            Most labels are written to hide. Ours are written to be read.
            Don&rsquo;t take the claim — compare the labels.
          </p>
        </motion.div>

        {/* Label comparison */}
        <motion.div
          className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:mt-20 md:grid-cols-2 md:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          variants={cardContainerVariants}
        >
          {/* The industry label */}
          <motion.div
            variants={cardVariants}
            whileHover={rm ? undefined : { rotate: 0, scale: 1.015 }}
            transition={{ duration: 0.4, ease: scrollEase }}
            className="relative rotate-[-1.3deg] rounded-2xl bg-[#F3EFE2] p-7 text-ink shadow-[0_28px_60px_-20px_rgba(0,0,0,0.55)] md:p-8"
          >
            <span
              className="absolute right-5 top-5 rotate-[-7deg] rounded-sm border-2 border-[#A14F42]/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#A14F42]"
              aria-hidden
            >
              Undisclosed
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/45">
              What they show you
            </p>
            <h3 className="mt-3 border-b-[3px] border-ink pb-2 font-serif text-2xl text-ink">
              Supplement Facts
            </h3>
            <ul className="mt-1">
              {INDUSTRY_ROWS.map((row) => (
                <li
                  key={row.name}
                  className={`flex items-baseline justify-between gap-4 border-b border-ink/15 py-2.5 text-sm ${
                    row.hidden ? "pl-3 text-ink/50 italic" : "font-medium"
                  }`}
                >
                  <span>{row.name}</span>
                  <span
                    className={`whitespace-nowrap font-mono text-xs ${
                      row.hidden ? "select-none blur-[3px]" : ""
                    }`}
                    aria-hidden={row.hidden}
                  >
                    {row.amount}
                  </span>
                </li>
              ))}
              <li className="border-b border-ink/15 py-2.5 text-xs italic leading-relaxed text-ink/55">
                Other ingredients: maltodextrin, titanium dioxide, talc,
                shellac, artificial colourants…
              </li>
            </ul>
            <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.06em] text-[#A14F42]">
              † individual amounts not disclosed. Hover all you like — they
              won&rsquo;t tell you.
            </p>
          </motion.div>

          {/* The NutriZen label */}
          <motion.div
            variants={cardVariants}
            whileHover={rm ? undefined : { rotate: 0, scale: 1.015 }}
            transition={{ duration: 0.4, ease: scrollEase }}
            className="relative rotate-[1deg] rounded-2xl bg-paper-white p-7 text-ink shadow-[0_28px_60px_-20px_rgba(0,0,0,0.55)] md:p-8"
          >
            <span
              className="absolute right-5 top-5 rotate-[6deg] rounded-sm border-2 border-primary px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#5F7F4D]"
              aria-hidden
            >
              Disclosed
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/45">
              What we show you
            </p>
            <h3 className="mt-3 border-b-[3px] border-ink pb-2 font-serif text-2xl text-ink">
              Supplement Facts
            </h3>
            <ul className="mt-1">
              {NUTRIZEN_ROWS.map((row) => (
                <li
                  key={row.name}
                  className="group flex items-baseline justify-between gap-4 border-b border-ink/15 py-2.5 text-sm transition-colors duration-200 hover:bg-primary/5"
                >
                  <span className="font-medium">{row.name}</span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap font-mono text-xs text-[#5F7F4D]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {row.value}
                  </span>
                </li>
              ))}
              <li className="py-2.5 text-xs italic leading-relaxed text-ink/55">
                Other ingredients: none worth hiding.
              </li>
            </ul>
            <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.06em] text-[#5F7F4D]">
              ✓ the full facts panel is on every product page
            </p>
          </motion.div>
        </motion.div>

        {/* Pillars */}
        <motion.div
          className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-10 border-t border-white/10 pt-14 md:mt-24 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: rm ? 0 : 0.12 } },
          }}
        >
          {PILLARS.map((pillar) => (
            <motion.div key={pillar.index} variants={pillarVariants}>
              <p className="font-mono text-[11px] tracking-[0.25em] text-primary/80">
                {pillar.index}
              </p>
              <h3 className="mt-3 font-serif text-xl text-paper">{pillar.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/50">{pillar.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="pb-24 pt-16 text-center md:pb-32"
          initial={rm ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.75, ease: scrollEase, delay: 0.05 }}
        >
          <Link
            href="/pages/science"
            className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-8 py-3.5 text-sm font-medium text-white/75 transition-all duration-300 hover:border-white/35 hover:bg-white/[0.05] hover:text-white"
          >
            Read the science behind every formula
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
              className="transition-transform duration-300 group-hover:translate-x-1"
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
