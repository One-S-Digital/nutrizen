"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { scrollEase, scrollViewport } from "@/lib/motion";

const reviews = [
  {
    name: "Sarah J.",
    title: "Focus Formula Changed Everything",
    text: "I've tried every adaptogen complex on the market, but NutriZen's Focus formula is the only one that absolutely clears my mental fog without a crash.",
    rating: 5,
    tag: "Energy & Focus",
    color: "#6995B1",
  },
  {
    name: "Michael T.",
    title: "Natural Energy — Finally",
    text: "The VitaCore B-Complex completely changed my morning routine. I feel naturally energized and actually ready to tackle the day.",
    rating: 5,
    tag: "Daily Vitality",
    color: "#8CAB77",
  },
  {
    name: "Emma W.",
    title: "You Can Tell They Care",
    text: "Incredible quality. You can tell they actually care about the science behind these supplements. My stress levels have visibly dropped.",
    rating: 5,
    tag: "Stress & Recovery",
    color: "#D87D4A",
  },
];

const WHY_NUTRIZEN = [
  "Clean, transparent ingredient lists — no hidden blends",
  "Science-backed formulations at clinically effective doses",
  "No fillers, starches, or artificial additives",
  "Designed for real absorption and real results",
  "Fast shipping + 30-day satisfaction guarantee",
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? "#F59E0B" : "none"}
          stroke="#F59E0B"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function SocialProof() {
  const reduceMotion = useReducedMotion();
  const [activeReview, setActiveReview] = useState(0);

  const reviewGridVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.14,
        delayChildren: reduceMotion ? 0 : 0.04,
      },
    },
  };

  const reviewVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.72, ease: scrollEase },
    },
  };

  const whyVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.1, delayChildren: reduceMotion ? 0 : 0.1 },
    },
  };

  const whyItemVariants: Variants = {
    hidden: { opacity: 0, x: -16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: reduceMotion ? 0 : 0.55, ease: scrollEase },
    },
  };

  return (
    <section className="bg-white relative overflow-hidden">
      {/* TESTIMONIALS */}
      <div className="py-28 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(105,149,177,0.06),transparent)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ duration: 0.85, ease: scrollEase }}
          >
            <span className="inline-block text-secondary font-bold tracking-[0.18em] uppercase text-xs mb-4 bg-secondary/8 px-4 py-1.5 rounded-full">
              Real Results
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-darkest mb-5">
              For People Who Are Done Compromising
            </h2>
            <p className="text-lg text-neutral-dark leading-relaxed">
              If you&apos;ve ever questioned whether your supplements actually work — you&apos;re not alone.
            </p>
          </motion.div>

          {/* Review cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
            variants={reviewGridVariants}
          >
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                variants={reviewVariants}
                whileHover={reduceMotion ? {} : { y: -6, transition: { duration: 0.28, ease: scrollEase } }}
                className="bg-background-main rounded-3xl border border-neutral-light/50 p-8 relative overflow-hidden cursor-default"
                style={{ boxShadow: "0 4px 20px -4px rgba(47,58,51,0.08)" }}
              >
                {/* Color accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                  style={{ backgroundColor: review.color }}
                />

                <div className="flex items-start justify-between mb-5">
                  <StarRating rating={review.rating} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${review.color}18`, color: review.color }}
                  >
                    {review.tag}
                  </span>
                </div>

                <h4 className="font-bold text-neutral-darkest text-base mb-3">{review.title}</h4>
                <p className="text-neutral-dark leading-relaxed text-sm mb-6 italic">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                    style={{ backgroundColor: review.color }}
                  >
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-darkest text-sm">{review.name}</p>
                    <span className="flex items-center gap-1 text-xs text-primary font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Verified Buyer
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust stat strip */}
          <motion.div
            className="mt-14 grid grid-cols-3 gap-6 max-w-2xl mx-auto"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ duration: 0.7, ease: scrollEase, delay: 0.15 }}
          >
            {[
              { value: "4.9★", label: "Average rating" },
              { value: "2,400+", label: "Happy customers" },
              { value: "30-day", label: "Guarantee" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-neutral-darkest mb-1">{value}</p>
                <p className="text-sm text-neutral-dark">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* WHY NUTRIZEN */}
      <div className="py-28 bg-background-main border-t border-neutral-light/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: why list */}
            <div>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={scrollViewport}
                transition={{ duration: 0.8, ease: scrollEase }}
              >
                <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-secondary mb-4">
                  Why Choose NutriZen
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-darkest mb-10 leading-tight">
                  Supplements Built for People Who Actually Care What Goes in Their Body
                </h2>
              </motion.div>

              <motion.ul
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={scrollViewport}
                variants={whyVariants}
              >
                {WHY_NUTRIZEN.map((item, i) => (
                  <motion.li
                    key={i}
                    variants={whyItemVariants}
                    className="flex items-start gap-3.5"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8CAB77" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className="text-neutral-dark leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Right: CTA card */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 32, scale: 0.97 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={scrollViewport}
              transition={{ duration: 0.85, ease: scrollEase }}
              className="rounded-3xl bg-[#425244] p-10 md:p-14 text-white relative overflow-hidden"
            >
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

              <div className="relative z-10">
                <p className="text-white/60 font-semibold text-xs uppercase tracking-widest mb-4">
                  Feel the difference
                </p>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  Your Health. Clear, Simple, Effective.
                </h3>
                <p className="text-white/75 text-base leading-relaxed mb-8">
                  Supplements designed to actually work — with every ingredient listed, every dose intentional.
                </p>

                <div className="flex flex-col gap-3">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/shop"
                      className="w-full flex items-center justify-center gap-2 rounded-full bg-primary text-white font-bold py-3.5 px-8 shadow-[0_8px_24px_-4px_rgba(140,171,119,0.5)] hover:bg-primary/90 transition-colors duration-200 text-sm"
                    >
                      Shop NutriZen
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                  </motion.div>
                  <Link
                    href="/pages/science"
                    className="text-center text-white/60 hover:text-white text-sm font-medium transition-colors py-1"
                  >
                    Read the science →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
