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
            We stand behind the quality of every NutriZen product. This policy is designed to be fair, transparent, and compliant with South Africa&apos;s Consumer Protection Act (CPA).
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background-main px-6 pb-24 pt-4">
        <div className="mx-auto max-w-3xl space-y-6">

          {/* 1. Unopened Products */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">Section 1</p>
            <h2 className="mt-2 text-lg font-semibold text-neutral-darkest">Unopened Products — 30-Day Return Window</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              If you change your mind, you may return any <strong className="font-semibold text-neutral-darkest">unopened, sealed product</strong> within <strong className="font-semibold text-neutral-darkest">30 days</strong> of the delivery date.
            </p>

            <p className="mt-5 text-sm font-medium text-neutral-darkest">Conditions:</p>
            <ul className="mt-2 space-y-2 text-sm text-neutral-dark">
              {[
                "The product must be in its original, factory-sealed packaging.",
                "The seal must be fully intact and unbroken.",
                "Proof of purchase is required.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-sm font-medium text-neutral-darkest">Process:</p>
            <ol className="mt-2 space-y-2 text-sm text-neutral-dark list-none">
              {[
                <>
                  <Link href="/pages/contact" className="font-medium text-primary hover:text-primary/80">Contact our support team</Link> within 30 days of delivery to request a return authorisation.
                </>,
                "Once approved, ship the product back to us at your own cost.",
                "Upon receipt and inspection, we will process a refund of the product amount only — original shipping fees are non-refundable.",
                "Refunds are returned to your original payment method within 10 business days.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* 2. Results-Based Refund */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">Section 2</p>
            <h2 className="mt-2 text-lg font-semibold text-neutral-darkest">Results-Based Refund — 30-Day Satisfaction Guarantee</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              We are confident in the efficacy of our formulations. If after consistent use you have not experienced any measurable benefit, you may apply for a goodwill refund under the following conditions.
            </p>

            <h3 className="mt-6 text-sm font-semibold text-neutral-darkest">Eligibility Criteria</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-dark">To qualify, you must provide <strong className="font-semibold text-neutral-darkest">all</strong> of the following:</p>
            <ul className="mt-3 space-y-3 text-sm text-neutral-dark">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>
                  <strong className="font-medium text-neutral-darkest">Proof of consistent use at the correct dosage</strong> — this may include a photo log, purchase history showing repeat orders, or a written declaration confirming you followed the recommended dosage as stated on the product label throughout the 30-day period.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>
                  <strong className="font-medium text-neutral-darkest">Supporting evidence of no results</strong> — for example, relevant bloodwork, a medical report, or clinical results from before and after the usage period that supports your claim.
                </span>
              </li>
            </ul>

            <div className="mt-4 rounded-xl bg-secondary/5 border border-secondary/20 px-4 py-3 text-sm leading-relaxed text-neutral-dark">
              We understand that not every test or supplement journey looks the same. Our team will review each claim with care and on a case-by-case basis.
            </div>

            <h3 className="mt-6 text-sm font-semibold text-neutral-darkest">What You Receive</h3>
            <ul className="mt-2 space-y-2 text-sm text-neutral-dark">
              {[
                "A full refund of the product amount, excluding any original shipping charges.",
                "No need to return the opened product — this is a goodwill gesture based on verified evidence.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-sm font-semibold text-neutral-darkest">How to Apply</h3>
            <ol className="mt-2 space-y-2 text-sm text-neutral-dark list-none">
              {[
                <>
                  <Link href="/pages/contact" className="font-medium text-primary hover:text-primary/80">Contact our support team</Link> with your order number and a summary of your claim.
                </>,
                <>
                  Submit your supporting documentation (dosage log + bloodwork or equivalent evidence) via email to{" "}
                  <a href="mailto:hello@nutrizen.co.za" className="font-medium text-primary hover:text-primary/80">hello@nutrizen.co.za</a>.
                </>,
                "Our team will review your submission within 5 business days and respond with a decision.",
                "If approved, your refund will be processed within 10 business days.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* 3. Damaged / Defective */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">Section 3</p>
            <h2 className="mt-2 text-lg font-semibold text-neutral-darkest">Damaged, Defective, or Incorrect Items</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              Please inspect your order upon delivery. If your product arrives damaged, defective, or does not match what you ordered, contact us <strong className="font-semibold text-neutral-darkest">within 7 days of delivery</strong> and we will resolve the issue at no cost to you — through a replacement, exchange, or full refund.
            </p>
          </div>

          {/* 4. CPA */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">Section 4</p>
            <h2 className="mt-2 text-lg font-semibold text-neutral-darkest">Consumer Protection Act (CPA) Compliance</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              This policy is fully aligned with the South African Consumer Protection Act (No. 68 of 2008). Under the CPA:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-dark">
              {[
                "You are entitled to a repair, replacement, or refund if goods are defective, unsafe, or do not match their description.",
                "Defective items may be returned within six months of purchase for assessment and resolution.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Cooling-Off */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">Section 5</p>
            <h2 className="mt-2 text-lg font-semibold text-neutral-darkest">7-Day Cooling-Off Period (Online Purchases)</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              In accordance with South African electronic commerce regulations, you have the right to cancel any online order within <strong className="font-semibold text-neutral-darkest">7 days</strong> of receiving your goods and receive a full refund, provided the product is returned in its original, unopened condition. Return shipping costs in this instance are the responsibility of the customer.
            </p>
          </div>

          {/* 6. Non-returnable */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">Section 6</p>
            <h2 className="mt-2 text-lg font-semibold text-neutral-darkest">Items Not Eligible for Return</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">The following cannot be returned under any circumstance:</p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-dark">
              {[
                "Products that have been opened and do not meet the results-based refund criteria above.",
                "Products purchased on sale or as part of a bundle promotion (unless defective).",
                "Gift cards.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact CTA */}
          <div className="rounded-[2rem] border border-dashed border-primary/40 bg-primary/5 p-8">
            <h2 className="text-base font-semibold text-neutral-darkest">Contact Us</h2>
            <p className="mt-1 text-sm text-neutral-dark">For any questions about a return, refund, or claim, please reach out to our team:</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-dark">
              <li className="flex gap-2">
                <span className="font-medium text-neutral-darkest">Email:</span>
                <a href="mailto:hello@nutrizen.co.za" className="text-primary hover:text-primary/80">hello@nutrizen.co.za</a>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-neutral-darkest">Phone:</span>
                <a href="tel:+27812609790" className="text-primary hover:text-primary/80">+27 81 260 9790</a>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-neutral-darkest">Hours:</span>
                <span>Monday – Friday, 9 AM – 5 PM</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-neutral-dark">We&apos;re here to help.</p>
          </div>

        </div>
      </section>
    </div>
  );
}
