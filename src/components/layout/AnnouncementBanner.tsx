"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/uiStore";

const MESSAGES = [
  { label: "Free shipping", detail: "on orders over R690 · South Africa-wide" },
  { label: "30-day guarantee", detail: "no questions asked, ever" },
  { label: "4.9★ · 15 000+", detail: "South Africans trust NutriZen" },
];

// Desktop 4-segment layout matching the screenshot
const DESKTOP_SEGMENTS = [
  { text: "R130 Flat-Rate Delivery", highlight: false },
  { text: "Clean Label · Full Disclosure", highlight: false },
  { text: "30-Day Guarantee", highlight: true },
  { text: "No Questions Asked, Ever", highlight: false },
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
          <div className="relative flex h-9 items-center justify-center overflow-hidden bg-[#0A1A10]">
            {/* Shimmer sweep */}
            <motion.div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#D9E8C4]/[0.05] to-transparent"
              animate={{ x: ["-100%", "220%"] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "linear", repeatDelay: 3.2 }}
              aria-hidden
            />

            {/* Desktop: 4 static segments with dividers */}
            <div className="hidden lg:flex items-center justify-center w-full h-full divide-x divide-white/[0.12]">
              {DESKTOP_SEGMENTS.map((seg) => (
                <div key={seg.text} className="flex-1 flex items-center justify-center px-4">
                  <span
                    className={`font-mono text-[9.5px] uppercase tracking-[0.28em] ${
                      seg.highlight ? "text-[#E7A46C] font-semibold" : "text-white/45"
                    }`}
                  >
                    {seg.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile: rotating message */}
            <div className="lg:hidden flex items-center justify-center px-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={msgIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="flex items-center gap-2.5"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#D9E8C4]">
                    {MESSAGES[msgIndex].label}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.06em] text-white/30" aria-hidden>—</span>
                  <span className="font-mono text-[10px] tracking-[0.08em] text-white/45">
                    {MESSAGES[msgIndex].detail}
                  </span>
                </motion.div>
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

            {/* Bottom rule */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.06]" aria-hidden />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
