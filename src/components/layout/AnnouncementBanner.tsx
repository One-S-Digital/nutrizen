"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/uiStore";

const MESSAGES: React.ReactNode[] = [
  <><strong className="font-bold">Free shipping</strong> on orders over R690</>,
  <>R130 flat-rate delivery <strong className="font-bold">nationwide</strong></>,
  <>Premium natural supplements — transparent ingredients</>,
];

export default function AnnouncementBanner() {
  const { bannerVisible, dismissBanner } = useUIStore();
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!bannerVisible) return;
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 4000);
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
          <div className="h-9 bg-primary flex items-center justify-center px-8 relative">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={msgIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-white text-xs font-medium tracking-wide text-center"
              >
                {MESSAGES[msgIndex]}
              </motion.p>
            </AnimatePresence>

            <button
              onClick={dismissBanner}
              aria-label="Dismiss banner"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-1 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
