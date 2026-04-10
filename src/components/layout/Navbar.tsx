"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import type { NavCollection, FooterNavLink } from "@/lib/shopify";

type NavbarProps = {
  collections?: NavCollection[];
  mainMenuLinks?: FooterNavLink[];
};

export default function Navbar({ collections = [], mainMenuLinks = [] }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const shopLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { openCart, items } = useCartStore();
  const pathname = usePathname();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const openShop = () => {
    if (shopLeaveTimer.current) clearTimeout(shopLeaveTimer.current);
    setShopOpen(true);
  };
  const closeShopDelayed = () => {
    if (shopLeaveTimer.current) clearTimeout(shopLeaveTimer.current);
    shopLeaveTimer.current = setTimeout(() => setShopOpen(false), 160);
  };

  // Build dropdown items: prefer main-menu links (already /shop?collection= normalised),
  // fall back to raw nav collections.
  const dropdownItems: { id: string; title: string; href: string; imageUrl?: string | null }[] =
    mainMenuLinks.length > 0
      ? mainMenuLinks.map((l) => {
          const handleMatch = l.href.match(/[?&]collection=([^&]+)/);
          const handle = handleMatch ? decodeURIComponent(handleMatch[1]!) : null;
          const matched = handle ? collections.find((c) => c.handle === handle) : null;
          return { id: l.id, title: l.title, href: l.href, imageUrl: matched?.imageUrl ?? null };
        })
      : collections.map((c) => ({
          id: c.id,
          title: c.title,
          href: `/shop?collection=${encodeURIComponent(c.handle)}`,
          imageUrl: c.imageUrl,
        }));

  const secondaryLinks = [
    { href: "/pages/about", label: "Our Story" },
    { href: "/pages/science", label: "The Science" },
  ];

  return (
    <>
      {/* Outer header */}
      <header className="fixed inset-x-0 top-0 z-50 pointer-events-none flex justify-center">
        <motion.div
          className="pointer-events-auto w-full"
          animate={
            isScrolled
              ? { maxWidth: "58rem", marginTop: 12, borderRadius: 9999 }
              : { maxWidth: 1280, marginTop: 0, borderRadius: 0 }
          }
          transition={{ duration: 0.45, ease: [0.32, 0, 0.16, 1] }}
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <motion.div
            animate={
              isScrolled
                ? {
                    backgroundColor: "rgba(247,249,246,0.92)",
                    boxShadow: "0 8px 32px -4px rgba(47,58,51,0.14), 0 0 0 1px rgba(47,58,51,0.07)",
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 10,
                    paddingBottom: 10,
                  }
                : {
                    backgroundColor: "rgba(247,249,246,0)",
                    boxShadow: "0 0 0 0 transparent",
                    paddingLeft: 24,
                    paddingRight: 24,
                    paddingTop: 20,
                    paddingBottom: 20,
                  }
            }
            transition={{ duration: 0.45, ease: [0.32, 0, 0.16, 1] }}
            style={{
              borderRadius: "inherit",
              backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
              WebkitBackdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
            }}
          >
            <div className="grid grid-cols-3 items-center gap-4">
              {/* LEFT: nav */}
              <div className="justify-self-start flex items-center gap-1 min-w-0">
                {/* Mobile hamburger */}
                <button
                  type="button"
                  className="md:hidden p-2 -ml-1 rounded-lg text-neutral-dark hover:bg-neutral-light/60 hover:text-primary transition-colors"
                  aria-label="Open menu"
                  onClick={() => setMobileOpen(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                </button>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6 font-medium text-neutral-dark text-sm">
                  {/* Shop with mega-menu */}
                  <div className="relative" onMouseEnter={openShop} onMouseLeave={closeShopDelayed}>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-1 hover:text-primary transition-colors duration-200 py-1 relative"
                    >
                      Shop
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                      {pathname === "/shop" && (
                        <motion.span
                          layoutId="navUnderline"
                          className="absolute -bottom-0.5 left-0 right-4 h-[2px] bg-primary rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>

                    <AnimatePresence>
                      {shopOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute left-0 top-full z-[100] pt-3"
                          onMouseEnter={openShop}
                          onMouseLeave={closeShopDelayed}
                        >
                          <div className="w-[min(calc(100vw-3rem),42rem)] rounded-2xl border border-neutral-light/80 bg-white/95 backdrop-blur-xl shadow-xl p-6">
                            <Link
                              href="/shop"
                              className="mb-4 block text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                              onClick={() => setShopOpen(false)}
                            >
                              Shop all products →
                            </Link>
                            {dropdownItems.length > 0 ? (
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[min(60vh,22rem)] overflow-y-auto pr-1">
                                {dropdownItems.map((item) => (
                                  <li key={item.id}>
                                    <Link
                                      href={item.href}
                                      className="flex items-center gap-3 rounded-xl p-2 -m-2 text-sm font-medium text-neutral-darkest hover:bg-background-main transition-colors"
                                      onClick={() => setShopOpen(false)}
                                    >
                                      {item.imageUrl ? (
                                        <Image
                                          src={item.imageUrl}
                                          alt=""
                                          width={44}
                                          height={44}
                                          className="h-11 w-11 shrink-0 rounded-lg object-cover bg-neutral-light/40"
                                        />
                                      ) : (
                                        <span className="h-11 w-11 shrink-0 rounded-lg bg-primary/10" aria-hidden />
                                      )}
                                      <span className="leading-snug">{item.title}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-neutral-dark">
                                Categories will appear here once your Shopify store is connected.
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {secondaryLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="hover:text-primary transition-colors duration-200 py-1 relative"
                    >
                      {link.label}
                      {pathname === link.href && (
                        <motion.span
                          layoutId="navUnderline"
                          className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-primary rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* CENTER: logo */}
              <Link href="/" className="justify-self-center flex items-center">
                <Image
                  src="/nutrizen-logo.png"
                  alt="NutriZen"
                  width={240}
                  height={56}
                  className={`w-auto object-contain object-center transition-all duration-500 ${isScrolled ? "h-8" : "h-9 sm:h-10 md:h-11"}`}
                  priority
                />
              </Link>

              {/* RIGHT: actions */}
              <div className="justify-self-end flex items-center gap-4">
                <button aria-label="Search" className="hidden md:block text-neutral-dark hover:text-primary transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>

                <a
                  href="/pages/account"
                  aria-label="My account"
                  className="hidden md:block text-neutral-dark hover:text-primary transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                </a>

                <button
                  onClick={openCart}
                  aria-label={`Cart${cartItemCount > 0 ? `, ${cartItemCount} items` : ""}`}
                  className="relative text-neutral-dark hover:text-primary transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <AnimatePresence>
                    {cartItemCount > 0 && (
                      <motion.span
                        key="cart-badge"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center"
                      >
                        {cartItemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[200] md:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-neutral-darkest/40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.38, ease: [0.32, 0, 0.16, 1] }}
              className="absolute left-0 top-0 bottom-0 w-[min(100%,20rem)] bg-background-main shadow-2xl flex flex-col pt-6 pb-8 px-5 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <Image src="/nutrizen-logo.png" alt="NutriZen" width={140} height={36} className="h-8 w-auto" />
                </Link>
                <button
                  type="button"
                  className="p-2 rounded-lg text-neutral-dark hover:bg-neutral-light/60"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col gap-1 font-medium text-neutral-darkest">
                <Link href="/shop" className="py-3 border-b border-neutral-light/80 text-primary font-semibold" onClick={() => setMobileOpen(false)}>
                  Shop all
                </Link>

                {dropdownItems.length > 0 && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-dark pt-4 pb-2">Categories</p>
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="py-2.5 border-b border-neutral-light/50 text-sm hover:text-primary transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </>
                )}

                {secondaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="py-3 border-b border-neutral-light/50 hover:text-primary transition-colors mt-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                <Link
                  href="/pages/account"
                  className="py-3 border-b border-neutral-light/50 hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  My account
                </Link>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
