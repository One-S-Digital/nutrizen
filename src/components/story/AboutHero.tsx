"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

const TRUST_CHIPS = [
  "No fillers",
  "Targeted formulas",
  "Bioavailable ingredients",
] as const;

const headline = "Supplements Shouldn't Feel Like a Guessing Game";

export default function AboutHero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const floatY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -48]
  );

  const words = headline.split(" ");

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.055,
        delayChildren: reduceMotion ? 0 : 0.08,
      },
    },
  };

  const wordVar: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background-main pt-8 pb-20 md:pb-28"
    >
      <div className="pointer-events-none absolute -right-24 top-1/4 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[100px]" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-[320px] w-[320px] rounded-full bg-secondary/20 blur-[90px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 lg:order-1"
        >
          <motion.h1
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-4xl font-bold leading-[1.08] tracking-tight text-neutral-darkest md:text-5xl lg:text-[2.85rem]"
          >
            {words.map((w, i) => (
              <motion.span
                key={`${w}-${i}`}
                variants={wordVar}
                className="inline-block pr-[0.28em] pb-1"
              >
                {w}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.35,
              duration: reduceMotion ? 0 : 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-dark md:text-xl"
          >
            For years, finding clean, trustworthy, effective supplements meant decoding labels,
            dodging proprietary blends, and hoping the dose was real. NutriZen exists to make that
            search feel calm, clear, and human again.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.5,
              duration: reduceMotion ? 0 : 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-2xl border border-primary/20 bg-primary px-8 py-4 text-lg font-medium text-white shadow-[0_4px_14px_0_rgba(140,171,119,0.39)] transition-colors duration-300 hover:bg-[#7a9d65] hover:shadow-[0_6px_20px_rgba(140,171,119,0.23)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Shop products
            </Link>
            <Link
              href="/pages/science"
              className="text-sm font-medium text-secondary underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              How we formulate
            </Link>
          </motion.div>

          <div className="mt-10 flex flex-wrap gap-3">
            {TRUST_CHIPS.map((label, i) => (
              <motion.div
                key={label}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: reduceMotion ? 0 : 0.55 + i * 0.08,
                  duration: reduceMotion ? 0 : 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-2xl border border-white/60 bg-white/55 px-4 py-2.5 text-sm font-medium text-neutral-darkest shadow-sm backdrop-blur-md"
              >
                {label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ y: floatY }}
          className="relative order-1 flex min-h-[320px] items-center justify-center lg:order-2 lg:min-h-[440px]"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[min(90vw,420px)] w-[min(90vw,420px)] rounded-full bg-gradient-to-br from-primary/25 via-background-alt to-secondary/25 blur-2xl" />
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[420px]">
            <motion.div
              aria-hidden
              className="absolute -left-4 top-6 h-40 w-40 rounded-full bg-primary/25 blur-3xl md:h-48 md:w-48"
              animate={
                reduceMotion
                  ? undefined
                  : { scale: [1, 1.06, 1], opacity: [0.45, 0.65, 0.45] }
              }
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="absolute -right-2 bottom-10 h-36 w-36 rounded-full bg-secondary/30 blur-3xl md:h-44 md:w-44"
              animate={
                reduceMotion
                  ? undefined
                  : { scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }
              }
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-[1] grid grid-cols-2 gap-4 p-4"
            >
              <motion.div
                className="relative"
                animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/vitacore.png"
                  alt="NutriZen Vitacore bottle"
                  className="mx-auto w-[78%] max-w-[200px] object-contain drop-shadow-2xl"
                />
              </motion.div>
              <motion.div
                className="relative pt-10"
                animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/cellunex.png"
                  alt="NutriZen Cellunex bottle"
                  className="mx-auto w-[78%] max-w-[190px] object-contain drop-shadow-2xl"
                />
              </motion.div>
              <motion.div
                className="relative col-span-2 flex justify-center"
                animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/zinc.png"
                  alt="NutriZen Zinc formula"
                  className="w-[55%] max-w-[220px] object-contain drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
