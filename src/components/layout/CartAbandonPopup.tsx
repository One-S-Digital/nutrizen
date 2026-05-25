"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/formatPrice";

const STORAGE_KEY = "nutrizen-cart-abandon-shown";

export default function CartAbandonPopup() {
  const [visible, setVisible] = useState(false);
  const shownRef = useRef(false);
  const { items, openCart, closeCart } = useCartStore();

  const hasItems = items.length > 0;
  const displayCurrency = items[0]?.currencyCode ?? "ZAR";
  const total = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  useEffect(() => {
    if (!hasItems) return;

    // Only trigger once per session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    function onMouseLeave(e: MouseEvent) {
      if (e.clientY > 20) return;
      if (shownRef.current) return;
      if (!hasItems) return;
      if (sessionStorage.getItem(STORAGE_KEY)) return;

      shownRef.current = true;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setVisible(true);
    }

    document.addEventListener("mouseleave", onMouseLeave);
    return () => document.removeEventListener("mouseleave", onMouseLeave);
  }, [hasItems]);

  function dismiss() {
    setVisible(false);
  }

  function handleCheckout() {
    dismiss();
    closeCart();
    // Small delay so the popup closes before the cart drawer opens
    setTimeout(() => openCart(), 150);
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="abandon-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-neutral-darkest/50 backdrop-blur-sm z-[80]"
            onClick={dismiss}
          />

          <motion.div
            key="abandon-modal"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-[81] w-full sm:w-[min(100vw-2rem,440px)]"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-amber-400/60 via-amber-400 to-amber-400/60" />

              <div className="p-7">
                <button
                  onClick={dismiss}
                  aria-label="Close"
                  className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-dark hover:bg-neutral-light transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500" aria-hidden>
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                      <path d="M3 6h18"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-neutral-darkest text-center mb-1">
                  Your cart misses you!
                </h2>
                <p className="text-neutral-dark text-center text-sm mb-5">
                  You left {items.reduce((n, i) => n + i.quantity, 0)} item{items.reduce((n, i) => n + i.quantity, 0) !== 1 ? "s" : ""} behind. Complete your order and start your wellness journey.
                </p>

                {/* Cart items preview */}
                <div className="bg-background-main rounded-2xl p-3 mb-5 space-y-2 max-h-36 overflow-y-auto">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-neutral-darkest font-medium truncate mr-3">{item.title}</span>
                      <span className="text-neutral-dark shrink-0">
                        {item.quantity} × {formatPrice(item.price, item.currencyCode ?? displayCurrency)}
                      </span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-xs text-neutral-dark text-center">+{items.length - 3} more item{items.length - 3 !== 1 ? "s" : ""}</p>
                  )}
                </div>

                <div className="flex justify-between items-center mb-5 px-1">
                  <span className="text-sm text-neutral-dark">Total</span>
                  <span className="font-bold text-neutral-darkest">{formatPrice(total.toFixed(2), displayCurrency)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="block w-full text-center bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-2xl transition-colors text-sm mb-3"
                >
                  Complete my order →
                </button>

                <button
                  onClick={dismiss}
                  className="block w-full text-center text-xs text-neutral-dark hover:text-neutral-darkest transition-colors"
                >
                  Continue browsing
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
