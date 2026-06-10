"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";

const THRESHOLD = 690;

function getMessage(remaining: number, progress: number): string {
  if (progress === 0) return `Spend R${THRESHOLD} to unlock free shipping`;
  if (remaining <= 0) return "You've unlocked free shipping! 🎉";
  if (progress >= 0.85) return `Only R${remaining.toFixed(0)} away — almost there!`;
  if (progress >= 0.5) return `Getting close! R${remaining.toFixed(0)} more for free shipping`;
  return `Add R${remaining.toFixed(0)} more to qualify for free shipping`;
}

/** Compact ribbon shown at the top of the product detail page */
export function ShippingProgressBanner() {
  const items = useCartStore((s) => s.items);
  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const progress = Math.min(1, total / THRESHOLD);
  const remaining = Math.max(0, THRESHOLD - total);
  const qualified = progress >= 1;
  const message = getMessage(remaining, progress);

  return (
    <motion.div
      layout
      className={`relative overflow-hidden rounded-2xl border px-4 py-3 mb-5 transition-colors duration-500 ${
        qualified
          ? "border-primary/40 bg-primary/8 bg-[rgba(var(--color-primary-rgb),0.06)]"
          : "border-neutral-light/80 bg-white/70"
      }`}
      style={{ backdropFilter: "blur(8px)" }}
    >
      {/* Animated fill layer */}
      <motion.div
        className="absolute inset-0 origin-left bg-primary/5 rounded-2xl"
        initial={false}
        animate={{ scaleX: progress }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left center" }}
      />

      <div className="relative flex items-center gap-3">
        {/* Icon */}
        <AnimatePresence mode="wait">
          {qualified ? (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm"
              aria-hidden
            >
              ✓
            </motion.span>
          ) : (
            <motion.span
              key="truck"
              initial={{ x: -4, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 4, opacity: 0 }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-light/60 text-base"
              aria-hidden
            >
              🚚
            </motion.span>
          )}
        </AnimatePresence>

        {/* Text + bar */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.p
              key={qualified ? "done" : Math.floor(progress * 10)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className={`text-xs font-semibold leading-tight mb-1.5 ${
                qualified ? "text-primary" : "text-neutral-darkest"
              }`}
            >
              {message}
            </motion.p>
          </AnimatePresence>

          {/* Progress track */}
          <div className="relative h-1.5 w-full rounded-full bg-neutral-light/70 overflow-visible">
            <motion.div
              className={`h-full rounded-full ${
                qualified
                  ? "bg-primary"
                  : progress >= 0.85
                  ? "bg-amber-400"
                  : "bg-primary/70"
              }`}
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Truck dot that rides the bar */}
            {!qualified && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-white border-2 border-primary shadow-sm"
                initial={false}
                animate={{ left: `${Math.max(4, progress * 100)}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </div>
        </div>

        {/* Percentage label */}
        {!qualified && (
          <span className="shrink-0 text-xs font-bold tabular-nums text-neutral-dark">
            {Math.round(progress * 100)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}

/** Fuller bar used inside the cart drawer */
export function ShippingProgressCart() {
  const items = useCartStore((s) => s.items);
  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const progress = Math.min(1, total / THRESHOLD);
  const remaining = Math.max(0, THRESHOLD - total);
  const qualified = progress >= 1;
  const message = getMessage(remaining, progress);

  return (
    <motion.div layout className="mb-3">
      <AnimatePresence mode="wait">
        {qualified ? (
          <motion.div
            key="qualified"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/25 px-3 py-2.5"
          >
            <motion.span
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }}
              className="text-lg"
              aria-hidden
            >
              🎉
            </motion.span>
            <div>
              <p className="text-xs font-bold text-primary leading-tight">Free shipping unlocked!</p>
              <p className="text-[11px] text-primary/70 leading-tight">Your order ships free across South Africa</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-background-alt border border-neutral-light/60 px-3 pt-2.5 pb-3"
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm" aria-hidden>🚚</span>
                <p className="text-xs font-semibold text-neutral-darkest leading-tight">{message}</p>
              </div>
              <span className="text-[11px] font-bold tabular-nums text-primary">
                {Math.round(progress * 100)}%
              </span>
            </div>

            {/* Track */}
            <div className="relative h-2 w-full rounded-full bg-neutral-light overflow-visible">
              {/* Fill */}
              <motion.div
                className={`h-full rounded-full transition-colors duration-300 ${
                  progress >= 0.85 ? "bg-amber-400" : "bg-primary"
                }`}
                initial={false}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Sliding truck */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                initial={false}
                animate={{ left: `${Math.max(6, progress * 100)}%` }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  animate={progress >= 0.85 ? { y: [0, -2, 0, -2, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="h-5 w-5 rounded-full bg-white border-2 border-primary shadow flex items-center justify-center text-[10px]"
                  aria-hidden
                >
                  🚚
                </motion.div>
              </motion.div>
            </div>

            {/* Threshold label */}
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-neutral-dark">R0</span>
              <span className="text-[10px] text-neutral-dark font-medium">Free shipping at R{THRESHOLD}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
