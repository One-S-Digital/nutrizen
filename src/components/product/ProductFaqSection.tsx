"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PdpFaqItem } from "@/lib/shopify-pdp-meta";

type Props = {
  items: PdpFaqItem[];
};

function FaqItem({ item, index }: { item: PdpFaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-b border-neutral-light last:border-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <span className="text-base font-semibold leading-snug text-neutral-darkest">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-neutral-dark transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        className={cn(
          "overflow-hidden text-sm leading-relaxed text-neutral-dark transition-all duration-200",
          open ? "mb-5 max-h-[600px]" : "max-h-0",
        )}
      >
        {item.answer}
      </div>
    </div>
  );
}

export function ProductFaqSection({ items }: Props) {
  if (!items.length) return null;

  return (
    <section className="rounded-[1.25rem] border border-neutral-light/80 bg-white p-6 shadow-sm md:p-10">
      <div className="mb-6 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
          Have questions?
        </p>
        <h2 className="font-serif text-2xl font-bold text-neutral-darkest md:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-sm text-neutral-dark">
          Have questions? We&apos;ve got all the answers. If you don&apos;t see what you&apos;re looking for,{" "}
          <a href="/contact" className="underline hover:text-primary">
            reach out to our support team
          </a>
          .
        </p>
      </div>
      <div className="mx-auto max-w-3xl divide-y divide-neutral-light">
        {items.map((item, i) => (
          <FaqItem key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
