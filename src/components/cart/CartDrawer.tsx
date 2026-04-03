"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeFromCart } = useCartStore();

  const total = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

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
              <h2 className="text-xl font-bold text-neutral-darkest tracking-tight">Your Cart</h2>
              <button onClick={closeCart} className="p-2 -mr-2 hover:bg-neutral-light rounded-full transition-colors text-neutral-dark">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto p-6 bg-background-main">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-dark space-y-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-light"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  <p>Your cart is empty.</p>
                  <Button variant="outline" onClick={closeCart}>Continue Shopping</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-neutral-light/50">
                      <div className="w-20 h-24 bg-background-alt rounded-xl border border-neutral-light flex-shrink-0"></div>
                      <div className="flex-grow flex flex-col pt-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-neutral-darkest leading-tight pr-4">{item.title}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-neutral-dark hover:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </div>
                        <p className="text-neutral-dark text-sm mb-4">R {item.price} ZAR</p>
                        <div className="mt-auto flex items-center gap-4">
                          <div className="flex items-center border border-neutral-light rounded-xl overflow-hidden">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 bg-background-alt hover:bg-neutral-light text-neutral-darkest font-medium transition">-</button>
                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 bg-background-alt hover:bg-neutral-light text-neutral-darkest font-medium transition">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-light bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-medium text-neutral-dark text-lg">Subtotal</span>
                  <span className="font-bold text-2xl text-neutral-darkest">R {total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-neutral-dark mb-6 text-center">Shipping and taxes calculated at checkout.</p>
                <Button fullWidth size="lg">Checkout Securely</Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
