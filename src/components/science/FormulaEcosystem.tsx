"use client";

import { motion, useReducedMotion } from "framer-motion";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import CenterCapsule from "@/components/ui/CenterCapsule";
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
            <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
              <span className="h-px w-9 bg-primary/50" aria-hidden />
              Formula ecosystem
            </p>
            <h2 className="font-serif text-3xl leading-[1.08] tracking-[-0.01em] text-ink sm:text-4xl md:text-[2.9rem]">
              Nutrients don’t work in <em className="italic text-primary">isolation</em>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              A NutriZen formula is a small ecosystem: minerals in thoughtful forms, cofactors that
              support utilization, and complementary compounds that align with real physiology - not
              a random stack.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">
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
            <div
              className="pointer-events-none absolute -inset-6 rounded-[2.4rem] bg-[radial-gradient(60%_60%_at_50%_45%,rgba(140,171,119,0.16),transparent_70%)] blur-2xl"
              aria-hidden
            />
            <div className="relative overflow-visible rounded-[2rem] border border-neutral-light bg-[#FAFBF8] p-6 shadow-[0_40px_90px_-50px_rgba(47,58,51,0.45)] md:p-8">
              <div className="relative z-10 w-full overflow-visible">
                <RadialOrbitalTimeline
                  embed
                  prefersReducedMotion={!!reduceMotion}
                  timelineData={formulaEcosystemTimelineData}
                  centerSlot={<CenterCapsule reduceMotion={!!reduceMotion} />}
                />
              </div>
              <p className="relative z-0 mt-2 text-center text-sm text-neutral-dark">
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
