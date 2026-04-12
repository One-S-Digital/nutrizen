export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: "NutriZen's 30-day return and refund policy, including CPA compliance and the cooling-off period for online purchases.",
  alternates: { canonical: `${SITE_URL}/policies/refund-policy` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/policies/refund-policy`,
    title: "Return & Refund Policy | NutriZen",
    description: "NutriZen's 30-day return and refund policy, including CPA compliance and the cooling-off period for online purchases.",
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background-main pt-10 pb-12 md:pb-16">
        <div className="pointer-events-none absolute left-1/4 top-10 h-72 w-72 rounded-full bg-secondary/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Policies</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-neutral-darkest md:text-5xl">
            Return &amp; Refund Policy
          </h1>
          <p className="mt-4 text-sm text-neutral-dark">
            We have a <strong className="font-semibold text-neutral-darkest">30-day return policy</strong> — you have 30 days after receiving your item to request a return.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background-main px-6 pb-24 pt-4">
        <div className="mx-auto max-w-3xl space-y-6">

          {/* Eligibility */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <h2 className="text-lg font-semibold text-neutral-darkest">Eligibility for Returns</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">To be eligible for a return, the item must be:</p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-dark">
              {[
                "In its original condition, unworn or unused.",
                "In its original packaging with all tags attached.",
                "Accompanied by proof of purchase.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm font-medium text-neutral-darkest">The following items cannot be returned:</p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-dark">
              {[
                "Perishable goods (e.g., food, flowers, or plants).",
                "Custom or personalized products.",
                "Personal care items (e.g., beauty products).",
                "Hazardous materials, flammable liquids, or gases.",
                "Sale items or gift cards.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to initiate */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <h2 className="text-lg font-semibold text-neutral-darkest">How to Initiate a Return</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              To start a return, please{" "}
              <Link href="/pages/contact" className="font-medium text-primary hover:text-primary/80">
                contact our support team
              </Link>
              . Returns must be pre-approved — items sent without prior approval will not be accepted.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              If your return is accepted, you will receive return instructions and a return shipping label (where applicable). The cost of return shipping may be the responsibility of the customer unless the return is due to a defective or incorrect item.
            </p>
          </div>

          {/* Damages */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <h2 className="text-lg font-semibold text-neutral-darkest">Damages &amp; Issues</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              Please inspect your order upon arrival. If an item is defective, damaged, or incorrect, contact us immediately so we can resolve the issue.
            </p>
          </div>

          {/* Exchanges */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <h2 className="text-lg font-semibold text-neutral-darkest">Exchanges</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              The fastest way to exchange an item is to return it and make a separate purchase for the replacement.
            </p>
          </div>

          {/* Refunds */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <h2 className="text-lg font-semibold text-neutral-darkest">Refunds</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. If approved, refunds will be processed to the original payment method within <strong className="font-medium text-neutral-darkest">10 business days</strong>. Banks or credit card companies may take additional time to process the refund.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              If more than 15 business days have passed since your refund was approved, please{" "}
              <Link href="/pages/contact" className="font-medium text-primary hover:text-primary/80">
                contact us
              </Link>
              .
            </p>
          </div>

          {/* CPA */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <h2 className="text-lg font-semibold text-neutral-darkest">Consumer Protection Act (CPA) Compliance</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              This policy aligns with South Africa&apos;s Consumer Protection Act (CPA). Customers are entitled to refunds or replacements if goods are defective, not fit for purpose, or do not match their description. Faulty items may be returned within six months for a repair, replacement, or refund, subject to an assessment.
            </p>
          </div>

          {/* Cooling-off */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <h2 className="text-lg font-semibold text-neutral-darkest">Cooling-Off Period for Online Purchases</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              In accordance with South African e-commerce laws, consumers who purchase items online have a <strong className="font-medium text-neutral-darkest">7-day cooling-off period</strong> to cancel their order and receive a full refund, provided the item is returned in its original, unused condition.
            </p>
          </div>

          {/* Contact CTA */}
          <div className="rounded-[2rem] border border-dashed border-primary/40 bg-primary/5 p-8 text-center">
            <p className="text-sm leading-relaxed text-neutral-dark">
              For any further questions, please{" "}
              <Link href="/pages/contact" className="font-medium text-primary hover:text-primary/80">
                reach out to our support team
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
