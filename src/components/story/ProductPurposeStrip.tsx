"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

const PURPOSES: {
  title: string;
  blurb: string;
  image: string;
  alt: string;
}[] = [
  {
    title: "Energy & vitality",
    blurb: "Steady fuel for busy days-without the crash.",
    image: "/vitacore.png",
    alt: "Vitacore product",
  },
  {
    title: "Stress & resilience",
    blurb: "Adaptogens and minerals that meet modern pressure with calm clarity.",
    image: "/adaptogen.png",
    alt: "Adaptogen support",
  },
  {
    title: "Detox & digestion",
    blurb: "Gentle daily support for how your body clears and absorbs.",
    image: "/para cleanse.png",
    alt: "Digestive support",
  },
  {
    title: "Immune support",
    blurb: "Targeted nutrients for seasonal resilience and recovery.",
    image: "/vitamin d3.png",
    alt: "Immune formula",
  },
  {
    title: "Metabolic health",
    blurb: "Formulas aligned with glucose balance and cellular energy.",
    image: "/metabol.png",
    alt: "Metabolic support",
  },
  {
    title: "Cellular nourishment",
    blurb: "Antioxidants and cofactors that protect what keeps you going.",
    image: "/glutathione.png",
    alt: "Cellular nourishment",
  },
];

export default function ProductPurposeStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="max-w-2xl"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: scrollEase }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Real needs, real formulas
          </p>
          <h2 className="mt-3 text-3xl font-bold text-neutral-darkest md:text-4xl">
            Built around how you actually live
          </h2>
          <p className="mt-4 text-lg text-neutral-dark">
            Every range is designed with a purpose-not a trend. Scroll to explore the intentions
            behind our lineup.
          </p>
        </motion.div>

        <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden">
          {PURPOSES.map((item, i) => (
            <motion.article
              key={item.title}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={scrollViewport}
              transition={{ delay: reduceMotion ? 0 : i * 0.04, duration: 0.55, ease: scrollEase }}
              className="group relative w-[min(78vw,280px)] flex-shrink-0 snap-start overflow-hidden rounded-[2rem] border border-neutral-light/80 bg-background-main shadow-sm transition-shadow duration-300 hover:shadow-lg md:w-[260px]"
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-b from-background-alt to-background-main px-6 pt-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.alt}
                  className="max-h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-6 pb-7 pt-5">
                <h3 className="text-lg font-bold text-neutral-darkest">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-dark">{item.blurb}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/shop"
            className="text-sm font-semibold text-secondary underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Shop all categories
          </Link>
        </div>
      </div>
    </section>
  );
}
