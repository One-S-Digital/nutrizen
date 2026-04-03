"use client";

import { motion, useReducedMotion } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

export default function StoryProblemSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -36, scale: 0.98 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease: scrollEase }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-secondary/15 blur-xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-neutral-light/80 bg-background-main shadow-sm">
            <div className="grid grid-cols-2 gap-3 p-6 md:p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/iron.png"
                alt="Supplement bottle on a calm surface"
                className="h-40 w-full rounded-2xl object-contain md:h-48"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/glutathione.png"
                alt="Clean supplement formulation"
                className="h-40 w-full rounded-2xl object-contain md:h-48"
              />
            </div>
            <div className="border-t border-neutral-light/60 bg-background-alt/80 px-6 py-5 text-center md:px-10">
              <p className="text-sm font-medium italic leading-relaxed text-neutral-dark">
                “We created the supplements we wished were easier to find.”
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 36 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease: scrollEase }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Why we started
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-neutral-darkest md:text-4xl">
            Wellness shouldn’t mean compromise
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-neutral-dark">
            Most people want the same things: clarity, consistency, and formulas that respect the
            body. Yet the supplement aisle often feels noisy-marketing claims without context,
            mystery blends, and doses that look good on a label but do little in real life.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-neutral-dark">
            NutriZen began with a simple frustration turned into a promise: build supplements we’d
            confidently take ourselves-transparent, intentional, and designed around how nutrients
            actually behave in the body.
          </p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ delay: reduceMotion ? 0 : 0.12, duration: reduceMotion ? 0 : 0.65 }}
            className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5 md:px-8"
          >
            <p className="text-base font-medium text-neutral-darkest">
              We didn’t want louder packaging-we wanted quieter confidence: labels you can read,
              doses you can trust, and support that meets you where your health goals actually are.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
