"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

const PURPOSES: {
  title: string;
  blurb: string;
  image: string;
  alt: string;
  accent: string;
}[] = [
  {
    title: "Energy & vitality",
    blurb: "Steady fuel for busy days-without the crash.",
    image: "/vitacore.png",
    alt: "Vitacore product",
    accent: "#A8762E",
  },
  {
    title: "Stress & resilience",
    blurb: "Adaptogens and minerals that meet modern pressure with calm clarity.",
    image: "/adaptogen.png",
    alt: "Adaptogen support",
    accent: "#5B5E80",
  },
  {
    title: "Detox & digestion",
    blurb: "Gentle daily support for how your body clears and absorbs.",
    image: "/para cleanse.png",
    alt: "Digestive support",
    accent: "#4E7050",
  },
  {
    title: "Immune support",
    blurb: "Targeted nutrients for seasonal resilience and recovery.",
    image: "/vitamin d3.png",
    alt: "Immune formula",
    accent: "#42634C",
  },
  {
    title: "Metabolic health",
    blurb: "Formulas aligned with glucose balance and cellular energy.",
    image: "/metabol.png",
    alt: "Metabolic support",
    accent: "#6B7240",
  },
  {
    title: "Cellular nourishment",
    blurb: "Antioxidants and cofactors that protect what keeps you going.",
    image: "/glutathione.png",
    alt: "Cellular nourishment",
    accent: "#2F5D5C",
  },
];

export default function ProductPurposeStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: scrollEase }}
        >
          <div className="max-w-2xl">
            <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
              <span className="h-px w-9 bg-primary/50" aria-hidden />
              Real needs, real formulas
            </p>
            <h2 className="font-serif text-3xl leading-[1.08] tracking-[-0.01em] text-ink sm:text-4xl md:text-[2.9rem]">
              Built around how you actually live
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/65">
              Every range is designed with a purpose-not a trend. Scroll to explore the intentions
              behind our lineup.
            </p>
          </div>
          <Link
            href="/shop"
            className="group hidden shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 transition-colors hover:text-ink md:inline-flex"
          >
            Shop all categories
            <span className="block h-px w-9 bg-ink/30 transition-all duration-300 group-hover:w-14 group-hover:bg-ink" />
          </Link>
        </motion.div>

        <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden">
          {PURPOSES.map((item, i) => (
            <motion.article
              key={item.title}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={scrollViewport}
              transition={{ delay: reduceMotion ? 0 : i * 0.04, duration: 0.55, ease: scrollEase }}
              className="group relative w-[min(78vw,280px)] flex-shrink-0 snap-start overflow-hidden rounded-[1.8rem] border border-neutral-light/80 bg-background-main shadow-[0_2px_10px_rgba(47,58,51,0.04)] transition-shadow duration-300 hover:shadow-[0_30px_60px_-32px_rgba(47,58,51,0.4)] md:w-[268px]"
            >
              <span
                className="absolute left-0 top-0 z-10 h-[3px] w-12 rounded-full transition-all duration-500 group-hover:w-full"
                style={{ backgroundColor: item.accent }}
                aria-hidden
              />
              <div
                className="relative flex h-44 items-center justify-center px-6 pt-8"
                style={{
                  backgroundImage: `radial-gradient(120% 90% at 50% 0%, ${item.accent}1f, transparent 62%)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.alt}
                  className="max-h-36 w-auto object-contain drop-shadow-[0_18px_28px_rgba(47,58,51,0.18)] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.05]"
                />
              </div>
              <div className="px-6 pb-7 pt-5">
                <h3 className="font-serif text-lg text-ink md:text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{item.blurb}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-6 flex justify-end md:hidden">
          <Link
            href="/shop"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-secondary transition-colors hover:text-primary"
          >
            Shop all categories →
          </Link>
        </div>
      </div>
    </section>
  );
}
