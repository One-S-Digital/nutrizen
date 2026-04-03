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
    <section className="bg-background-main py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: scrollEase }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold text-neutral-darkest md:text-4xl">{title}</h2>
          {subtitle ? (
            <p className="mt-4 text-lg text-neutral-dark">{subtitle}</p>
          ) : null}
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={scrollViewport}
            transition={{ duration: reduceMotion ? 0 : 0.75, ease: scrollEase }}
            className="rounded-[2rem] border border-neutral-light/80 bg-neutral-light/40 p-8 md:p-10"
          >
            <h3 className="text-lg font-semibold text-neutral-dark/90">{leftTitle}</h3>
            <motion.ul
              className="mt-6 space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              variants={listParent}
            >
              {leftItems.map((line) => (
                <motion.li
                  key={line}
                  variants={row}
                  className="flex items-start gap-3 text-neutral-dark"
                >
                  <span
                    className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-neutral/30 text-neutral-darkest/70"
                    aria-hidden
                  >
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </span>
                  <span>{line}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={scrollViewport}
            transition={{ duration: reduceMotion ? 0 : 0.75, ease: scrollEase }}
            className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-br from-primary/12 via-background-white to-secondary/10 p-8 shadow-[0_20px_60px_-24px_rgba(140,171,119,0.45)] md:p-10"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <h3 className="relative text-lg font-semibold text-neutral-darkest">{rightTitle}</h3>
            <motion.ul
              className="relative mt-6 space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              variants={listParent}
            >
              {rightItems.map((line) => (
                <motion.li
                  key={line}
                  variants={rowRight}
                  className="flex items-start gap-3 text-neutral-darkest"
                >
                  <span
                    className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/25 text-primary"
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
