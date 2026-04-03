import type { Metadata } from "next";
import Link from "next/link";
import FaqContent from "@/components/pages/FaqContent";

export const metadata: Metadata = {
  title: "FAQ | NutriZen",
  description:
    "Answers about shipping, product use, returns, and your account—clear and straightforward.",
};

export default function FaqPage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-background-main pt-10 pb-12 md:pb-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/12 blur-[100px]" />
        <div className="pointer-events-none absolute right-0 top-20 h-56 w-56 rounded-full bg-secondary/12 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Help centre</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-neutral-darkest md:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-dark">
            Quick answers about orders, how to use our formulas, and what to expect when you need support. If
            something is not covered here, we are happy to help on the contact page.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/pages/contact"
              className="inline-flex items-center justify-center rounded-2xl border border-primary/20 bg-primary px-8 py-3.5 text-base font-medium text-white shadow-[0_4px_14px_0_rgba(140,171,119,0.35)] transition-colors duration-300 hover:bg-[#7a9d65] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Contact us
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-primary bg-transparent px-8 py-3.5 text-base font-medium text-primary transition-colors duration-300 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Browse the shop
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background-main px-6 pt-4">
        <FaqContent />
      </section>
    </div>
  );
}
