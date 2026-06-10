"use client";

import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { createShopifyCheckout } from "@/app/actions/checkout";
import { formatPrice } from "@/lib/formatPrice";
import { ShippingProgressCart } from "@/components/ui/ShippingProgressBar";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeFromCart,
    shopifyCheckoutUrl,
    setShopifyCart,
  } = useCartStore();

  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Use a stable currency from the first cart item, fallback to ZAR
  const displayCurrency = items[0]?.currencyCode ?? "ZAR";

  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );

  async function handleCheckout() {
    setCheckingOut(true);
    setCheckoutError(null);

    try {
      // Reuse cached checkout URL if the cart hasn't changed since it was created
      if (shopifyCheckoutUrl) {
        window.location.href = shopifyCheckoutUrl;
        return;
      }

      const result = await createShopifyCheckout(items);

      if (result) {
        setShopifyCart(result.cartId, result.checkoutUrl);
        window.location.href = result.checkoutUrl;
      } else {
        setCheckoutError(
          "Checkout is temporarily unavailable. Please try again or contact support.",
        );
        setCheckingOut(false);
      }
    } catch {
      setCheckoutError("Something went wrong. Please try again.");
      setCheckingOut(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-neutral-darkest/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-background-main shadow-2xl z-50 flex flex-col border-l border-neutral-light"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-light bg-white">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-neutral-darkest tracking-tight">
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">
                    {items.reduce((n, i) => n + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 hover:bg-neutral-light rounded-full transition-colors text-neutral-dark"
                aria-label="Close cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto p-6 bg-background-main">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-dark space-y-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-neutral-light"
                  >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <p className="font-medium">Your cart is empty.</p>
                  <Button variant="outline" onClick={closeCart}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const lineTotal = formatPrice(
                        String(parseFloat(item.price) * item.quantity),
                        item.currencyCode ?? displayCurrency,
                      );
                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                          className="flex gap-4 p-4 bg-white rounded-2xl border border-neutral-light/50"
                        >
                          {/* Product image */}
                          <div className="w-20 h-24 flex-shrink-0 rounded-xl border border-neutral-light overflow-hidden bg-background-alt relative">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-contain p-2"
                                sizes="80px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-light text-xs">
                                —
                              </div>
                            )}
                          </div>

                          <div className="flex-grow flex flex-col pt-1 min-w-0">
                            <div className="flex justify-between items-start mb-1 gap-2">
                              <h3 className="font-bold text-neutral-darkest leading-tight text-sm">
                                {item.title}
                              </h3>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-neutral-dark hover:text-red-500 transition-colors flex-shrink-0"
                                aria-label={`Remove ${item.title}`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="15"
                                  height="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                              </button>
                            </div>

                            <p className="text-primary font-semibold text-sm mb-3">
                              {lineTotal}
                            </p>

                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex items-center border border-neutral-light rounded-xl overflow-hidden">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="w-8 h-8 flex items-center justify-center bg-background-alt hover:bg-neutral-light text-neutral-darkest font-medium transition"
                                  aria-label="Decrease quantity"
                                >
                                  −
                                </button>
                                <span className="w-8 text-center text-sm font-semibold">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="w-8 h-8 flex items-center justify-center bg-background-alt hover:bg-neutral-light text-neutral-darkest font-medium transition"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-xs text-neutral-dark">
                                {formatPrice(item.price, item.currencyCode ?? displayCurrency)} each
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-light bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                {/* Subtotal */}
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-neutral-dark">Subtotal</span>
                  <span className="font-bold text-xl text-neutral-darkest">
                    {formatPrice(total.toFixed(2), displayCurrency)}
                  </span>
                </div>

                {/* Shipping progress */}
                <ShippingProgressCart />

                <p className="text-xs text-neutral-dark mb-5">
                  Taxes calculated at checkout.
                </p>

                {checkoutError && (
                  <p className="text-sm text-red-500 mb-4 text-center rounded-xl bg-red-50 py-2 px-3">
                    {checkoutError}
                  </p>
                )}

                <Button
                  fullWidth
                  size="lg"
                  onClick={handleCheckout}
                  disabled={checkingOut}
                >
                  {checkingOut ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Redirecting to checkout…
                    </span>
                  ) : (
                    "Checkout Securely"
                  )}
                </Button>

                {/* Trust signals */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <span className="flex items-center gap-1 text-xs text-neutral-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Secure checkout
                  </span>
                  <span className="flex items-center gap-1 text-xs text-neutral-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
                    Powered by Shopify
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
