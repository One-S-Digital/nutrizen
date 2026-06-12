"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

const ingredients = [
  {
    index: "01",
    title: "Ashwagandha KSM-66",
    desc: "Clinically studied root extract shown to reduce cortisol and manage stress naturally.",
    tag: "Stress & mood",
    hue: "#5B5E80",
  },
  {
    index: "02",
    title: "Liposomal C",
    desc: "Vitamin C wrapped for absorption — more of every dose reaches your immune system.",
    tag: "Immunity",
    hue: "#42634C",
  },
  {
    index: "03",
    title: "L-Theanine",
    desc: "Promotes a calm, focused state without drowsiness. The quiet half of clear energy.",
    tag: "Calm focus",
    hue: "#2F5D5C",
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
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.65, ease: scrollEase },
    },
  };

  return (
    <section className="relative overflow-hidden bg-paper-warm py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12 grid grid-cols-1 items-end gap-6 md:mb-16 md:grid-cols-[1fr_auto]"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: 0.85, ease: scrollEase }}
        >
          <div>
            <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-goal-cellular">
              <span className="h-px w-9 bg-goal-cellular/50" aria-hidden />
              05 · Inside the formulas
            </p>
            <h2 className="font-serif text-4xl leading-[1.06] tracking-[-0.01em] text-ink sm:text-5xl md:text-[3.4rem]">
              Not just vitamins.
              <br />
              <em className="italic">Precision nutrition.</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink/60 md:pb-2 md:text-right">
            Ingredients chosen for evidence and absorption — never to pad a
            label. A few worth knowing by name:
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          variants={containerVariants}
        >
          {ingredients.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -5, transition: { duration: 0.3, ease: scrollEase } }
              }
              className="group relative rounded-2xl border border-ink/10 bg-paper-white p-8 shadow-[0_10px_30px_-18px_rgba(16,32,26,0.25)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.25em] text-ink/40">
                  {item.index}
                </span>
                <span
                  className="h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-125"
                  style={{ backgroundColor: item.hue }}
                  aria-hidden
                />
              </div>
              <h3 className="mt-6 font-serif text-2xl text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
                {item.desc}
              </p>
              <p
                className="mt-7 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: item.hue }}
              >
                <span
                  className="block h-px w-7 transition-all duration-300 group-hover:w-11"
                  style={{ backgroundColor: `${item.hue}66` }}
                  aria-hidden
                />
                {item.tag}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
