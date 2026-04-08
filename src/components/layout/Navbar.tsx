"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import type { NavCollection, FooterNavLink } from "@/lib/shopify";

type NavbarProps = {
  collections?: NavCollection[];
  mainMenuLinks?: FooterNavLink[];
};

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Navbar({ collections = [], mainMenuLinks = [] }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const shopLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { openCart, items } = useCartStore();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const openShop = () => {
    if (shopLeaveTimer.current) clearTimeout(shopLeaveTimer.current);
    setShopOpen(true);
  };

  const closeShopDelayed = () => {
    if (shopLeaveTimer.current) clearTimeout(shopLeaveTimer.current);
    shopLeaveTimer.current = setTimeout(() => setShopOpen(false), 160);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Items shown in the Shop mega-menu: prefer Shopify main-menu links
  // (already normalised to /shop?collection= at the data layer),
  // fall back to nav collections if main-menu is empty.
  const dropdownItems: { id: string; title: string; href: string; imageUrl?: string | null }[] =
    mainMenuLinks.length > 0
      ? mainMenuLinks.map((l) => {
          // Match a collection image by extracting the handle from the filter URL
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

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled || shopOpen || mobileOpen ? "bg-background-main/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
      initial={false}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 grid grid-cols-3 items-center gap-4">
        {/* Nav — left */}
        <div className="justify-self-start min-w-0 flex items-center gap-1">
          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 -ml-2 rounded-lg text-neutral-dark hover:bg-neutral-light/60 hover:text-primary transition-colors"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-neutral-dark">
            {/* Shop — with Shopify main-menu mega-menu */}
            <div className="relative" onMouseEnter={openShop} onMouseLeave={closeShopDelayed}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                aria-haspopup="true"
                aria-expanded={shopOpen}
              >
                Shop
                <ChevronDown className={`transition-transform ${shopOpen ? "rotate-180" : ""}`} />
              </Link>

              {shopOpen && (
                <div
                  className="absolute left-0 top-full z-[100] pt-2"
                  role="navigation"
                  aria-label="Shop navigation"
                  onMouseEnter={openShop}
                  onMouseLeave={closeShopDelayed}
                >
                  <div className="w-[min(calc(100vw-3rem),44rem)] rounded-2xl border border-neutral-light/80 bg-white shadow-xl p-6">
                    <Link
                      href="/shop"
                      className="mb-4 block text-sm font-semibold text-primary hover:text-primary/90"
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
                                <span className="h-11 w-11 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary/40" aria-hidden>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                  </svg>
                                </span>
                              )}
                              <span className="leading-snug">{item.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-neutral-dark">
                        Categories will appear here when your Shopify store is connected.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Hardcoded top-level links */}
            <Link href="/pages/about" className="hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/pages/science" className="hover:text-primary transition-colors">
              The Science
            </Link>
          </nav>
        </div>

        {/* Logo — center */}
        <Link href="/" className="justify-self-center flex items-center">
          <Image
            src="/nutrizen-logo.png"
            alt="NutriZen"
            width={240}
            height={56}
            className="h-9 sm:h-10 md:h-11 w-auto max-w-[min(240px,70vw)] object-contain object-center"
            priority
          />
        </Link>

        {/* Actions — right */}
        <div className="flex items-center gap-6 justify-self-end">
          <button aria-label="Search" className="hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button onClick={openCart} aria-label="Cart" className="hover:text-primary transition-colors relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] md:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
          <button
            type="button"
            className="absolute inset-0 bg-neutral-darkest/40"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[min(100%,20rem)] bg-background-main shadow-xl flex flex-col pt-6 pb-8 px-5 overflow-y-auto">
            <div className="flex justify-end mb-4">
              <button
                type="button"
                className="p-2 rounded-lg text-neutral-dark hover:bg-neutral-light/60"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1 font-medium text-neutral-darkest">
              <Link
                href="/shop"
                className="py-3 border-b border-neutral-light/80 text-primary font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                Shop all
              </Link>

              {/* Shopify main-menu links */}
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

              <Link
                href="/pages/about"
                className="py-3 mt-4 border-t border-neutral-light/80 hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/pages/science"
                className="py-2.5 border-b border-neutral-light/50 hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                The Science
              </Link>
            </nav>
          </div>
        </div>
      )}
    </motion.header>
  );
}
