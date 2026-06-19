"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

const primaryLink =
  "inline-flex min-w-[180px] items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-[0_16px_40px_-14px_rgba(140,171,119,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7a9d65] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
const outlineLink =
  "inline-flex min-w-[180px] items-center justify-center rounded-full border border-ink/20 bg-transparent px-8 py-4 text-base font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/40 hover:bg-ink/[0.04] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";

export default function StoryFinalCta() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-background-main pb-24 pt-8 md:pb-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease: scrollEase }}
          className="relative overflow-hidden rounded-[2.4rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-background-white to-secondary/10 px-8 py-14 shadow-[0_40px_100px_-44px_rgba(105,149,177,0.45)] md:px-16 md:py-20"
        >
          {/* ambient glow */}
          <div
            className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl"
            aria-hidden
          />
          <div className="pointer-events-none absolute -right-16 bottom-0 -translate-x-[65px] opacity-90">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/zinc.png"
              alt=""
              className="h-[16.445rem] w-[16.445rem] object-contain drop-shadow-2xl md:h-[20rem] md:w-[20rem]"
            />
          </div>
          <div className="relative max-w-xl">
            <h2 className="font-serif text-3xl leading-[1.08] tracking-[-0.01em] text-ink sm:text-4xl md:text-[2.9rem]">
              A simpler path to <em className="italic text-primary">better</em> supplementation
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">
              Clean, targeted, science-backed formulas designed to support real health needs-not
              shelf appeal.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/shop" className={primaryLink}>
                Shop products
              </Link>
              <Link href="/shop" className={outlineLink}>
                Explore best sellers
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
