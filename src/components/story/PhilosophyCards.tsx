"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

const CARDS = [
  {
    title: "Targeted formulas",
    body: "Not random supplements. Specific blends built for specific needs-so every capsule earns its place.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    tint: "from-primary/15 to-background-main",
    ring: "ring-primary/25",
  },
  {
    title: "True doses",
    body: "No filler-heavy formulas. Only intentional, effective ingredient levels-because half a dose is still a guess.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </svg>
    ),
    tint: "from-secondary/15 to-background-main",
    ring: "ring-secondary/25",
  },
  {
    title: "Better forms",
    body: "Higher-quality mineral and nutrient forms chosen for absorption-so your body spends less effort converting and more time benefiting.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    tint: "from-primary/12 to-secondary/10",
    ring: "ring-primary/20",
  },
] as const;

export default function PhilosophyCards() {
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.12,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
  };

  const card: Variants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.72, ease: scrollEase },
    },
  };

  return (
    <section className="bg-background-alt py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: scrollEase }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            The NutriZen philosophy
          </p>
          <h2 className="mt-3 text-3xl font-bold text-neutral-darkest md:text-4xl">
            Three beliefs that shape every formula
          </h2>
          <p className="mt-4 text-lg text-neutral-dark">
            We translate complex nutrition science into a simple standard you can feel-clarity
            first, performance always.
          </p>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          variants={container}
        >
          {CARDS.map((item) => (
            <motion.div
              key={item.title}
              variants={card}
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -6, transition: { duration: 0.35, ease: scrollEase } }
              }
              className={`group relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${item.tint} p-8 shadow-sm ring-1 ${item.ring} transition-shadow duration-300 hover:shadow-xl`}
            >
              <div className="mb-6 inline-flex rounded-2xl bg-white/70 p-3 text-primary shadow-sm ring-1 ring-white/80 transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-neutral-darkest">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-neutral-dark">{item.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
