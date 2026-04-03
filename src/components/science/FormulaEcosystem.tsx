"use client";

import { motion, useReducedMotion } from "framer-motion";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { formulaEcosystemTimelineData } from "@/data/formula-ecosystem-timeline";
import { scrollEase, scrollViewport } from "@/lib/motion";

export default function FormulaEcosystem() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-background-alt py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={scrollViewport}
            transition={{ duration: reduceMotion ? 0 : 0.85, ease: scrollEase }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Formula ecosystem
            </p>
            <h2 className="mt-3 text-3xl font-bold text-neutral-darkest md:text-4xl">
              Nutrients don’t work in isolation
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-neutral-dark">
              A NutriZen formula is a small ecosystem: minerals in thoughtful forms, cofactors that
              support utilization, and complementary compounds that align with real physiology - not
              a random stack.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-neutral-dark">
              The goal is simple: help your body spend less energy compensating - and more energy
              thriving.
            </p>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-lg overflow-visible"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            viewport={scrollViewport}
            transition={{ duration: reduceMotion ? 0 : 0.85, ease: scrollEase }}
          >
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/15 via-transparent to-secondary/20 blur-2xl" />
            <div className="relative overflow-visible rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-md md:p-6">
              <div className="relative z-10 w-full overflow-visible">
                <RadialOrbitalTimeline
                  embed
                  prefersReducedMotion={!!reduceMotion}
                  timelineData={formulaEcosystemTimelineData}
                />
              </div>
              <p className="relative z-0 mt-4 text-center text-sm text-neutral-dark">
                Tap a node to explore how ingredients connect - uptake, balance, and everyday
                usefulness.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
