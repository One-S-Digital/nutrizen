"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Only show on a genuine fresh page load — not on browser back/forward
    // and not if the popup already fired earlier in this tab session.
    const navEntries = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    const navType = navEntries[0]?.type; // 'navigate' | 'reload' | 'back_forward' | 'prerender'

    // Back/forward cache hit → skip
    if (navType === "back_forward") return;

    // Already shown during this tab session → skip
    if (sessionStorage.getItem("nz_welcome_shown")) return;

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem("nz_welcome_shown", "1");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem("nz_welcome_shown", "1");
  }

  function copyCode() {
    const code = "WELCOME10";

    const succeed = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(succeed).catch(() => fallbackCopy(code, succeed));
    } else {
      fallbackCopy(code, succeed);
    }
  }

  function fallbackCopy(text: string, onSuccess: () => void) {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.appendChild(el);
    el.focus();
    el.select();
    try {
      if (document.execCommand("copy")) onSuccess();
    } finally {
      document.body.removeChild(el);
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Full-viewport flex wrapper handles centering + safe spacing */}
          <motion.div
            key="welcome-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-neutral-darkest/50 backdrop-blur-sm z-[80] flex items-center justify-center p-6 sm:p-10"
            onClick={dismiss}
          >
          <motion.div
            key="welcome-modal"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[81] w-full max-w-[460px] max-h-[calc(100vh-5rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Green accent top bar */}
              <div className="h-1.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

              <div className="p-8">
                <button
                  onClick={dismiss}
                  aria-label="Close"
                  className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-dark hover:bg-neutral-light transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>

                {/* Logo */}
                <div className="flex justify-center mb-4">
                  <Image
                    src="/nutrizen-logo.png"
                    alt="NutriZen"
                    width={160}
                    height={40}
                    className="h-10 w-auto"
                  />
                </div>

                <h2 className="text-2xl font-bold text-neutral-darkest text-center mb-1">
                  Welcome to NutriZen
                </h2>
                <p className="text-neutral-dark text-center text-sm mb-6">
                  Premium supplements, transparent ingredients, delivered to your door.
                </p>

                {/* Offer box */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-center mb-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Welcome offer</p>
                  <p className="text-3xl font-extrabold text-neutral-darkest mb-2">10% off</p>
                  <p className="text-sm text-neutral-dark mb-3">your first order — use code at checkout:</p>
                  <button
                    onClick={copyCode}
                    className="group inline-flex items-center gap-2 bg-white border-2 border-primary/30 hover:border-primary rounded-xl px-5 py-2 font-mono font-bold text-primary text-lg tracking-widest transition-all"
                    aria-label="Copy promo code WELCOME10"
                  >
                    WELCOME10
                    <span className="text-xs font-sans font-normal text-neutral-dark group-hover:text-primary transition-colors">
                      {copied ? "Copied!" : "Copy"}
                    </span>
                  </button>
                </div>

                <Link
                  href="/shop"
                  onClick={dismiss}
                  className="block w-full text-center bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-2xl transition-colors text-sm"
                >
                  Shop now →
                </Link>

                <button
                  onClick={dismiss}
                  className="block w-full text-center text-xs text-neutral-dark hover:text-neutral-darkest mt-3 transition-colors"
                >
                  No thanks, I&apos;ll pay full price
                </button>
              </div>
            </div>
          </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
