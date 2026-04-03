"use client";

import { useId, useState } from "react";
import { ChevronDown, Leaf, MessageCircle, Sparkles } from "lucide-react";

const INGREDIENT_PREVIEW_COUNT = 3;
import { Button } from "@/components/ui/button";
import type { PdpFeaturedReview, PdpIngredientEntry } from "@/lib/shopify-pdp-meta";
import { cn } from "@/lib/utils";

type Props = {
  featuredReview: PdpFeaturedReview | null;
  ingredientEntries: PdpIngredientEntry[];
  directionsSummary: string | null;
  directionsFull: string | null;
};

function Stars() {
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-4 w-4 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function ProductInfoStrip({ featuredReview, ingredientEntries, directionsSummary, directionsFull }: Props) {
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const ingredientsPanelId = useId();
  const directionsPanelId = useId();

  const showReview = Boolean(featuredReview?.quote && featuredReview?.author);
  const showIngredients = ingredientEntries.length > 0;
  const showDirections = Boolean(directionsSummary?.trim() || directionsFull?.trim());

  if (!showReview && !showIngredients && !showDirections) return null;

  const columnCount = [showReview, showIngredients, showDirections].filter(Boolean).length;

  return (
    <section
      className="rounded-[1.25rem] border border-neutral-light/80 bg-[#F9F7F2] p-6 shadow-sm md:p-10"
      aria-label="Product highlights"
    >
      <div
        className={cn(
          "grid gap-8",
          columnCount === 3 && "lg:grid-cols-3",
          columnCount === 2 && "md:grid-cols-2",
          columnCount === 1 && "mx-auto max-w-2xl",
        )}
      >
        {showReview && featuredReview ? (
          <article className="flex flex-col rounded-2xl border border-white/80 bg-white/90 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-neutral-darkest">
              <MessageCircle className="h-5 w-5 text-primary" aria-hidden />
              <h2 className="font-serif text-lg font-semibold tracking-tight">Reviews</h2>
            </div>
            <Stars />
            <blockquote className="mt-4 flex-1 font-serif text-base leading-relaxed text-neutral-darkest">
              “{featuredReview.quote}”
            </blockquote>
            <footer className="mt-6 border-t border-neutral-light/80 pt-4">
              <p className="font-semibold text-neutral-darkest">{featuredReview.author}</p>
              {featuredReview.customerSince ? (
                <p className="text-sm text-neutral-dark">Customer since {featuredReview.customerSince}</p>
              ) : null}
            </footer>
          </article>
        ) : null}

        {showIngredients ? (
          <article className="flex flex-col rounded-2xl border border-white/80 bg-[#F9F7F2] p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3 text-neutral-darkest">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary"
                aria-hidden
              >
                <Leaf className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h2 className="font-serif text-xl font-semibold tracking-tight">Ingredients</h2>
            </div>
            <ul className="space-y-3" id={ingredientsPanelId}>
              {(ingredientsOpen ? ingredientEntries : ingredientEntries.slice(0, INGREDIENT_PREVIEW_COUNT)).map(
                (ing, i) => (
                  <li
                    key={`${ing.commonName}-${i}`}
                    className="flex gap-3 rounded-2xl border border-neutral-light/90 bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(47,58,51,0.06)]"
                  >
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2d7a4f]"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-[15px] font-bold leading-snug text-neutral-darkest">{ing.commonName}</p>
                      {ing.botanicalName ? (
                        <p className="mt-0.5 font-sans text-sm italic leading-snug text-neutral-dark">{ing.botanicalName}</p>
                      ) : null}
                    </div>
                  </li>
                ),
              )}
            </ul>
            {ingredientEntries.length > INGREDIENT_PREVIEW_COUNT ? (
              <button
                type="button"
                aria-expanded={ingredientsOpen}
                aria-controls={ingredientsPanelId}
                onClick={() => setIngredientsOpen((o) => !o)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#1e3d32] py-3.5 pl-6 pr-5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-sm transition hover:bg-[#173028] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3d32] focus-visible:ring-offset-2"
              >
                {ingredientsOpen ? "Show less" : `Show all ${ingredientEntries.length} ingredients`}
                <ChevronDown
                  className={cn("h-4 w-4 shrink-0 text-white transition", ingredientsOpen && "rotate-180")}
                  aria-hidden
                />
              </button>
            ) : null}
          </article>
        ) : null}

        {showDirections ? (
          <article className="flex flex-col rounded-2xl border border-amber-100/80 bg-[#FFF9E6]/90 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-neutral-darkest">
              <Sparkles className="h-5 w-5 text-amber-800" aria-hidden />
              <h2 className="font-serif text-lg font-semibold tracking-tight">Directions &amp; usage</h2>
            </div>
            {directionsSummary ? (
              <p className="text-sm leading-relaxed text-neutral-darkest">{directionsSummary}</p>
            ) : null}
            {directionsFull ? (
              <>
                <div
                  id={directionsPanelId}
                  className={cn(
                    "text-sm leading-relaxed text-neutral-dark",
                    directionsSummary && !directionsOpen && "hidden",
                    !directionsSummary && !directionsOpen && "line-clamp-4",
                    (directionsOpen || !directionsSummary) && "mt-3 whitespace-pre-line",
                    directionsSummary && directionsOpen && "border-t border-amber-200/50 pt-3",
                  )}
                >
                  {directionsFull}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full border-neutral-darkest/20 bg-primary text-primary-foreground hover:bg-primary/90"
                  aria-expanded={directionsOpen}
                  onClick={() => setDirectionsOpen((o) => !o)}
                >
                  {directionsOpen ? "Read less" : "Read more"}
                  <ChevronDown className={cn("ml-2 h-4 w-4 transition", directionsOpen && "rotate-180")} />
                </Button>
              </>
            ) : null}
          </article>
        ) : null}
      </div>
    </section>
  );
}
