"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

export default function BrandQuoteSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-background-main py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.figure
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: scrollEase }}
          className="relative isolate overflow-hidden rounded-[2.4rem] bg-ink shadow-[0_50px_110px_-55px_rgba(16,32,25,0.9)]"
        >
          {/* Cinematic backdrop */}
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden
          />
          {/* Legibility + depth gradients */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/30"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/40"
            aria-hidden
          />

          {/* Product composite, anchored bottom-right (desktop) */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={scrollViewport}
            transition={{ duration: reduceMotion ? 0 : 1, delay: 0.15, ease: scrollEase }}
            className="pointer-events-none absolute -bottom-2 right-0 hidden w-[52%] items-end justify-end md:flex lg:right-4 lg:w-[47%]"
            aria-hidden
          >
            <Image
              src="/science%20hero%20image.png"
              alt=""
              width={1254}
              height={1254}
              className="h-auto w-full max-w-[500px] select-none"
              style={{ filter: "drop-shadow(0 40px 70px rgba(0,0,0,0.8))" }}
            />
          </motion.div>

          {/* Quote, set over the image */}
          <div className="relative z-10 flex min-h-[440px] max-w-2xl flex-col justify-center px-8 py-16 md:min-h-[560px] md:px-16">
            <span
              className="font-serif text-7xl leading-none text-primary/40 md:text-8xl"
              aria-hidden
            >
              &ldquo;
            </span>
            <motion.blockquote
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={scrollViewport}
              transition={{ duration: reduceMotion ? 0 : 0.85, delay: reduceMotion ? 0 : 0.08 }}
              className="-mt-4 font-serif text-3xl leading-[1.12] tracking-[-0.01em] text-paper md:text-[2.9rem]"
            >
              We didn&rsquo;t want more supplements.{" "}
              <em className="italic text-[#C9DCAE]">We wanted better ones.</em>
            </motion.blockquote>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={scrollViewport}
              transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.15 }}
              className="mt-7 max-w-xl text-lg leading-relaxed text-paper/75"
            >
              NutriZen is a quiet commitment to craft: fewer compromises, clearer standards, and a
              brand experience that feels as considered as the formulas inside the bottle.
            </motion.p>
          </div>
        </motion.figure>
      </div>
    </section>
  );
}
