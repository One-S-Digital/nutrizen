"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Target, Droplets, BarChart3 } from "lucide-react";
import { scrollEase, scrollViewport } from "@/lib/motion";

const FORMULA_LOGIC = [
  {
    icon: <Target className="h-5 w-5" strokeWidth={1.6} aria-hidden />,
    title: "Target Need",
    desc: "Stress, sleep, immunity, metabolism, digestion or cellular support",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="9" cy="12" r="6" />
        <circle cx="15" cy="12" r="6" />
      </svg>
    ),
    title: "Nutrient Synergy",
    desc: "Ingredients are selected to work together, not sit randomly in one capsule",
  },
  {
    icon: <Droplets className="h-5 w-5" strokeWidth={1.6} aria-hidden />,
    title: "Absorption-Aware Amounts",
    desc: "Doses are chosen with real-world absorption and usability in mind",
  },
  {
    icon: <BarChart3 className="h-5 w-5" strokeWidth={1.6} aria-hidden />,
    title: "Meaningful Dosage",
    desc: "No tiny label-filler amounts added only to make the formula look complete",
  },
];

const EVIDENCE_CARDS = [
  {
    tag: "SPECIFIC NEEDS",
    title: "Formulas made for a purpose",
    body: "Your body rarely needs one isolated nutrient alone. For proper support, it often needs a combination of vitamins, minerals, amino acids, botanicals or cofactors working together.",
  },
  {
    tag: "ABSORPTION",
    title: "Amounts chosen for real use",
    body: "A nutrient only matters if your body can actually use it. We consider how the average body absorbs and uses each nutrient, then build formulas with practical, relevant amounts instead of decorative doses.",
  },
  {
    tag: "REAL DOSING",
    title: "No insignificant label fillers",
    body: "Some formulas include dozens of ingredients at tiny amounts just to look complete. We avoid that approach. NutriZen uses real doses that serve the formula's purpose, not token quantities added for marketing.",
  },
];

export default function IngredientBreakdown() {
  const reduceMotion = !!useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants: Variants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.65, ease: scrollEase },
    },
  };

  return (
    <section className="relative overflow-hidden bg-[#071209] py-24 md:py-32">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_40%,rgba(140,171,119,0.07),transparent)]" aria-hidden />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-6"
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14 items-start">

          {/* ── Left column ── */}
          <motion.div variants={itemVariants}>
            <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#8CAB77]">
              <span className="h-px w-7 bg-[#8CAB77]/70" aria-hidden />
              The Formula Is the Proof
            </p>

            <h2 className="mb-5 font-serif text-4xl leading-[1.06] tracking-[-0.01em] text-[#F6F3EA] sm:text-5xl md:text-[3.2rem]">
              Formulated for what your
              <br />
              body actually{" "}
              <em className="italic text-[#8CAB77]">needs.</em>
            </h2>

            <p className="mb-10 max-w-[48ch] text-sm leading-relaxed text-[#F6F3EA]/60 md:text-base">
              Most supplements try to impress you with long ingredient lists. We
              take a different approach. Each NutriZen formula is built around a
              specific need, combining the nutrients, minerals and botanicals that
              work together to support that function properly.
            </p>

            {/* Formula Logic card */}
            <div className="relative rounded-2xl bg-[#F6F3EA] px-6 pb-6 pt-7">
              {/* BUILT WITH INTENTION sticker */}
              <div
                className="absolute -top-4 right-7 rotate-[-1.5deg] bg-[#D89455] px-3 py-1.5 shadow-md"
                style={{ borderRadius: "3px" }}
              >
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-[#10201A]">
                  Built with Intention
                </span>
              </div>

              <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[#10201A]/50">
                Formula Logic
              </p>
              <div className="mb-5 h-px bg-[#10201A]/15" />

              <ul className="divide-y divide-[#10201A]/10">
                {FORMULA_LOGIC.map((item) => (
                  <li key={item.title} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                    <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#10201A]/08 text-[#10201A]/70">
                      {item.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-[#10201A]">{item.title}</p>
                      <p className="text-sm leading-relaxed text-[#10201A]/55">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* ── Right column: evidence cards + CTA ── */}
          <div className="flex flex-col gap-4">
            {EVIDENCE_CARDS.map((card, i) => (
              <motion.div
                key={card.tag}
                variants={itemVariants}
                custom={i}
                className="rounded-2xl bg-[#F6F3EA] p-6"
              >
                <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#2F5D5C]">
                  {card.tag}
                </p>
                <h3 className="mb-2 font-serif text-xl text-[#10201A]">{card.title}</h3>
                <p className="text-sm leading-relaxed text-[#10201A]/65">{card.body}</p>
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className="pt-2">
              <Link
                href="/pages/science"
                className="inline-flex items-center gap-2 rounded-full border border-[#F6F3EA]/25 px-6 py-3 text-sm font-semibold text-[#F6F3EA]/75 transition-all duration-200 hover:border-[#F6F3EA]/50 hover:text-[#F6F3EA]"
              >
                Read more about the science
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
