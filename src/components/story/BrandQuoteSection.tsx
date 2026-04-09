"use client";

import { motion, useReducedMotion } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

export default function BrandQuoteSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background-alt to-background-main py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: scrollEase }}
          className="mx-auto mb-10 overflow-hidden rounded-[2rem] border border-neutral-light/70 bg-white/60 shadow-sm backdrop-blur-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about banner.png"
            alt="NutriZen Metabol+ supplement bottle"
            className="h-56 w-full object-cover object-center md:h-64"
          />
        </motion.div>

        <motion.blockquote
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.85, delay: reduceMotion ? 0 : 0.08 }}
          className="text-2xl font-semibold leading-snug text-neutral-darkest md:text-3xl md:leading-tight"
        >
          “We didn’t want more supplements. We wanted better ones.”
        </motion.blockquote>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.15 }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-neutral-dark"
        >
          NutriZen is a quiet commitment to craft: fewer compromises, clearer standards, and a
          brand experience that feels as considered as the formulas inside the bottle.
        </motion.p>
      </div>
    </section>
  );
}
