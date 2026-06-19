"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";
import LeafAccent from "@/components/ui/LeafAccent";

const ITEMS = [
  {
    title: "Evidence-informed dosing",
    body: "We aim for meaningful amounts-the kind tied to outcomes in research-so you’re not paying for fairy dust.",
    accent: "#8CAB77",
  },
  {
    title: "Form-first thinking",
    body: "Not all magnesium or zinc is the same. We prioritize forms your body can put to work with less friction.",
    accent: "#6995B1",
  },
  {
    title: "Synergy by design",
    body: "Cofactors and supportive nutrients aren’t filler-they’re chemistry: absorption, transport, and everyday balance.",
    accent: "#A8762E",
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
    <section className="relative overflow-hidden bg-white py-20 md:py-24">
      <LeafAccent
        variant="left"
        opacity={0.42}
        className="-left-24 top-1/2 hidden w-[210px] -translate-y-1/2 sm:block lg:w-[290px]"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: scrollEase }}
        >
          <h2 className="font-serif text-3xl leading-[1.08] tracking-[-0.01em] text-ink sm:text-4xl md:text-[2.9rem]">
            How we translate research into capsules
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/65">
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
          {ITEMS.map((row, i) => (
            <motion.div
              key={row.title}
              variants={item}
              whileHover={
                reduceMotion ? undefined : { y: -8, transition: { duration: 0.35, ease: scrollEase } }
              }
              className="group relative overflow-hidden rounded-[1.8rem] border border-neutral-light/80 bg-background-main p-8 shadow-[0_2px_10px_rgba(47,58,51,0.04)] transition-shadow duration-300 hover:shadow-[0_30px_60px_-30px_rgba(47,58,51,0.35)]"
            >
              <span
                className="absolute left-0 top-0 h-[3px] w-12 rounded-full transition-all duration-500 group-hover:w-full"
                style={{ backgroundColor: row.accent }}
                aria-hidden
              />
              <span
                className="pointer-events-none absolute right-6 top-5 font-serif text-5xl leading-none text-ink/[0.05]"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-xl text-ink md:text-2xl">{row.title}</h3>
              <p className="mt-3 leading-relaxed text-ink/65">{row.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
