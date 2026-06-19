"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";
import LeafAccent from "@/components/ui/LeafAccent";

const CARDS = [
  {
    title: "Targeted formulas",
    body: "Not random supplements. Specific blends built for specific needs-so every capsule earns its place.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    accent: "#8CAB77",
  },
  {
    title: "True doses",
    body: "No filler-heavy formulas. Only intentional, effective ingredient levels-because half a dose is still a guess.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </svg>
    ),
    accent: "#6995B1",
  },
  {
    title: "Better forms",
    body: "Higher-quality mineral and nutrient forms chosen for absorption-so your body spends less effort converting and more time benefiting.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    accent: "#A8762E",
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
    <section className="relative overflow-hidden bg-background-alt py-20 md:py-28">
      <LeafAccent
        variant="left"
        opacity={0.5}
        className="-left-24 top-1/2 hidden w-[220px] -translate-y-1/2 sm:block lg:w-[300px]"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: scrollEase }}
        >
          <p className="mb-5 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            <span className="h-px w-7 bg-primary/40" aria-hidden />
            The NutriZen philosophy
            <span className="h-px w-7 bg-primary/40" aria-hidden />
          </p>
          <h2 className="font-serif text-3xl leading-[1.08] tracking-[-0.01em] text-ink sm:text-4xl md:text-[2.9rem]">
            Three beliefs that shape every formula
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/65">
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
          {CARDS.map((item, i) => (
            <motion.div
              key={item.title}
              variants={card}
              whileHover={
                reduceMotion ? undefined : { y: -8, transition: { duration: 0.35, ease: scrollEase } }
              }
              className="group relative overflow-hidden rounded-[1.8rem] border border-neutral-light/80 bg-white p-8 shadow-[0_2px_10px_rgba(47,58,51,0.04)] transition-shadow duration-300 hover:shadow-[0_30px_60px_-30px_rgba(47,58,51,0.35)]"
            >
              {/* top accent line, grows on hover */}
              <span
                className="absolute left-0 top-0 h-[3px] w-12 rounded-full transition-all duration-500 group-hover:w-full"
                style={{ backgroundColor: item.accent }}
                aria-hidden
              />
              {/* faint index watermark */}
              <span
                className="pointer-events-none absolute right-6 top-5 font-serif text-5xl leading-none text-ink/[0.05]"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div
                className="mb-7 inline-flex rounded-2xl p-3.5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  color: item.accent,
                  backgroundColor: `${item.accent}14`,
                  boxShadow: `inset 0 0 0 1px ${item.accent}33`,
                }}
              >
                {item.icon}
              </div>
              <h3 className="font-serif text-xl text-ink md:text-2xl">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-ink/65">{item.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
