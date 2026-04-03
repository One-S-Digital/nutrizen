"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

const ingredients = [
  { title: "Ashwagandha KSM-66", desc: "Clinically proven to reduce cortisol and manage stress naturally." },
  { title: "Liposomal C", desc: "Highest absorption rate for maximum immune system support." },
  { title: "L-Theanine", desc: "Promotes a calm, relaxed state without causing drowsiness." },
];

export default function IngredientBreakdown() {
  const reduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: 0.06, delayChildren: 0.04 },
    },
  };

  const itemVariants: Variants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.45, ease: scrollEase },
    },
  };

  return (
    <section className="relative overflow-hidden bg-primary py-32 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-80" />

      <motion.div
        className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={containerVariants}
      >
        <motion.div className="mx-auto mb-12 max-w-3xl text-center text-white md:col-span-3 md:mb-20" variants={itemVariants}>
          <span className="mb-4 block text-sm font-bold uppercase tracking-wider text-white/80">
            Precision Nutrition
          </span>
          <h2 className="mb-6 text-3xl font-bold md:text-5xl">Not Just Vitamins. Precision Nutrition.</h2>
          <p className="text-lg text-white/90">
            NutriZen products are developed with carefully selected ingredients, optimized for absorption and
            effectiveness. No artificial fillers. No misleading labels. No wasted money on ineffective supplements.
            <br />
            <br />
            Just clean, targeted formulas that support your health at a deeper level.
          </p>
        </motion.div>

        {ingredients.map((item) => (
          <motion.div
            key={item.title}
            variants={itemVariants}
            className="rounded-[2.5rem] border border-white/25 bg-white/[0.12] p-10 transition-colors duration-200 hover:bg-white/[0.18] [transform:translateZ(0)]"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M10 2v7.31" />
                <path d="M14 9.3V1.99" />
                <path d="M8.5 2h7" />
                <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
                <path d="M5.52 16h12.96" />
              </svg>
            </div>
            <h3 className="mb-4 text-2xl font-bold">{item.title}</h3>
            <p className="leading-relaxed text-white/80">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
