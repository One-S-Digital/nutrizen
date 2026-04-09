"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

export const COMBO_PRODUCT_HREF = "/shop";

const BENEFIT_PILLS = [
  { label: "Supports immune defense", icon: "🛡️" },
  { label: "Boosts antioxidant protection", icon: "⚡" },
  { label: "Promotes energy and resilience", icon: "💪" },
  { label: "Supports bone, muscle & recovery", icon: "🦴" },
] as const;

export default function DynamicProductShowcase() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.4, 1], [1.08, 1, 0.98]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const bgGradientPos = useTransform(scrollYProgress, [0, 1], ["0% 50%", "100% 50%"]);

  const contentVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.1,
        delayChildren: reduceMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.7, ease: scrollEase },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #F9F8F2 0%, #EEF3EC 50%, #F2F0EB 100%)",
      }}
    >
      {/* Animated background accent */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 50%, rgba(140,171,119,0.08) 0%, transparent 70%)",
        }}
        animate={
          reduceMotion
            ? {}
            : {
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.04, 1],
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Product image with parallax */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -40, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={scrollViewport}
            transition={{ duration: 0.9, ease: scrollEase }}
            className="relative"
          >
            <div
              ref={imageRef}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-neutral-light/50 shadow-[0_20px_60px_-12px_rgba(47,58,51,0.18)]"
              style={{ backgroundColor: "#EEF1EC" }}
            >
              <motion.div
                style={reduceMotion ? {} : { scale: imageScale, y: imageY }}
                className="absolute inset-0"
                whileHover={reduceMotion ? {} : { scale: 1.045 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="/immunity-power-pack-hero.png"
                  alt="NutriZen Immunity Power Pack: Zinc plus Copper and Selenium, Vitamin D3 plus Magnesium Glycinate, and Glutathione Precursor plus NAC"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </motion.div>

              {/* Glass badge on image */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4, ease: scrollEase }}
                className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-white/60"
              >
                <p className="text-xs font-bold text-neutral-dark uppercase tracking-wider mb-0.5">Bundle savings</p>
                <p className="text-lg font-bold text-primary">Save R75</p>
              </motion.div>

              {/* Floating star badge */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
                className="absolute top-5 right-5 bg-[#DE9E48] text-white rounded-full px-3.5 py-1.5 shadow-lg"
              >
                <span className="text-xs font-bold tracking-wide">⭐ Best Seller</span>
              </motion.div>
            </div>

            {/* Decorative blur shape */}
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
          </motion.div>

          {/* RIGHT: Content */}
          <motion.div
            variants={contentVariants}
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={scrollViewport}
            className="flex flex-col text-center items-center lg:items-start lg:text-left"
          >
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 text-[#DE9E48] font-bold tracking-widest uppercase text-[11px] mb-5 bg-[#DE9E48]/10 px-4 py-2 rounded-full"
            >
              <span>✦</span> Immunity Power Pack
            </motion.span>

            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-semibold text-[#3B4A3F] mb-5 tracking-tight max-w-xl"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
            >
              Your Daily Immunity &amp; Recovery Stack
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-[#3B4A3F] text-[15px] leading-relaxed mb-7 max-w-[520px]"
            >
              This powerful 3-product combo supports immune strength, antioxidant defense, and everyday vitality.
              Zinc + Copper &amp; Selenium, Vitamin D3 + Magnesium Glycinate, and Glutathione Precursor + NAC —
              targeted support for immunity, recovery, and cellular protection.
            </motion.p>

            {/* Benefit pills */}
            <motion.div
              variants={itemVariants}
              className="mb-7 flex w-full max-w-xl flex-wrap justify-center gap-2 lg:justify-start"
            >
              {BENEFIT_PILLS.map(({ label, icon }) => (
                <motion.span
                  key={label}
                  whileHover={reduceMotion ? {} : { y: -2, scale: 1.03 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#3B4A3F]/12 bg-white/95 px-4 py-2.5 text-[12px] font-medium leading-snug text-[#3B4A3F] shadow-[0_1px_6px_rgba(0,0,0,0.05)] cursor-default"
                >
                  <span>{icon}</span>
                  {label}
                </motion.span>
              ))}
            </motion.div>

            {/* Price card */}
            <motion.div
              variants={itemVariants}
              className="mb-8 w-full max-w-md rounded-2xl border border-black/8 bg-white/90 px-6 py-5 text-left shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
            >
              <p className="text-base font-semibold text-[#3B4A3F] mb-1">Immunity Power Pack</p>
              <p className="text-sm text-neutral-dark/60 mb-3">3 products · 10% off when bundled</p>
              <div className="flex items-baseline gap-3">
                <span className="text-sm text-neutral-dark/50 line-through">R749.97</span>
                <span className="text-2xl font-bold text-[#425244]">R674.97</span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Save 10%
                </span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={COMBO_PRODUCT_HREF}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#425244] px-10 py-4 text-[13px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_-4px_rgba(66,82,68,0.4)] hover:bg-[#344136] transition-colors duration-300"
                >
                  Get the Combo &amp; Save
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
