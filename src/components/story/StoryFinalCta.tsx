"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

const primaryLink =
  "inline-flex min-w-[180px] items-center justify-center rounded-2xl border border-primary/20 bg-primary px-8 py-4 text-base font-medium text-white shadow-[0_4px_14px_0_rgba(140,171,119,0.39)] transition-colors duration-300 hover:bg-[#7a9d65] hover:shadow-[0_6px_20px_rgba(140,171,119,0.23)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
const outlineLink =
  "inline-flex min-w-[180px] items-center justify-center rounded-2xl border-2 border-primary bg-transparent px-8 py-4 text-base font-medium text-primary transition-colors duration-300 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";

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
          className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-background-white to-secondary/10 px-8 py-12 shadow-[0_24px_80px_-32px_rgba(105,149,177,0.35)] md:px-14 md:py-16"
        >
          <div className="pointer-events-none absolute -right-16 bottom-0 -translate-x-[65px] opacity-90">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/zinc.png"
              alt=""
              className="h-[16.445rem] w-[16.445rem] object-contain drop-shadow-xl md:h-[19.435rem] md:w-[19.435rem]"
            />
          </div>
          <div className="relative max-w-xl">
            <h2 className="text-3xl font-bold text-neutral-darkest md:text-4xl">
              A simpler path to better supplementation
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-neutral-dark">
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
