"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

const ITEMS = [
  {
    title: "Evidence-informed dosing",
    body: "We aim for meaningful amounts-the kind tied to outcomes in research-so you’re not paying for fairy dust.",
  },
  {
    title: "Form-first thinking",
    body: "Not all magnesium or zinc is the same. We prioritize forms your body can put to work with less friction.",
  },
  {
    title: "Synergy by design",
    body: "Cofactors and supportive nutrients aren’t filler-they’re chemistry: absorption, transport, and everyday balance.",
  },
] as const;

export default function SciencePrinciples() {
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.11 },
    },
  };

  const item: Variants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: scrollEase },
    },
  };

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: scrollEase }}
        >
          <h2 className="text-3xl font-bold text-neutral-darkest md:text-4xl">
            How we translate research into capsules
          </h2>
          <p className="mt-4 text-lg text-neutral-dark">
            Three principles keep NutriZen formulas disciplined-clear intent, credible inputs, and
            outcomes you can sense over time.
          </p>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          variants={container}
        >
          {ITEMS.map((row) => (
            <motion.div
              key={row.title}
              variants={item}
              className="rounded-[2rem] border border-neutral-light/80 bg-background-main p-8 shadow-sm"
            >
              <div className="mb-5 h-1 w-12 rounded-full bg-gradient-to-r from-primary to-secondary" />
              <h3 className="text-xl font-bold text-neutral-darkest">{row.title}</h3>
              <p className="mt-3 leading-relaxed text-neutral-dark">{row.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
