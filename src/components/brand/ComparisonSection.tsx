"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

export type ComparisonSectionProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  leftTitle?: string;
  rightTitle?: string;
  leftItems: readonly string[];
  rightItems: readonly string[];
};

export default function ComparisonSection({
  eyebrow = "Side by side",
  title,
  subtitle,
  leftTitle = "Typical supplements",
  rightTitle = "NutriZen",
  leftItems,
  rightItems,
}: ComparisonSectionProps) {
  const reduceMotion = useReducedMotion();

  const listParent: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: 0.05 },
    },
  };

  const row: Variants = {
    hidden: reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: scrollEase } },
  };

  const rowRight: Variants = {
    hidden: reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: scrollEase } },
  };

  return (
    <section className="relative overflow-hidden bg-background-main py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: scrollEase }}
        >
          <p className="mb-5 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-secondary">
            <span className="h-px w-7 bg-secondary/40" aria-hidden />
            {eyebrow}
            <span className="h-px w-7 bg-secondary/40" aria-hidden />
          </p>
          <h2 className="font-serif text-3xl leading-[1.08] tracking-[-0.01em] text-ink sm:text-4xl md:text-[2.9rem]">
            {title}
          </h2>
          {subtitle ? <p className="mt-5 text-lg leading-relaxed text-ink/65">{subtitle}</p> : null}
        </motion.div>

        <div className="relative mt-14 grid gap-6 lg:grid-cols-2 lg:gap-12">
          {/* VS badge — sits between the two columns on desktop */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
            aria-hidden
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-primary font-mono text-sm font-semibold tracking-[0.1em] text-white shadow-[0_12px_30px_-10px_rgba(140,171,119,0.8)] ring-[6px] ring-background-main">
              VS
            </span>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={scrollViewport}
            transition={{ duration: reduceMotion ? 0 : 0.75, ease: scrollEase }}
            className="rounded-[2rem] border border-neutral-light bg-neutral-light/30 p-8 md:p-10"
          >
            <h3 className="font-serif text-xl text-ink/55">{leftTitle}</h3>
            <motion.ul
              className="mt-6 space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              variants={listParent}
            >
              {leftItems.map((line) => (
                <motion.li key={line} variants={row} className="flex items-start gap-3 text-ink/55">
                  <span
                    className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-neutral/25 text-ink/45"
                    aria-hidden
                  >
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </span>
                  <span className="line-through decoration-ink/15">{line}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={scrollViewport}
            transition={{ duration: reduceMotion ? 0 : 0.75, ease: scrollEase }}
            className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-br from-primary/12 via-background-white to-secondary/10 p-8 shadow-[0_30px_80px_-32px_rgba(140,171,119,0.5)] md:p-10"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <h3 className="relative font-serif text-xl text-ink">{rightTitle}</h3>
            <motion.ul
              className="relative mt-6 space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              variants={listParent}
            >
              {rightItems.map((line) => (
                <motion.li key={line} variants={rowRight} className="flex items-start gap-3 text-ink">
                  <span
                    className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white"
                    aria-hidden
                  >
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{line}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
