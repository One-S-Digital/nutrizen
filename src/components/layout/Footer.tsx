"use client";

import Link from "next/link";
import Image from "next/image";
import type { FooterNavColumn, FooterNavLink } from "@/lib/shopify";

const COMPANY_LINKS: FooterNavLink[] = [
  { id: "company-about", title: "About Us", href: "/pages/about", external: false },
  { id: "company-contact", title: "Contact Us", href: "/pages/contact", external: false },
  { id: "company-shipping", title: "Shipping Policy", href: "/policies/shipping-policy", external: false },
  { id: "company-terms", title: "Terms and Conditions", href: "/policies/terms-of-service", external: false },
  { id: "company-returns", title: "Return & Refund Policy", href: "/policies/refund-policy", external: false },
];

type FooterProps = {
  footerColumns: FooterNavColumn[];
  mainMenuLinks: FooterNavLink[];
};

function FooterLink({ link }: { link: FooterNavLink }) {
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary transition"
      >
        {link.title}
      </a>
    );
  }
  return (
    <Link href={link.href} className="hover:text-primary transition">
      {link.title}
    </Link>
  );
}

export default function Footer({ mainMenuLinks }: FooterProps) {
  return (
    <footer className="bg-background-alt pt-16 pb-8 border-t border-neutral-light mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12">

        {/* Col 1 — Brand */}
        <div>
          <Link href="/" className="mb-4 inline-block">
            <Image
              src="/nutrizen-logo.png"
              alt="NutriZen"
              width={240}
              height={56}
              className="h-9 w-auto max-w-[min(240px,100%)] object-contain object-left sm:h-10 md:h-11"
            />
          </Link>
          <p className="text-neutral-dark text-sm leading-relaxed">
            Premium, science-backed natural supplements designed to boost your daily vitality, calm, and focus.
          </p>
          <div className="mt-4 space-y-1.5 text-sm text-neutral-dark">
            <a href="tel:+27812609790" className="flex items-center gap-2 hover:text-primary transition">
              <span aria-hidden>📱</span>
              <span>+27 81 260 9790</span>
            </a>
            <a href="mailto:hello@nutrizen.co.za" className="flex items-center gap-2 hover:text-primary transition">
              <span aria-hidden>✉️</span>
              <span>hello@nutrizen.co.za</span>
            </a>
            <p className="text-xs text-neutral">Mon – Fri, 9 AM – 5 PM</p>
          </div>
        </div>

        {/* Col 2 — Shop (main-menu from Shopify) */}
        <div>
          <h4 className="font-semibold mb-4 text-neutral-darkest">Shop</h4>
          <ul className="space-y-3 text-sm text-neutral-dark">
            {mainMenuLinks.map((link) => (
              <li key={link.id}>
                <FooterLink link={link} />
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Company (hardcoded) */}
        <div>
          <h4 className="font-semibold mb-4 text-neutral-darkest">Company</h4>
          <ul className="space-y-3 text-sm text-neutral-dark">
            {COMPANY_LINKS.map((link) => (
              <li key={link.id}>
                <FooterLink link={link} />
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Newsletter */}
        <div>
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

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-light text-xs text-neutral">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="flex flex-row flex-nowrap items-center justify-center md:justify-start gap-x-1.5 text-center md:text-left">
            <span className="shrink-0">
              &copy; {new Date().getFullYear()} NutriZen Wellness. All rights reserved.
            </span>
            <span className="shrink-0 text-neutral-dark/50" aria-hidden>·</span>
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
            <Link href="/policies/privacy-policy" className="hover:text-neutral-dark transition">
              Privacy Policy
            </Link>
            <Link href="/policies/terms-of-service" className="hover:text-neutral-dark transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
