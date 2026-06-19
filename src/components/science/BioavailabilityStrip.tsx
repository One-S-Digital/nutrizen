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
          <p className="mb-5 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-secondary">
            <span className="h-px w-7 bg-secondary/40" aria-hidden />
            Bioavailability
            <span className="h-px w-7 bg-secondary/40" aria-hidden />
          </p>
          <h2 className="font-serif text-3xl leading-[1.08] tracking-[-0.01em] text-ink sm:text-4xl md:text-[2.9rem]">
            Cheap forms vs. forms your body can use
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/65">
            The same mineral name on two labels can behave very differently inside you. We choose
            forms with absorption and tolerability in mind-so the ingredient list isn’t just
            honest, it’s useful.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: scrollEase }}
            className="rounded-[2rem] border border-neutral-light bg-neutral-light/30 p-8 md:p-10"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-serif text-xl text-ink/55">Common market forms</h3>
              <span className="rounded-full bg-neutral/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50">
                Often harder to use
              </span>
            </div>
            <ul className="mt-6 space-y-4 text-ink/60">
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
            className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-br from-primary/12 to-background-main p-8 shadow-[0_30px_80px_-32px_rgba(140,171,119,0.5)] md:p-10"
          >
            <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
            <div className="relative flex items-center justify-between gap-4">
              <h3 className="font-serif text-xl text-ink">NutriZen approach</h3>
              <span className="rounded-full bg-primary/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink">
                Built for uptake
              </span>
            </div>
            <ul className="relative mt-6 space-y-4 text-ink">
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Prioritized nutrient forms selected for absorption and gentleness
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Intentional dosing-room for what matters, none of what doesn’t
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
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
