"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/uiStore";

const MESSAGES = [
  { label: "Free shipping", detail: "on orders over R690 · South Africa-wide" },
  { label: "30-day guarantee", detail: "no questions asked, ever" },
  { label: "4.9★ · 15 000+", detail: "South Africans trust NutriZen" },
];

export default function AnnouncementBanner() {
  const { bannerVisible, dismissBanner } = useUIStore();
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!bannerVisible) return;
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(id);
  }, [bannerVisible]);

  return (
    <AnimatePresence initial={false}>
      {bannerVisible && (
        <motion.div
          key="announcement-banner"
          initial={{ height: 36, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.32, 0, 0.16, 1] }}
          className="fixed inset-x-0 top-0 z-[60] overflow-hidden"
        >
          <div className="relative flex h-9 items-center justify-center overflow-hidden bg-ink-deep">
            {/* Shimmer sweep */}
            <motion.div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-glow/[0.07] to-transparent"
              animate={{ x: ["-100%", "220%"] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "linear", repeatDelay: 3.2 }}
              aria-hidden
            />

            {/* Side trust signals — desktop only */}
            <div className="absolute left-4 hidden items-center gap-4 lg:flex" aria-hidden>
              <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-glow/30">
                R130 flat-rate delivery
              </span>
              <span className="h-px w-6 bg-glow/15" />
              <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-glow/30">
                Clean label · full disclosure
              </span>
            </div>

            {/* Center rotating message */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={msgIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="flex items-center gap-2.5 px-8"
              >
                <span className="hidden h-px w-5 bg-glow/35 sm:block" aria-hidden />
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-glow">
                  {MESSAGES[msgIndex].label}
                </span>
                <span
                  className="font-mono text-[10px] tracking-[0.06em] text-glow/45"
                  aria-hidden
                >
                  —
                </span>
                <span className="font-mono text-[10px] tracking-[0.08em] text-white/50">
                  {MESSAGES[msgIndex].detail}
                </span>
                <span className="hidden h-px w-5 bg-glow/35 sm:block" aria-hidden />
              </motion.div>
            </AnimatePresence>

            {/* Dismiss */}
            <button
              onClick={dismissBanner}
              aria-label="Dismiss announcement"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-glow/30 transition-colors hover:text-glow/75"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            {/* Bottom rule */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-glow/[0.07]" aria-hidden />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
