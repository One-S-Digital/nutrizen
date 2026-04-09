"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { formulaEcosystemTimelineData } from "@/data/formula-ecosystem-timeline";

export default function StoryAbsorptionTeaser() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-background-main py-20 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-secondary/25 to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
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
              Tap a node to explore how ingredients connect — uptake, balance, and absorption.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease: scrollEase }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Built for absorption
          </p>
          <h2 className="mt-3 text-3xl font-bold text-neutral-darkest md:text-4xl">
            Nutrients matter most when your body can use them
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-neutral-dark">
            Cheap forms and crowded blends can look impressive on a label-and still fall short where
            it counts. We think in systems: minerals, cofactors, and supportive nutrients working
            together, chosen for uptake you can trust.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-neutral-dark">
            It’s advanced formulation, presented calmly-never cold, never clinical.
          </p>
          <Link
            href="/pages/science"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-secondary hover:underline"
          >
            Explore the science
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
