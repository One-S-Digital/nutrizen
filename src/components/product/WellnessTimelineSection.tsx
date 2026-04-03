"use client";

import { useState } from "react";
import { Check, Heart } from "lucide-react";
import type { PdpTimelineMilestone } from "@/lib/shopify-pdp-meta";
import { cn } from "@/lib/utils";

type Props = {
  items: PdpTimelineMilestone[];
};

export function WellnessTimelineSection({ items }: Props) {
  const [active, setActive] = useState(0);

  if (!items.length) return null;

  const current = items[active] ?? items[0];

  return (
    <section className="py-4" aria-labelledby="wellness-timeline-heading">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-2 flex justify-center">
          <Heart className="h-6 w-6 text-amber-800/80" aria-hidden />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-900/80">Your wellness journey</p>
        <h2 id="wellness-timeline-heading" className="mt-2 font-serif text-3xl font-semibold tracking-tight text-neutral-darkest md:text-4xl">
          How you&apos;ll feel
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-dark md:text-base">
          Real changes you can feel, from the very first week to months of consistent use.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto pb-2">
        <div className="relative mx-auto flex min-w-[min(100%,720px)] max-w-3xl items-start justify-between px-2">
          <div className="absolute left-8 right-8 top-5 h-0.5 bg-neutral-light md:left-12 md:right-12" aria-hidden />
          <ol className="relative z-[1] flex w-full justify-between gap-2">
            {items.map((item, index) => {
              const isActive = index === active;
              return (
                <li key={`${item.stepLabel}-${item.stepNumber}`} className="flex flex-1 flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-pressed={isActive}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-semibold transition md:h-12 md:w-12",
                      isActive
                        ? "border-amber-900 bg-white text-amber-950 shadow-md ring-2 ring-amber-800/30"
                        : "border-neutral-light bg-white text-neutral-dark hover:border-primary/40",
                    )}
                  >
                    {item.stepNumber}
                  </button>
                  <span
                    className={cn(
                      "mt-3 max-w-[100px] text-center text-xs font-medium md:text-sm",
                      isActive ? "text-neutral-darkest" : "text-neutral-dark",
                    )}
                  >
                    {item.stepLabel}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-neutral-light/90 bg-white p-6 shadow-md md:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-900/90">{current.stepLabel}</p>
        <h3 className="mt-2 font-serif text-2xl font-semibold text-neutral-darkest md:text-3xl">{current.cardTitle}</h3>
        <p className="mt-4 text-sm leading-relaxed text-neutral-dark md:text-base">{current.body}</p>

        {current.benefits.length > 0 ? (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {current.benefits.map((line) => (
              <li
                key={line}
                className="flex items-start gap-2 rounded-xl border border-amber-100/80 bg-[#F9F7F2] px-3 py-2 text-left text-sm text-neutral-darkest"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {current.tip ? (
          <aside className="mt-8 border-l-4 border-amber-800/70 bg-amber-50/80 px-4 py-3 text-left text-sm text-neutral-darkest">
            <span className="font-semibold text-amber-950">Tip</span>
            <span className="text-neutral-darkest"> — {current.tip}</span>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
