"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/uiStore";

const MESSAGES = [
  "R130 Flat-Rate Delivery",
  "30-Day Guarantee",
  "Nationwide Shipping in South Africa",
];

function getItem(activeIndex: number, offset: number) {
  return MESSAGES[(activeIndex + offset + MESSAGES.length) % MESSAGES.length];
}

export default function AnnouncementBanner() {
  const { bannerVisible, dismissBanner } = useUIStore();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!bannerVisible) return;
    const id = setInterval(() => setActive((i) => (i + 1) % MESSAGES.length), 3800);
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
          <div className="relative flex h-9 items-center justify-center overflow-hidden bg-[#0A1A10]">

            {/* Desktop: 3-slot with transitioning centre */}
            <div className="hidden lg:grid grid-cols-3 w-full h-full divide-x divide-white/[0.10]">
              {/* Left slot */}
              <div className="flex items-center justify-center px-6 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={`left-${active}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-white/50 whitespace-nowrap"
                  >
                    {getItem(active, -1)}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Centre slot — copper */}
              <div className="flex items-center justify-center px-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={`center-${active}`}
                    initial={{ opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -7 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.26em] text-[#D89455] whitespace-nowrap"
                  >
                    {MESSAGES[active]}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Right slot */}
              <div className="flex items-center justify-center px-6 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={`right-${active}`}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-white/50 whitespace-nowrap"
                  >
                    {getItem(active, 1)}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile: single rotating message */}
            <div className="lg:hidden flex items-center justify-center px-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={active}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#D9E8C4]"
                >
                  {MESSAGES[active]}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Dismiss */}
            <button
              onClick={dismissBanner}
              aria-label="Dismiss announcement"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-white/25 transition-colors hover:text-white/60"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>

            <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.06]" aria-hidden />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
