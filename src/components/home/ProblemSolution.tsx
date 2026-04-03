"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { BadgeCheck, Droplets, FlaskConical } from "lucide-react";
import { scrollEase, scrollViewport } from "@/lib/motion";

const iconClass = "h-7 w-7";

const iconProps = {
  className: iconClass,
  "aria-hidden": true as const,
  strokeWidth: 1.75,
};

export default function ProblemSolution() {
  const reduceMotion = useReducedMotion();

  const headerTransition = {
    duration: reduceMotion ? 0 : 0.85,
    ease: scrollEase,
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.14,
        delayChildren: reduceMotion ? 0 : 0.06,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: reduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.72,
        ease: scrollEase,
      },
    },
  };

  return (
    <section className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={headerTransition}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-darkest mb-6 leading-tight">
            Tired of guessing what’s really in your supplements?
          </h2>
          <p className="text-lg text-neutral-dark mb-4">
            Most supplements are packed with fillers, underdosed ingredients, or “proprietary blends” that hide the truth.{" "}
          </p>
          <p className="text-lg font-bold text-primary">
            At NutriZen, everything is clear.{" "}
          </p>
          <p className="text-lg text-neutral-dark mt-4">
            Every ingredient is listed. Every dose is intentional. Every formula is built to work - not just sell.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          variants={containerVariants}
        >
          {[
            {
              title: "Transparent Formulas",
              text: "No hidden ingredients. No unnecessary additives. You know exactly what you're putting into your body.",
              highlight: "primary",
              icon: <FlaskConical {...iconProps} />,
            },
            {
              title: "Clinically Effective Doses",
              text: "Formulated with nutrition science - not marketing hype. Precision dosages that drive actual results.",
              highlight: "secondary",
              icon: <BadgeCheck {...iconProps} />,
            },
            {
              title: "Clean & Bioavailable",
              text: "Your body absorbs what it actually needs. Real targeted nutrients directly where your cells need them.",
              highlight: "primary",
              icon: <Droplets {...iconProps} />,
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              className="bg-background-main p-10 rounded-[2rem] border border-neutral-light/50 shadow-[0_4px_22px_-2px_rgba(47,58,51,0.1)] transition-all duration-300 ease-out hover:-translate-y-3 hover:shadow-[0_18px_44px_-10px_rgba(47,58,51,0.2)]"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${
                  item.highlight === "primary"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-neutral-darkest mb-4">{item.title}</h3>
              <p className="text-neutral-dark leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
