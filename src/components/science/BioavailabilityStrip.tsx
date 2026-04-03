"use client";

import { motion, useReducedMotion } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

export default function BioavailabilityStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: scrollEase }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Bioavailability
          </p>
          <h2 className="mt-3 text-3xl font-bold text-neutral-darkest md:text-4xl">
            Cheap forms vs. forms your body can use
          </h2>
          <p className="mt-4 text-lg text-neutral-dark">
            The same mineral name on two labels can behave very differently inside you. We choose
            forms with absorption and tolerability in mind-so the ingredient list isn’t just
            honest, it’s useful.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: scrollEase }}
            className="rounded-[2rem] border border-neutral-light bg-neutral-light/50 p-8 md:p-10"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-neutral-dark">Common market forms</h3>
              <span className="rounded-full bg-neutral/40 px-3 py-1 text-xs font-semibold text-neutral-darkest/70">
                Often harder to use
              </span>
            </div>
            <ul className="mt-6 space-y-4 text-neutral-dark">
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-neutral" />
                Large, bulky salts that need more breakdown before absorption
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-neutral" />
                High filler load that dilutes what you think you’re taking
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-neutral" />
                “Kitchen-sink” blends with micro-doses of trendy ingredients
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.08 }}
            className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-br from-primary/12 to-background-main p-8 shadow-md md:p-10"
          >
            <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
            <div className="relative flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-neutral-darkest">NutriZen approach</h3>
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-neutral-darkest">
                Built for uptake
              </span>
            </div>
            <ul className="relative mt-6 space-y-4 text-neutral-darkest">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/25 text-primary">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Prioritized nutrient forms selected for absorption and gentleness
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/25 text-primary">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Intentional dosing-room for what matters, none of what doesn’t
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/25 text-primary">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Complementary compounds that support the whole formula’s purpose
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
