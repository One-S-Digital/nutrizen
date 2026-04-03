"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

export default function StoryAbsorptionTeaser() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-background-main py-20 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-secondary/25 to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <motion.div
          className="relative flex min-h-[280px] items-center justify-center"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease: scrollEase }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[280px] w-[280px] rounded-full bg-gradient-to-tr from-primary/20 via-background-alt to-secondary/25 blur-2xl" />
          </div>
          <svg
            viewBox="0 0 400 320"
            className="relative z-[1] w-full max-w-md text-primary/90"
            aria-hidden
          >
            <motion.circle
              cx="200"
              cy="160"
              r="52"
              fill="currentColor"
              fillOpacity="0.12"
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeWidth="1.5"
              animate={reduceMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            {[
              { cx: 90, cy: 90, label: "Magnesium" },
              { cx: 310, cy: 100, label: "Zinc" },
              { cx: 110, cy: 230, label: "Cofactors" },
              { cx: 300, cy: 220, label: "Support nutrients" },
            ].map((n, i) => (
              <g key={n.label}>
                <motion.line
                  x1="200"
                  y1="160"
                  x2={n.cx}
                  y2={n.cy}
                  stroke="currentColor"
                  strokeOpacity="0.22"
                  strokeWidth="1.25"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1 }}
                  viewport={scrollViewport}
                  transition={{ duration: reduceMotion ? 0 : 0.65, delay: 0.1 + i * 0.06 }}
                />
                <circle cx={n.cx} cy={n.cy} r="10" fill="white" className="text-white" />
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r="10"
                  fill="currentColor"
                  fillOpacity="0.18"
                  stroke="currentColor"
                  strokeOpacity="0.35"
                />
              </g>
            ))}
            <text
              x="200"
              y="168"
              textAnchor="middle"
              className="fill-neutral-darkest text-[11px] font-semibold"
            >
              Absorption
            </text>
          </svg>
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
