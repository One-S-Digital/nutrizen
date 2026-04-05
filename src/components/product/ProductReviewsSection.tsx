"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PdpProductReview } from "@/lib/shopify-pdp-meta";

type Props = {
  reviews: PdpProductReview[];
};

const REVIEWS_PER_PAGE = 6;

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "h-6 w-6" : size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn(sz, i < rating ? "text-amber-500" : "text-neutral-light")}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function averageRating(reviews: PdpProductReview[]): number {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

function ratingCounts(reviews: PdpProductReview[]): Record<number, number> {
  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    const k = Math.min(5, Math.max(1, Math.round(r.rating)));
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}

export function ProductReviewsSection({ reviews }: Props) {
  const [shown, setShown] = useState(REVIEWS_PER_PAGE);

  if (!reviews.length) return null;

  const avg = averageRating(reviews);
  const counts = ratingCounts(reviews);
  const visibleReviews = reviews.slice(0, shown);

  return (
    <section className="rounded-[1.25rem] border border-neutral-light/80 bg-white p-6 shadow-sm md:p-10">
      <h2 className="mb-8 font-serif text-2xl font-bold text-neutral-darkest md:text-3xl">Reviews</h2>

      <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-start">
        {/* Average score */}
        <div className="flex flex-col items-center rounded-2xl border border-neutral-light bg-background-alt px-8 py-6 text-center md:min-w-[160px]">
          <span className="text-5xl font-bold text-neutral-darkest">{avg.toFixed(1)}</span>
          <StarRating rating={Math.round(avg)} size="md" />
          <span className="mt-2 text-sm text-neutral-dark">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Rating breakdown */}
        <div className="flex-1 space-y-2">
          {([5, 4, 3, 2, 1] as const).map((star) => {
            const count = counts[star] ?? 0;
            const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-5 text-right text-sm font-semibold text-neutral-dark">{star}</span>
                <svg className="h-4 w-4 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-light">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm text-neutral-dark">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual review cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleReviews.map((review, i) => (
          <article
            key={i}
            className="flex flex-col rounded-2xl border border-neutral-light bg-background-alt p-5 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-neutral-darkest">{review.author}</p>
                {review.date ? (
                  <p className="text-xs text-neutral-dark">{formatDate(review.date)}</p>
                ) : null}
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="flex-1 text-sm leading-relaxed text-neutral-dark">{review.body}</p>
          </article>
        ))}
      </div>

      {shown < reviews.length ? (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + REVIEWS_PER_PAGE)}
            className="rounded-full border border-neutral-dark/20 bg-white px-6 py-3 text-sm font-semibold text-neutral-darkest transition hover:bg-background-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Load more reviews
          </button>
        </div>
      ) : null}
    </section>
  );
}
