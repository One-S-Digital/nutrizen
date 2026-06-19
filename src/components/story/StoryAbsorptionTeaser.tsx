"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { formulaEcosystemTimelineData } from "@/data/formula-ecosystem-timeline";
import CenterCapsule from "@/components/ui/CenterCapsule";

export default function StoryAbsorptionTeaser() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background-main py-20 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <motion.div
          className="relative mx-auto w-full max-w-lg overflow-visible"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease: scrollEase }}
        >
          {/* soft ambient glow behind the card */}
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
          <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-secondary">
            <span className="h-px w-9 bg-secondary/50" aria-hidden />
            Built for absorption
          </p>
          <h2 className="font-serif text-3xl leading-[1.08] tracking-[-0.01em] text-ink sm:text-4xl md:text-[2.9rem]">
            Nutrients matter most when your body can{" "}
            <em className="italic text-primary">use them</em>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/70">
            Cheap forms and crowded blends can look impressive on a label-and still fall short where
            it counts. We think in systems: minerals, cofactors, and supportive nutrients working
            together, chosen for uptake you can trust.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">
            It’s advanced formulation, presented calmly-never cold, never clinical.
          </p>
          <Link
            href="/pages/science"
            className="group mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary transition-colors hover:text-secondary"
          >
            Explore the science
            <span className="block h-px w-7 bg-primary/40 transition-all duration-300 group-hover:w-11 group-hover:bg-secondary" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
