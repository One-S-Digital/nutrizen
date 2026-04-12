export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Learn about NutriZen shipping rates, delivery times, and courier partners across South Africa.",
  alternates: { canonical: `${SITE_URL}/policies/shipping-policy` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/policies/shipping-policy`,
    title: "Shipping Policy | NutriZen",
    description: "Learn about NutriZen shipping rates, delivery times, and courier partners across South Africa.",
  },
};

export default function ShippingPolicyPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background-main pt-10 pb-12 md:pb-16">
        <div className="pointer-events-none absolute left-1/4 top-10 h-72 w-72 rounded-full bg-secondary/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Policies</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-neutral-darkest md:text-5xl">
            Shipping Policy
          </h1>
          <p className="mt-4 text-sm text-neutral-dark">Last updated: April 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background-main px-6 pb-24 pt-4">
        <div className="mx-auto max-w-3xl space-y-6">

          {/* Rates */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <h2 className="text-lg font-semibold text-neutral-darkest">1. Shipping Rates &amp; Fees</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-light">
              <table className="w-full text-sm">
                <thead className="bg-background-alt text-left">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-neutral-darkest">Package Weight</th>
                    <th className="px-5 py-3 font-semibold text-neutral-darkest">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-light">
                  <tr className="bg-white/60">
                    <td className="px-5 py-3 text-neutral-dark">Under 5 kg</td>
                    <td className="px-5 py-3 font-medium text-neutral-darkest">R130</td>
                  </tr>
                  <tr className="bg-white/60">
                    <td className="px-5 py-3 text-neutral-dark">Over 5 kg</td>
                    <td className="px-5 py-3 font-medium text-neutral-darkest">R230</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-dark">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>All orders are shipped via courier.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>No handling fees are charged.</span>
              </li>
            </ul>
          </div>

          {/* Processing */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <h2 className="text-lg font-semibold text-neutral-darkest">2. Processing &amp; Delivery Times</h2>
            <ul className="mt-4 space-y-3 text-sm text-neutral-dark">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>Orders are dispatched within one working day after payment confirmation.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span><strong className="font-medium text-neutral-darkest">Main cities:</strong> 1–3 business days.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span><strong className="font-medium text-neutral-darkest">Outlying areas:</strong> Up to 7 business days.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>All orders are shipped via express courier delivery on business days only.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>Orders placed after 2 PM will be processed on the following working day.</span>
              </li>
            </ul>
          </div>

          {/* Carriers */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <h2 className="text-lg font-semibold text-neutral-darkest">3. Shipping Carriers &amp; Tracking</h2>
            <ul className="mt-4 space-y-3 text-sm text-neutral-dark">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>We partner with leading courier companies to ensure reliable and fast delivery.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>Once your order has been shipped, you will receive a tracking email with a link to track your package.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>Use the courier&apos;s website to check delivery updates at any time.</span>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <h2 className="text-lg font-semibold text-neutral-darkest">4. Shipping Destinations</h2>
            <ul className="mt-4 space-y-3 text-sm text-neutral-dark">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>We currently ship nationwide within South Africa.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>International shipping is available upon request — please contact us before placing an order.</span>
              </li>
            </ul>
          </div>

          {/* Failed deliveries */}
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
            <h2 className="text-lg font-semibold text-neutral-darkest">5. Failed Deliveries &amp; Returns</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              If a delivery is unsuccessful due to an incorrect address or absence at the delivery location, the courier may attempt redelivery. If redelivery is unsuccessful, the package may be returned to us.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-dark">
              Please refer to our{" "}
              <Link href="/policies/refund-policy" className="font-medium text-primary hover:text-primary/80">
                Returns Policy
              </Link>{" "}
              for details on how to handle returns.
            </p>
          </div>

          {/* Contact CTA */}
          <div className="rounded-[2rem] border border-dashed border-primary/40 bg-primary/5 p-8 text-center">
            <p className="text-sm leading-relaxed text-neutral-dark">
              For any shipping-related inquiries, feel free to{" "}
              <Link href="/pages/contact" className="font-medium text-primary hover:text-primary/80">
                contact our support team
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
