"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ContourField, GrainOverlay } from "@/components/ui/Texture";
import { scrollEase, scrollViewport } from "@/lib/motion";

export default function QuizPromo() {
  const rm = !!useReducedMotion();

  const itemVariants: Variants = {
    hidden: rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: scrollEase } },
  };

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper sm:py-24">
      <ContourField className="pointer-events-none absolute inset-0 h-full w-full text-paper/[0.06]" />
      <GrainOverlay className="text-paper/5" />

      <motion.div
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={{ visible: { transition: { staggerChildren: rm ? 0 : 0.1 } } }}
      >
        <motion.p variants={itemVariants} className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-paper/50">
          Not sure what your body needs?
        </motion.p>
        <motion.h2 variants={itemVariants} className="mb-4 font-serif text-3xl font-medium leading-[1.15] sm:text-4xl">
          Take the free <em className="not-italic italic text-[#8CAB77]">nutrient test</em>.
        </motion.h2>
        <motion.p variants={itemVariants} className="mb-9 max-w-md text-paper/65">
          Ten short questions about how you&apos;ve been feeling. We&apos;ll tell you which nutrients your
          symptoms point to, and why.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link
            href="/free-nutrient-test"
            className="group inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-[#D9E8C4]"
          >
            Take the 90-second test
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
