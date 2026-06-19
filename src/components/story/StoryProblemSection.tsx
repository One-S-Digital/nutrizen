"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { scrollEase, scrollViewport } from "@/lib/motion";

export default function StoryProblemSection() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Defer the 4MB video: only fetch + play once it scrolls into view, and
  // pause it when it leaves (saves bandwidth on load and CPU when off-screen).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload !== "auto") video.preload = "auto";
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* Video — framed, with an offset outline plate behind for depth */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -36, scale: 0.98 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease: scrollEase }}
          className="relative"
        >
          <div
            className="pointer-events-none absolute -left-4 -top-4 h-full w-full rounded-[2rem] border border-primary/25"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -inset-5 rounded-[2.4rem] bg-[radial-gradient(60%_60%_at_30%_30%,rgba(140,171,119,0.18),transparent_70%)] blur-2xl"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-[2rem] border border-neutral-light/80 bg-background-main shadow-[0_40px_90px_-48px_rgba(47,58,51,0.5)]">
            <video
              ref={videoRef}
              src="/about%20video.mp4"
              muted
              loop
              playsInline
              preload="none"
              className="aspect-[4/5] w-full object-cover md:aspect-[5/6]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent"
              aria-hidden
            />
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 36 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={scrollViewport}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease: scrollEase }}
        >
          <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-secondary">
            <span className="h-px w-9 bg-secondary/50" aria-hidden />
            Why we started
          </p>
          <h2 className="font-serif text-3xl leading-[1.06] tracking-[-0.01em] text-ink sm:text-4xl md:text-[2.9rem]">
            Wellness shouldn&apos;t mean <em className="italic text-primary">compromise</em>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/70">
            Most people want the same things: clarity, consistency, and formulas that respect the
            body. Yet the supplement aisle often feels noisy-marketing claims without context,
            mystery blends, and doses that look good on a label but do little in real life.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">
            NutriZen began with a simple frustration turned into a promise: build supplements we&apos;d
            confidently take ourselves-transparent, intentional, and designed around how nutrients
            actually behave in the body.
          </p>

          {/* Editorial pull-quote */}
          <motion.figure
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={scrollViewport}
            transition={{ delay: reduceMotion ? 0 : 0.12, duration: reduceMotion ? 0 : 0.65 }}
            className="relative mt-9 border-l-2 border-primary/40 pl-6"
          >
            <span
              className="pointer-events-none absolute -left-1 -top-5 font-serif text-6xl leading-none text-primary/25"
              aria-hidden
            >
              &ldquo;
            </span>
            <blockquote className="font-serif text-xl italic leading-relaxed text-ink md:text-[1.45rem]">
              We didn&apos;t want louder packaging-we wanted quieter confidence: labels you can read,
              doses you can trust, and support that meets you where your health goals actually are.
            </blockquote>
          </motion.figure>
        </motion.div>
      </div>
    </section>
  );
}
