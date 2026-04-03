"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function ScienceHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background-main pt-10 pb-16 md:pb-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-secondary/15 blur-[100px]" />
      <div className="pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-primary/15 blur-[80px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              The science
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-neutral-darkest md:text-5xl lg:text-[2.75rem]">
              Formulation you can feel-explained without the noise
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-dark">
              NutriZen formulas are built around bioavailability, intentional dosing, and
              complementary nutrients. This page is a calm look at what “science-backed” means in
              practice-not a lab report, but a clearer standard.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-2xl border border-primary/20 bg-primary px-8 py-4 text-base font-medium text-white shadow-[0_4px_14px_0_rgba(140,171,119,0.39)] transition-colors duration-300 hover:bg-[#7a9d65] hover:shadow-[0_6px_20px_rgba(140,171,119,0.23)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Shop formulas
              </Link>
              <Link
                href="/pages/about"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-primary bg-transparent px-8 py-4 text-base font-medium text-primary transition-colors duration-300 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Read our story
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : 0.12 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md rounded-[2rem] border border-white/60 bg-white/50 p-8 shadow-sm backdrop-blur-md">
              <div className="grid grid-cols-2 gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/cellunex.png"
                  alt="NutriZen formulation"
                  className="mx-auto h-36 object-contain drop-shadow-lg"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/iron.png"
                  alt="Mineral support"
                  className="mx-auto h-36 object-contain drop-shadow-lg"
                />
              </div>
              <p className="mt-6 text-center text-sm leading-relaxed text-neutral-dark">
                Quality nutrient forms, transparent blends, and doses chosen for real-world use-not
                label dressing.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
