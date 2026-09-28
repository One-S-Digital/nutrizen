"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqAccordionItem = { question: string; answer: string };

function FaqAccordionRow({ item }: { item: FaqAccordionItem }) {
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
        <span className="text-base font-semibold leading-snug text-neutral-darkest">{item.question}</span>
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

export default function FaqAccordion({ items, className }: { items: FaqAccordionItem[]; className?: string }) {
  return (
    <div
      className={cn(
        "divide-y divide-neutral-light rounded-[1.25rem] border border-neutral-light/80 bg-white p-6 shadow-sm md:p-10",
        className,
      )}
    >
      {items.map((item) => (
        <FaqAccordionRow key={item.question} item={item} />
      ))}
    </div>
  );
}
