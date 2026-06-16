"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { PaymentIcons } from "@/components/ui/PaymentIcons";
import { scrollEase, scrollViewport } from "@/lib/motion";

// ─── Data ───────────────────────────────────────────────────────────────────

const TRUST_BADGES = [
  {
    Icon: Truck,
    iconColor: "#10201A",
    iconBg: "bg-ink/[0.05]",
    title: "Nationwide Delivery",
    desc: "Fast, flat-rate shipping across South Africa",
  },
  {
    Icon: ShieldCheck,
    iconColor: "#10201A",
    iconBg: "bg-ink/[0.05]",
    title: "30-Day Refund",
    desc: "Not satisfied? We'll sort it out within 30 days",
  },
  {
    Icon: MessageCircle,
    iconColor: "#10201A",
    iconBg: "bg-ink/[0.05]",
    title: "Daily WhatsApp Support",
    desc: "Real human support available every day",
  },
];

const TRUST_STATS = [
  { value: "4.9★", label: "Average rating" },
  { value: "15,000+", label: "Happy customers" },
  { value: "100%", label: "Transparent formulas" },
];

const reviews = [
  {
    name: "Sarah J.",
    title: "Focus Formula Changed Everything",
    text: "I've tried every adaptogen complex on the market, but NutriZen's Focus formula is the only one that absolutely clears my mental fog without a crash.",
    rating: 5,
    tag: "Energy & Focus",
    color: "#5B5E80",
  },
  {
    name: "Michael T.",
    title: "Natural Energy — Finally",
    text: "The VitaCore B-Complex completely changed my morning routine. I feel naturally energised and actually ready to tackle the day.",
    rating: 5,
    tag: "Daily Vitality",
    color: "#A8762E",
  },
  {
    name: "Emma W.",
    title: "You Can Tell They Care",
    text: "Incredible quality. You can tell they actually care about the science behind these supplements. My stress levels have visibly dropped.",
    rating: 5,
    tag: "Stress & Recovery",
    color: "#8A5A40",
  },
];

const WHY_NUTRIZEN = [
  "Clean, transparent ingredient lists — no hidden blends",
  "Science-backed formulations at clinically effective doses",
  "No fillers, starches, or artificial additives",
  "Designed for real absorption and real results",
  "Fast shipping + 30-day satisfaction guarantee",
];

// ─── Star rating ─────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill={i < rating ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="1.5" aria-hidden>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SocialProof() {
  const rm = !!useReducedMotion();

  const badgeContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: rm ? 0 : 0.12, delayChildren: rm ? 0 : 0.05 } },
  };

  const badgeVariants: Variants = {
    hidden: rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: scrollEase } },
  };

  const reviewGridVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: rm ? 0 : 0.13, delayChildren: rm ? 0 : 0.04 } },
  };

  const reviewVariants: Variants = {
    hidden: rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: scrollEase } },
  };

  const whyVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: rm ? 0 : 0.1, delayChildren: rm ? 0 : 0.1 } },
  };

  const whyItemVariants: Variants = {
    hidden: rm ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: scrollEase } },
  };

  return (
    <section className="bg-white relative overflow-hidden">

      {/* ══════════════════════════════════════════════════
          TRUST HEADER — "Why 15,000+ Choose NutriZen"
      ══════════════════════════════════════════════════ */}
      <div className="bg-background-main border-b border-neutral-light/60 py-16">
        <div className="max-w-7xl mx-auto px-6">

          {/* Heading */}
          <motion.div
            className="text-center mb-12"
            initial={rm ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ duration: 0.8, ease: scrollEase }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-ink tracking-[-0.01em]">
              Why <em className="italic text-goal-immunity">15&nbsp;000+</em> customers choose NutriZen
            </h2>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
            variants={badgeContainerVariants}
          >
            {TRUST_BADGES.map(({ Icon, iconColor, iconBg, title, desc }) => (
              <motion.div
                key={title}
                variants={badgeVariants}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className={`w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center`}>
                  <Icon
                    className="w-8 h-8"
                    style={{ color: iconColor }}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </div>
                <div>
                  <p className="font-bold text-neutral-darkest text-sm mb-1">{title}</p>
                  <p className="text-neutral-dark text-xs leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats strip */}
          <motion.div
            className="grid grid-cols-3 gap-6 max-w-sm mx-auto"
            initial={rm ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ duration: 0.7, ease: scrollEase, delay: 0.15 }}
          >
            {TRUST_STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-serif text-2xl md:text-3xl text-ink mb-1">{value}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-dark">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <div className="py-24 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(105,149,177,0.05), transparent)" }}
          aria-hidden
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-14"
            initial={rm ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ duration: 0.85, ease: scrollEase }}
          >
            <p className="mb-5 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-goal-recovery">
              <span className="h-px w-9 bg-goal-recovery/50" aria-hidden />
              04 · Field notes
              <span className="h-px w-9 bg-goal-recovery/50" aria-hidden />
            </p>
            <h2 className="font-serif text-3xl md:text-[2.6rem] leading-[1.08] tracking-[-0.01em] text-ink mb-4">
              Notes from people who <em className="italic">stopped compromising</em>
            </h2>
            <p className="text-base text-neutral-dark leading-relaxed">
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
                whileHover={rm ? {} : { y: -6, transition: { duration: 0.28, ease: scrollEase } }}
                className={`bg-white rounded-3xl border border-neutral-light/50 p-8 relative overflow-hidden cursor-default ${
                  i % 2 === 0 ? "md:rotate-[-0.6deg]" : "md:rotate-[0.7deg]"
                }`}
                style={{ boxShadow: "0 14px 36px -14px rgba(16,32,26,0.16)" }}
              >
                {/* Colour accent top bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                  style={{ backgroundColor: review.color }}
                  aria-hidden
                />

                <div className="flex items-start justify-between mb-5">
                  <StarRating rating={review.rating} />
                  <span
                    className="font-mono text-[9px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${review.color}16`, color: review.color }}
                  >
                    {review.tag}
                  </span>
                </div>

                <h4 className="font-serif text-lg text-ink mb-3">{review.title}</h4>
                <p className="font-serif italic text-neutral-dark leading-relaxed text-[15px] mb-6">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                    style={{ backgroundColor: review.color }}
                    aria-hidden
                  >
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-darkest text-sm">{review.name}</p>
                    <span className="flex items-center gap-1 text-xs text-primary font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Verified Buyer
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          WHY NUTRIZEN
      ══════════════════════════════════════════════════ */}
      <div className="py-24 bg-background-main border-t border-neutral-light/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: why list */}
            <div>
              <motion.div
                initial={rm ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={scrollViewport}
                transition={{ duration: 0.8, ease: scrollEase }}
              >
                <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-secondary mb-4">
                  Why Choose NutriZen
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-ink mb-10 leading-[1.12] tracking-[-0.01em]">
                  Built for people who actually care what goes in their body
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
                  <motion.li key={i} variants={whyItemVariants} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center" aria-hidden>
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
                        fill="none" stroke="#8CAB77" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
              initial={rm ? false : { opacity: 0, x: 32, scale: 0.97 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={scrollViewport}
              transition={{ duration: 0.85, ease: scrollEase }}
              className="rounded-3xl bg-ink p-10 md:p-14 text-white relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" aria-hidden />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" aria-hidden />

              <div className="relative z-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-glow/70 mb-4">
                  Feel the difference
                </p>
                <h3 className="font-serif text-3xl md:text-[2.4rem] mb-4 leading-[1.1] tracking-[-0.01em]">
                  Your health. <em className="italic text-glow">Clear, simple, effective.</em>
                </h3>
                <p className="text-white/75 text-base leading-relaxed mb-8">
                  Supplements designed to actually work — with every ingredient listed, every dose intentional.
                </p>

                <div className="flex flex-col gap-3">
                  <motion.div whileHover={rm ? {} : { scale: 1.03 }} whileTap={rm ? {} : { scale: 0.97 }}>
                    <Link
                      href="/shop"
                      className="w-full flex items-center justify-center gap-2 rounded-full bg-primary text-white font-bold py-3.5 px-8 shadow-[0_8px_24px_-4px_rgba(140,171,119,0.5)] hover:bg-primary/90 transition-colors duration-200 text-sm"
                    >
                      Shop NutriZen
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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

      {/* ══════════════════════════════════════════════════
          PAYMENT ICONS STRIP
      ══════════════════════════════════════════════════ */}
      <motion.div
        className="bg-white border-t border-neutral-light/60 py-6"
        initial={rm ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={scrollViewport}
        transition={{ duration: 0.7, ease: scrollEase }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-neutral-dark">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="text-primary flex-shrink-0" aria-hidden>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-xs font-semibold text-neutral-dark">Secure Checkout</span>
          </div>
          <PaymentIcons />
        </div>
      </motion.div>

    </section>
  );
}
