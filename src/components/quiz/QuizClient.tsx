"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { scrollEase } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  QUESTIONS,
  SAFETY_QUESTION,
  GATE_COPY,
  FOOTER_COPY,
  INTRO_COPY,
  EMAIL_GATE_COPY,
  BUCKETS,
  buildResult,
  joinNatural,
  formatPrice,
  cartPermalink,
  pdpLink,
  DEFAULT_SAFETY,
  type Answers,
  type Question,
  type QuestionOption,
  type SafetyState,
  type ResultItem,
  type QuizResult,
} from "./quiz-data";

// Original standalone-quiz palette (porcelain/spruce/chlorophyll/sage/amber/stone),
// light AND dark variants, kept exactly so the quiz's own look stays as designed —
// only the fonts now come from the site's shared next/font setup (Fraunces/Inter/
// Plex Mono) instead of the quiz's own separate Google Fonts import. Dark mode is
// a manual switch (see the toggle in QuizClient below), defaulting to the device's
// prefers-color-scheme on first load — tailwind.config.ts sets darkMode:"class"
// for this, scoped to a `dark` class on this component's own root div only.
const SCREENS = ["intro", ...QUESTIONS.map((q) => q.id), "safety", "email", "result"] as const;
const THEME_STORAGE_KEY = "nz-quiz-theme";

const CARD_SHADOW = "shadow-[0_1px_2px_rgba(22,40,31,0.06),0_12px_32px_-16px_rgba(22,40,31,0.18)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_20px_40px_-20px_rgba(0,0,0,0.6)]";

function parseEmphasis(text: string) {
  const parts = text.split("*");
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="not-italic font-serif italic text-[#2F6B4F] dark:text-[#5EAB80]">
        {part}
      </em>
    ) : (
      part
    ),
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5">
      <path d="M1 5L4 8L9 2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BrandRow({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-2.5">
      <div className="flex items-center gap-2.5">
        <Image src="/nutrizen-logo.png" alt="NutriZen" width={86} height={22} className="h-[22px] w-auto" />
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8B948E] dark:text-[#7D8B83]">Deficiency Guide</span>
      </div>
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-[#16281F]/12 text-[#16281F] transition-colors hover:border-[#16281F]/22 dark:border-[#F1EFE8]/13 dark:text-[#F1EFE8] dark:hover:border-[#F1EFE8]/24"
      >
        {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

function LeafDecoration() {
  return (
    <Image
      src="/quiz-leaf-right.png"
      alt=""
      width={220}
      height={220}
      aria-hidden
      className="pointer-events-none fixed -bottom-[30px] -right-[30px] hidden w-[220px] opacity-[0.16] sm:block"
    />
  );
}

function ProgressRail({ current }: { current: number }) {
  return (
    <div className="mb-8 flex gap-1.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
        <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-[#16281F]/12 dark:bg-[#F1EFE8]/13">
          <span
            className={cn(
              "block h-full rounded-full bg-[#2F6B4F] transition-[width] duration-300 dark:bg-[#5EAB80]",
              i <= current ? "w-full" : "w-0",
            )}
          />
        </div>
      ))}
    </div>
  );
}

function NavButtons({
  onBack,
  onContinue,
  canContinue,
  label = "Continue",
}: {
  onBack?: (() => void) | null;
  onContinue: () => void;
  canContinue: boolean;
  label?: string;
}) {
  return (
    <div className="mt-auto flex items-center justify-between gap-3 pt-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="px-2 py-3 text-[0.9rem] font-semibold text-[#4A5B52] hover:text-[#16281F] dark:text-[#B6C1B9] dark:hover:text-[#F1EFE8]"
        >
          ← Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        disabled={!canContinue}
        onClick={onContinue}
        className="rounded-lg bg-[#2F6B4F] px-5 py-[13px] text-[0.95rem] font-semibold text-white transition-colors hover:bg-[#204D38] disabled:cursor-not-allowed disabled:opacity-35 dark:bg-[#5EAB80] dark:hover:bg-[#7EC69C]"
      >
        {label}
      </button>
    </div>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  const c = INTRO_COPY;
  return (
    <div className="screen flex flex-1 flex-col">
      <p className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.24em] text-[#2F6B4F] dark:text-[#5EAB80]">{c.eyebrow}</p>
      <h1 className="mb-3 mt-2.5 font-serif text-[1.6rem] font-medium leading-[1.18] text-[#16281F] dark:text-[#F1EFE8] sm:text-3xl md:text-4xl">
        {parseEmphasis(c.headline)}
      </h1>
      <p className="mb-2 max-w-[46ch] text-[0.98rem] leading-relaxed text-[#4A5B52] dark:text-[#B6C1B9]">{c.body}</p>
      <p className="max-w-[46ch] text-[0.98rem] italic leading-relaxed text-[#8B948E] dark:text-[#7D8B83]">{c.disclaimer}</p>
      <div className="flex flex-1 items-center justify-center py-6">
        <button
          type="button"
          onClick={onStart}
          className="rounded-lg bg-[#2F6B4F] px-8 py-[17px] text-[1.05rem] font-semibold text-white transition-colors hover:bg-[#204D38] dark:bg-[#5EAB80] dark:hover:bg-[#7EC69C]"
        >
          {c.cta} →
        </button>
      </div>
    </div>
  );
}

function OptionCard({
  option,
  type,
  selected,
  onToggle,
}: {
  option: QuestionOption;
  type: "single" | "multi";
  selected: boolean;
  onToggle: (opt: QuestionOption) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(option)}
      className={cn(
        "flex items-center gap-2.5 rounded-[10px] border px-4 py-3.5 text-left text-[0.94rem] leading-[1.35] text-[#16281F] transition-colors dark:text-[#F1EFE8]",
        selected
          ? "border-[#2F6B4F] bg-[#E7EEE8] dark:border-[#5EAB80] dark:bg-[#1E3226]"
          : "border-[#16281F]/12 bg-white hover:border-[#16281F]/22 dark:border-[#F1EFE8]/13 dark:bg-[#17251D] dark:hover:border-[#F1EFE8]/24",
      )}
    >
      <span
        className={cn(
          "flex h-[17px] w-[17px] flex-none items-center justify-center border-[1.5px]",
          type === "single" ? "rounded-full" : "rounded-[4px]",
          selected ? "border-[#2F6B4F] bg-[#2F6B4F] dark:border-[#5EAB80] dark:bg-[#5EAB80]" : "border-[#8B948E] dark:border-[#7D8B83]",
        )}
      >
        {type !== "single" && selected ? <CheckMark /> : null}
      </span>
      <span>{option.label}</span>
    </button>
  );
}

function QuestionScreen({
  question,
  picks,
  onAnswer,
  onBack,
  onContinue,
}: {
  question: Question;
  picks: QuestionOption[];
  onAnswer: (qId: string, picks: QuestionOption[]) => void;
  onBack: (() => void) | null;
  onContinue: () => void;
}) {
  const isSelected = (opt: QuestionOption) => picks.some((p) => p.label === opt.label);

  const toggle = (opt: QuestionOption) => {
    let next: QuestionOption[];
    if (question.type === "single") {
      next = [opt];
    } else if (opt.exclusive) {
      next = isSelected(opt) ? [] : [opt];
    } else {
      const withoutExclusive = picks.filter((p) => !p.exclusive);
      next = isSelected(opt) ? withoutExclusive.filter((p) => p.label !== opt.label) : withoutExclusive.concat([opt]);
    }
    onAnswer(question.id, next);
  };

  return (
    <div className="screen flex flex-1 flex-col">
      <ProgressRail current={question.n} />
      <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.24em] text-[#2F6B4F] dark:text-[#5EAB80]">{question.eyebrow}</p>
      <h1 className="mb-3 mt-2.5 font-serif text-[1.6rem] font-medium leading-[1.18] text-[#16281F] dark:text-[#F1EFE8] sm:text-3xl md:text-4xl">
        {parseEmphasis(question.headline)}
      </h1>
      <p className="mb-6 text-[0.98rem] leading-relaxed text-[#4A5B52] dark:text-[#B6C1B9]">{question.sub}</p>
      <div className={cn("mb-2 grid gap-2.5", question.type === "single" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
        {question.options.map((opt, i) => (
          <OptionCard key={i} option={opt} type={question.type} selected={isSelected(opt)} onToggle={toggle} />
        ))}
      </div>
      <NavButtons onBack={onBack} onContinue={onContinue} canContinue={picks.length > 0} />
    </div>
  );
}

function SafetyScreen({
  safety,
  onChange,
  onBack,
  onContinue,
}: {
  safety: SafetyState;
  onChange: (next: SafetyState) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const q = SAFETY_QUESTION;
  const setField = <K extends keyof SafetyState>(key: K, val: SafetyState[K]) => onChange({ ...safety, [key]: val });

  return (
    <div className="screen flex flex-1 flex-col">
      <ProgressRail current={q.n} />
      <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.24em] text-[#2F6B4F] dark:text-[#5EAB80]">{q.eyebrow}</p>
      <h1 className="mb-3 mt-2.5 font-serif text-[1.6rem] font-medium leading-[1.18] text-[#16281F] dark:text-[#F1EFE8] sm:text-3xl md:text-4xl">
        {parseEmphasis(q.headline)}
      </h1>
      <p className="mb-6 text-[0.98rem] leading-relaxed text-[#4A5B52] dark:text-[#B6C1B9]">{q.sub}</p>

      <div className="mb-6">
        <span className="mb-2.5 block text-[0.78rem] font-semibold text-[#16281F] dark:text-[#F1EFE8]">{q.age.label}</span>
        <div className="flex flex-wrap gap-2">
          {q.age.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setField("ageBracket", opt)}
              className={cn(
                "rounded-full border px-[15px] py-2 text-[0.88rem] dark:text-[#F1EFE8]",
                safety.ageBracket === opt
                  ? "border-[#2F6B4F] bg-[#E7EEE8] dark:border-[#5EAB80] dark:bg-[#1E3226]"
                  : "border-[#16281F]/12 bg-white dark:border-[#F1EFE8]/13 dark:bg-[#17251D]",
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <span className="mb-2.5 block text-[0.78rem] font-semibold text-[#16281F] dark:text-[#F1EFE8]">Any of these apply?</span>
        <div className="flex flex-col gap-2">
          {q.flags.map((f) => {
            const checked = !!safety[f.key as keyof SafetyState];
            return (
              <label
                key={f.key}
                className={cn(
                  "flex items-start gap-2.5 rounded-[9px] border px-[13px] py-[11px] text-[0.9rem] text-[#16281F] dark:text-[#F1EFE8]",
                  checked
                    ? "border-[#2F6B4F] bg-[#E7EEE8] dark:border-[#5EAB80] dark:bg-[#1E3226]"
                    : "border-[#16281F]/12 bg-white dark:border-[#F1EFE8]/13 dark:bg-[#17251D]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 h-4 w-4 flex-none rounded-[4px] border-[1.5px]",
                    checked ? "border-[#2F6B4F] bg-[#2F6B4F] dark:border-[#5EAB80] dark:bg-[#5EAB80]" : "border-[#8B948E] dark:border-[#7D8B83]",
                  )}
                />
                <input type="checkbox" className="sr-only" checked={checked} onChange={() => setField(f.key as keyof SafetyState, !checked as never)} />
                {f.label}
              </label>
            );
          })}
        </div>
      </div>

      <NavButtons onBack={onBack} onContinue={onContinue} canContinue={!!safety.ageBracket} />
    </div>
  );
}

function EmailGate({
  email,
  consentRequired,
  consentOptional,
  onEmailChange,
  onConsentRequiredChange,
  onConsentOptionalChange,
  onBack,
  onContinue,
}: {
  email: string;
  consentRequired: boolean;
  consentOptional: boolean;
  onEmailChange: (v: string) => void;
  onConsentRequiredChange: (v: boolean) => void;
  onConsentOptionalChange: (v: boolean) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const c = EMAIL_GATE_COPY;
  const validEmail = /^\S+@\S+\.\S+$/.test(email);
  return (
    <div className="screen flex flex-1 flex-col">
      <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.24em] text-[#2F6B4F] dark:text-[#5EAB80]">10 of 10 · Almost there</p>
      <h1 className="mb-3 mt-2.5 font-serif text-[1.6rem] font-medium leading-[1.18] text-[#16281F] dark:text-[#F1EFE8] sm:text-3xl md:text-4xl">
        {parseEmphasis(c.headline)}
      </h1>
      <p className="mb-6 text-[0.98rem] leading-relaxed text-[#4A5B52] dark:text-[#B6C1B9]">{c.body}</p>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="mb-4 w-full rounded-[9px] border border-[#16281F]/22 bg-white px-[15px] py-[13px] text-base text-[#16281F] focus:border-[#2F6B4F] focus:outline-none dark:border-[#F1EFE8]/24 dark:bg-[#17251D] dark:text-[#F1EFE8] dark:focus:border-[#5EAB80]"
      />
      <label
        className={cn(
          "mb-2 flex items-center gap-2.5 rounded-[9px] border px-[13px] py-[11px] text-[0.9rem] text-[#16281F] dark:text-[#F1EFE8]",
          consentRequired
            ? "border-[#2F6B4F] bg-[#E7EEE8] dark:border-[#5EAB80] dark:bg-[#1E3226]"
            : "border-[#16281F]/12 bg-white dark:border-[#F1EFE8]/13 dark:bg-[#17251D]",
        )}
      >
        <span
          className={cn(
            "h-4 w-4 flex-none rounded-[4px] border-[1.5px]",
            consentRequired ? "border-[#2F6B4F] bg-[#2F6B4F] dark:border-[#5EAB80] dark:bg-[#5EAB80]" : "border-[#8B948E] dark:border-[#7D8B83]",
          )}
        />
        <input type="checkbox" className="sr-only" checked={consentRequired} onChange={() => onConsentRequiredChange(!consentRequired)} />
        {c.consentRequired} (required)
      </label>
      <label
        className={cn(
          "mb-2 flex items-center gap-2.5 rounded-[9px] border px-[13px] py-[11px] text-[0.9rem] text-[#16281F] dark:text-[#F1EFE8]",
          consentOptional
            ? "border-[#2F6B4F] bg-[#E7EEE8] dark:border-[#5EAB80] dark:bg-[#1E3226]"
            : "border-[#16281F]/12 bg-white dark:border-[#F1EFE8]/13 dark:bg-[#17251D]",
        )}
      >
        <span
          className={cn(
            "h-4 w-4 flex-none rounded-[4px] border-[1.5px]",
            consentOptional ? "border-[#2F6B4F] bg-[#2F6B4F] dark:border-[#5EAB80] dark:bg-[#5EAB80]" : "border-[#8B948E] dark:border-[#7D8B83]",
          )}
        />
        <input type="checkbox" className="sr-only" checked={consentOptional} onChange={() => onConsentOptionalChange(!consentOptional)} />
        {c.consentOptional} (optional)
      </label>
      <NavButtons onBack={onBack} onContinue={onContinue} canContinue={validEmail && consentRequired} label={c.cta} />
    </div>
  );
}

function FeelTimeline({ timeline }: { timeline: ResultItem["timeline"] }) {
  const rows = [timeline.week1, timeline.weeks23, timeline.month1];
  return (
    <div className="flex flex-col">
      {rows.map((r, i) => (
        <div
          key={i}
          className={cn(
            "grid grid-cols-1 gap-1.5 py-4 sm:grid-cols-[130px_1fr] sm:gap-4",
            i > 0 && "border-t border-[#16281F]/12 dark:border-[#F1EFE8]/13",
          )}
        >
          <div className="text-[0.92rem] font-semibold text-[#16281F] dark:text-[#F1EFE8]">{r.heading}</div>
          <div>
            <ul className="list-disc space-y-1 pl-4">
              {r.bullets.map((b, j) => (
                <li key={j} className="text-[0.9rem] leading-[1.55] text-[#16281F] dark:text-[#F1EFE8]">
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-1.5 text-[0.84rem] text-[#2F6B4F] dark:text-[#5EAB80]">
              <span className="font-semibold">Tip — </span>
              {r.tip}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductCard({ item }: { item: ResultItem }) {
  const p = item.product;
  return (
    <div className={cn("grid grid-cols-1 gap-5 rounded-2xl border border-[#16281F]/10 bg-white p-5 dark:border-[#F1EFE8]/13 dark:bg-[#17251D] sm:grid-cols-[132px_1fr]", CARD_SHADOW)}>
      <Image src={p.image} alt={p.name} width={132} height={132} className="h-auto w-full max-w-[132px] object-contain" />
      <div>
        <div className="mb-1 flex items-center gap-2">
          <h3 className="text-[1.15rem] font-semibold text-[#16281F] dark:text-[#F1EFE8]">{p.name}</h3>
          {item.addToCartDisabled ? <span className="font-mono text-[0.72rem] text-[#A4442B] dark:text-[#D98868]">not added to cart</span> : null}
        </div>
        <div className="mb-2.5 flex items-baseline gap-2">
          <span className="font-mono text-[1.05rem] font-medium text-[#16281F] dark:text-[#F1EFE8]">{formatPrice(p.price)}</span>
          {p.compareAt ? <span className="font-mono text-[0.9rem] text-[#8B948E] line-through dark:text-[#7D8B83]">{formatPrice(p.compareAt)}</span> : null}
        </div>
        {item.bucket === "BUNDLE" ? (
          <p className="mb-2.5 text-[0.85rem] text-[#4A5B52] dark:text-[#B6C1B9]">
            R749 separately → <b className="text-[#16281F] dark:text-[#F1EFE8]">R674 bundled</b> — you save R75.
          </p>
        ) : null}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {p.forms.map((f, i) => (
            <span key={i} className="rounded-md bg-[#E7EEE8] px-2.5 py-1 font-mono text-[0.72rem] text-[#16281F] dark:bg-[#1E3226] dark:text-[#F1EFE8]">
              {f}
            </span>
          ))}
        </div>
        {item.gated ? (
          <div className="mt-3.5 rounded-[9px] border border-[#16281F]/12 bg-[#B9762F]/12 px-3.5 py-3 text-[0.86rem] leading-relaxed text-[#16281F] dark:border-[#F1EFE8]/13 dark:bg-[#DBA46A]/14 dark:text-[#F1EFE8]">
            {GATE_COPY[item.gated]}
          </div>
        ) : null}
        <div className="mt-3.5">
          <a
            href={pdpLink(p)}
            target="_blank"
            rel="noopener"
            className="text-[0.85rem] font-semibold text-[#4A5B52] hover:text-[#16281F] dark:text-[#B6C1B9] dark:hover:text-[#F1EFE8]"
          >
            {item.addToCartDisabled ? "View product page →" : "View full formula →"}
          </a>
        </div>
      </div>
    </div>
  );
}

function SupportingItem({ item }: { item: ResultItem }) {
  const p = item.product;
  let note = item.trackLine;
  if (item.isIronSafeAlternative) note = "Suggested in place of Iron+, until a ferritin test confirms low iron.";
  else if (item.redirectedFrom) note = "Recommended instead of Adaptogen+, given what you told us on the safety screen.";
  else if (item.freeDeliveryAddon) note = `Adds ${formatPrice(p.price)} — takes the order over the free-delivery threshold, saving R130 in shipping.`;
  else if (item.gated === "cellunexCaution") note = GATE_COPY.cellunexCaution;

  return (
    <div className="flex items-start gap-3.5 border-t border-[#16281F]/10 py-4 first:border-t-0 dark:border-[#F1EFE8]/13">
      <Image src={p.image} alt={p.name} width={56} height={56} className="h-14 w-14 flex-none object-contain" />
      <div>
        <h4 className="mb-1 text-base font-semibold text-[#16281F] dark:text-[#F1EFE8]">
          {p.name} · <span className="font-mono">{formatPrice(p.price)}</span>
        </h4>
        <p className="text-[0.88rem] leading-relaxed text-[#4A5B52] dark:text-[#B6C1B9]">{note}</p>
      </div>
    </div>
  );
}

function ResultScreen({ result, onRestart }: { result: QuizResult; onRestart: () => void }) {
  const primary = result.items[0];
  const supporting = result.items.slice(1);
  const bucketMeta = BUCKETS[primary.bucket as keyof typeof BUCKETS];
  const nutrientLabel = primary.bucket === "BUNDLE" ? "immunity & recovery" : bucketMeta.label;

  const activeItems = result.items.filter((i) => !i.addToCartDisabled);
  const total = activeItems.reduce((sum, i) => sum + i.product.price, 0);
  const cartLink = cartPermalink(activeItems);
  const singleCtaItem = primary.addToCartDisabled ? activeItems[0] : primary;
  const showSingleCta = activeItems.length > 1 && !!singleCtaItem;

  return (
    <div className="screen">
      <p className="mb-2 font-mono text-[0.72rem] uppercase tracking-[0.24em] text-[#8B948E] dark:text-[#7D8B83]">Your result</p>
      <h1 className="mb-4 font-serif text-[1.8rem] font-medium leading-[1.14] text-[#16281F] dark:text-[#F1EFE8] sm:text-4xl md:text-[2.5rem]">
        Your answers point most strongly to <span className="not-italic italic text-[#B9762F] dark:text-[#DBA46A]">{nutrientLabel}</span>.
      </h1>
      {result.isFallback ? <p className="mb-3 text-[0.98rem] leading-relaxed text-[#4A5B52] dark:text-[#B6C1B9]">{GATE_COPY.fallback}</p> : null}
      {result.globalCartBlocked ? (
        <div className="mb-6 rounded-xl border border-[#16281F]/12 bg-[#B9762F]/12 px-4.5 py-4 text-[0.9rem] leading-relaxed text-[#16281F] dark:border-[#F1EFE8]/13 dark:bg-[#DBA46A]/14 dark:text-[#F1EFE8]">
          {GATE_COPY.pregnancyBanner}
        </div>
      ) : null}

      <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#E7EEE8] px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-[#2F6B4F] dark:bg-[#1E3226] dark:text-[#5EAB80]">
        {primary.tier}
      </div>
      <p className="mb-8 text-[1.02rem] leading-relaxed text-[#4A5B52] dark:text-[#B6C1B9]">
        {primary.echo.length ? `You mentioned ${joinNatural(primary.echo)}. ${primary.trackLine}` : primary.trackLine}
      </p>

      <div className="my-8">
        <p className="mb-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#8B948E] dark:text-[#7D8B83]">Why, in plain terms</p>
        <p className="max-w-[62ch] text-base leading-[1.68] text-[#16281F] dark:text-[#F1EFE8]">{primary.why}</p>
      </div>

      <div className="my-8">
        <ProductCard item={primary} />
      </div>

      <div className="my-8">
        <p className="mb-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#8B948E] dark:text-[#7D8B83]">How you&apos;ll feel</p>
        <FeelTimeline timeline={primary.timeline} />
      </div>

      {supporting.length ? (
        <div className="my-8">
          <p className="mb-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#8B948E] dark:text-[#7D8B83]">Also worth knowing</p>
          {supporting.map((item, i) => (
            <SupportingItem key={i} item={item} />
          ))}
        </div>
      ) : null}

      {result.globalCartBlocked ? (
        <div className={cn("mt-8 rounded-2xl border border-[#16281F]/10 bg-white p-5 dark:border-[#F1EFE8]/13 dark:bg-[#17251D]", CARD_SHADOW)}>
          <p className="text-[0.98rem] text-[#4A5B52] dark:text-[#B6C1B9]">Speak to your doctor or midwife before starting anything new — we&apos;ve held back the cart options here.</p>
        </div>
      ) : activeItems.length === 0 ? (
        <div className={cn("mt-8 rounded-2xl border border-[#16281F]/10 bg-white p-5 dark:border-[#F1EFE8]/13 dark:bg-[#17251D]", CARD_SHADOW)}>
          <p className="text-[0.98rem] text-[#4A5B52] dark:text-[#B6C1B9]">Nothing here is added to cart automatically — see the note above for why, and what to check first.</p>
        </div>
      ) : (
        <div className={cn("sticky bottom-4 mt-8 rounded-2xl border border-[#16281F]/10 bg-white p-5 dark:border-[#F1EFE8]/13 dark:bg-[#17251D]", CARD_SHADOW)}>
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-[0.85rem] text-[#4A5B52] dark:text-[#B6C1B9]">{activeItems.length > 1 ? `Add all ${activeItems.length} to cart` : "Add to cart"}</span>
            <span className="font-mono text-xl font-semibold text-[#16281F] dark:text-[#F1EFE8]">{formatPrice(total)}</span>
          </div>
          {primary.bucket === "BUNDLE" && supporting.some((s) => s.freeDeliveryAddon) ? (
            <p className="mb-3.5 text-[0.85rem] text-[#2F6B4F] dark:text-[#5EAB80]">The stack alone is R16 under free delivery — the add-on above clears it and saves R130 in shipping.</p>
          ) : null}
          {primary.addToCartDisabled ? (
            <p className="mb-3.5 text-[0.85rem] text-[#A4442B] dark:text-[#D98868]">{primary.product.name} isn&apos;t included above — see the note on it for why.</p>
          ) : null}
          <div className="flex flex-wrap gap-2.5">
            {cartLink ? (
              <a
                href={cartLink}
                target="_blank"
                rel="noopener"
                className="rounded-lg bg-[#2F6B4F] px-5 py-[13px] text-center text-[0.95rem] font-semibold text-white transition-colors hover:bg-[#204D38] dark:bg-[#5EAB80] dark:hover:bg-[#7EC69C]"
              >
                Add all to cart — {formatPrice(total)}
              </a>
            ) : null}
            {showSingleCta ? (
              <a
                href={pdpLink(singleCtaItem.product)}
                target="_blank"
                rel="noopener"
                className="rounded-lg px-5 py-[13px] text-center text-[0.95rem] font-semibold text-[#4A5B52] hover:text-[#16281F] dark:text-[#B6C1B9] dark:hover:text-[#F1EFE8]"
              >
                Just the {singleCtaItem.product.name}
              </a>
            ) : null}
          </div>
          <p className="mt-2.5 text-[0.8rem] text-[#8B948E] dark:text-[#7D8B83]">
            10% off your first order with code <b className="font-mono text-[#16281F] dark:text-[#F1EFE8]">QUIZ10</b> at checkout.
          </p>
        </div>
      )}

      <div className="mt-10 border-t border-[#16281F]/10 pt-5 dark:border-[#F1EFE8]/13">
        <ul className="list-disc space-y-1.5 pl-4">
          {FOOTER_COPY.map((line, i) => (
            <li key={i} className="text-[0.82rem] leading-relaxed text-[#8B948E] dark:text-[#7D8B83]">
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 text-center">
        <button type="button" onClick={onRestart} className="text-[0.82rem] text-[#8B948E] underline hover:text-[#4A5B52] dark:text-[#7D8B83] dark:hover:text-[#B6C1B9]">
          Retake the quiz
        </button>
      </div>
    </div>
  );
}

export default function QuizClient() {
  const reduceMotion = useReducedMotion();
  const [isDark, setIsDark] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [safety, setSafety] = useState<SafetyState>(DEFAULT_SAFETY);
  const [email, setEmail] = useState("");
  const [consentRequired, setConsentRequired] = useState(false);
  const [consentOptional, setConsentOptional] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      // localStorage can throw in private-browsing contexts — fall back to system preference.
    }
    if (saved === "dark" || saved === "light") {
      setIsDark(saved === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
      } catch {
        // Ignore — theme just won't persist across visits in this browser context.
      }
      return next;
    });
  };

  const screenId = SCREENS[idx];

  const result = useMemo<QuizResult | null>(() => {
    if (screenId !== "result") return null;
    return buildResult(answers, safety);
  }, [screenId, answers, safety]);

  const goNext = () => {
    setIdx((i) => Math.min(i + 1, SCREENS.length - 1));
    window.scrollTo(0, 0);
  };
  const goBack = () => {
    setIdx((i) => Math.max(i - 1, 0));
    window.scrollTo(0, 0);
  };
  const restart = () => {
    setAnswers({});
    setSafety(DEFAULT_SAFETY);
    setEmail("");
    setConsentRequired(false);
    setConsentOptional(false);
    setIdx(0);
    window.scrollTo(0, 0);
  };

  const isWide = screenId === "result";

  let content: React.ReactNode;
  if (screenId === "intro") {
    content = <IntroScreen onStart={goNext} />;
  } else if (screenId === "safety") {
    content = <SafetyScreen safety={safety} onChange={setSafety} onBack={goBack} onContinue={goNext} />;
  } else if (screenId === "email") {
    content = (
      <EmailGate
        email={email}
        consentRequired={consentRequired}
        consentOptional={consentOptional}
        onEmailChange={setEmail}
        onConsentRequiredChange={setConsentRequired}
        onConsentOptionalChange={setConsentOptional}
        onBack={goBack}
        onContinue={goNext}
      />
    );
  } else if (screenId === "result" && result) {
    content = <ResultScreen result={result} onRestart={restart} />;
  } else {
    const q = QUESTIONS.find((qq) => qq.id === screenId)!;
    content = (
      <QuestionScreen
        question={q}
        picks={answers[q.id] || []}
        onAnswer={(qId, picks) => setAnswers((prev) => ({ ...prev, [qId]: picks }))}
        onBack={idx > 0 ? goBack : null}
        onContinue={goNext}
      />
    );
  }

  const variants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: scrollEase } },
  };

  return (
    <div className={cn(isDark && "dark")}>
      {/* Tailwind's darkMode:"class" selector is `.dark *` — a strict descendant
          match — so the `dark` marker class must live on an ancestor of every
          `dark:` utility, never the same element as one. Hence this extra,
          otherwise-unstyled wrapper. */}
      <div className="min-h-[calc(100vh-1px)] bg-[#FBFAF7] px-5 py-8 dark:bg-[#0F1A14]" style={{ colorScheme: isDark ? "dark" : "light" }}>
        <div className={cn("mx-auto flex min-h-[70vh] w-full flex-col", isWide ? "max-w-[760px]" : "max-w-[640px]")}>
          <BrandRow isDark={isDark} onToggleTheme={toggleTheme} />
          {screenId !== "result" ? <LeafDecoration /> : null}
          <AnimatePresence mode="wait">
            <motion.div key={screenId} initial="hidden" animate="visible" variants={variants} className="flex flex-1 flex-col">
              {content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
