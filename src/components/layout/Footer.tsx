"use client";

import Link from "next/link";
import Image from "next/image";
import type { FooterNavColumn } from "@/lib/shopify";

type FooterProps = {
  footerColumns: FooterNavColumn[];
};

export default function Footer({ footerColumns }: FooterProps) {
  return (
    <footer className="bg-background-alt pt-16 pb-8 border-t border-neutral-light mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-12">
        {/* Brand Column */}
        <div className="md:col-span-2 xl:col-span-3">
          <Link href="/" className="mb-4 inline-block">
            <Image
              src="/nutrizen-logo.png"
              alt="Nutri Zen"
              width={240}
              height={56}
              className="h-9 w-auto max-w-[min(240px,100%)] object-contain object-left sm:h-10 md:h-11"
            />
          </Link>
          <p className="text-neutral-dark text-sm leading-relaxed">
            Premium, science-backed natural supplements designed to boost your daily vitality, calm, and focus.
          </p>
        </div>

        {/* Shopify menu columns (or fallback Shop + About) */}
        <div className="md:col-span-2 xl:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
          {footerColumns.map((col) => (
            <div key={col.id}>
              <h4 className="font-semibold mb-4 text-neutral-darkest">{col.title}</h4>
              <ul className="space-y-3 text-sm text-neutral-dark">
                {col.links.map((link) => (
                  <li key={link.id}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition"
                      >
                        {link.title}
                      </a>
                    ) : (
                      <Link href={link.href} className="hover:text-primary transition">
                        {link.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="md:col-span-2 xl:col-span-3">
          <h4 className="font-semibold mb-4 text-neutral-darkest">Stay Connected</h4>
          <p className="text-sm text-neutral-dark mb-4">
            Join our newsletter for exclusive offers and wellness tips.
          </p>
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="bg-white border border-neutral-light rounded-l-2xl px-4 py-2 w-full focus:outline-none focus:border-primary text-sm shadow-sm"
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-r-2xl font-medium hover:bg-opacity-90 transition-colors text-sm shadow-sm"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-light flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral">
        <p className="flex flex-row flex-nowrap items-center justify-center md:justify-start gap-x-1.5 text-center md:text-left">
          <span className="shrink-0">
            &copy; {new Date().getFullYear()} NutriZen Wellness. All rights reserved.
          </span>
          <span className="shrink-0 text-neutral-dark/50" aria-hidden>
            ·
          </span>
          <span className="shrink-0">
            Built by{" "}
            <a
              href="https://onesdigital.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 font-medium"
            >
              One S Digital
            </a>
          </span>
        </p>
        <div className="flex gap-4">
          <Link href="/pages/privacy-policy" className="hover:text-neutral-dark transition">
            Privacy Policy
          </Link>
          <Link href="/pages/terms" className="hover:text-neutral-dark transition">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
