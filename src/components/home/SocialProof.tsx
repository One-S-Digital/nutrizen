"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { scrollEase, scrollViewport } from "@/lib/motion";

export default function SocialProof() {
  const reduceMotion = useReducedMotion();

  const headerTransition = {
    duration: reduceMotion ? 0 : 0.85,
    ease: scrollEase,
  };

  const reviewGridVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.2,
        delayChildren: reduceMotion ? 0 : 0.04,
      },
    },
  };

  const reviewVariants: Variants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.8,
        ease: scrollEase,
      },
    },
  };

  const reviews = [
    {
      name: "Sarah J.",
      verified: true,
      text: "I've tried every adaptogen complex on the market, but NutriZen's Focus formula is the only one that absolutely clears my mental fog without a crash.",
    },
    {
      name: "Michael T.",
      verified: true,
      text: "The VitaCore B-Complex completely changed my morning routine. I feel naturally energized and actually ready to tackle the day.",
    },
    {
      name: "Emma W.",
      verified: true,
      text: "Incredible quality. You can tell they actually care about the science behind these supplements. My stress levels have visibly dropped.",
    },
  ];

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
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-4 block">No Compromises</span>
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-darkest mb-6">
            For People Who Are Done Compromising
          </h2>
          <p className="text-lg text-neutral-dark mt-4">
            If you’ve ever questioned whether your supplements actually work - you’re not alone. <br className="hidden md:block" />
            NutriZen is built for people who want clarity, quality, and real results.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          variants={reviewGridVariants}
        >
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              variants={reviewVariants}
              className="bg-background-main p-10 rounded-[2rem] border border-neutral-light/50 shadow-sm relative"
            >
              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              <p className="text-neutral-dark italic mb-8 h-24">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center font-bold text-secondary">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-neutral-darkest text-sm">{review.name}</h4>
                  {review.verified && (
                    <span className="text-xs text-primary font-medium flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-32 border-t border-neutral-light pt-32 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-darkest mb-10">Why Choose NutriZen?</h2>

          <ul className="text-left md:text-center space-y-4 mb-20 text-lg text-neutral-dark max-w-md mx-auto md:max-w-none">
            <li className="flex items-center md:justify-center gap-3"><svg className="w-6 h-6 text-primary flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Clean, transparent ingredient lists</li>
            <li className="flex items-center md:justify-center gap-3"><svg className="w-6 h-6 text-primary flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Science-backed formulations</li>
            <li className="flex items-center md:justify-center gap-3"><svg className="w-6 h-6 text-primary flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> No fillers, starches, or artificial additives</li>
            <li className="flex items-center md:justify-center gap-3"><svg className="w-6 h-6 text-primary flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Designed for real absorption and results</li>
            <li className="flex items-center md:justify-center gap-3"><svg className="w-6 h-6 text-primary flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Fast shipping + 30-day guarantee</li>
          </ul>

          <div className="bg-background-main rounded-[2rem] p-12 md:p-16 border border-neutral-light shadow-sm">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-darkest mb-8">
              Your Health. Clear, Simple, Effective.
            </h2>
            <Button size="lg" variant="primary" className="mb-6 px-12 group">
              Shop NutriZen
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Button>
            <p className="text-neutral-dark text-lg font-medium">Feel the difference of supplements designed to actually work.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
