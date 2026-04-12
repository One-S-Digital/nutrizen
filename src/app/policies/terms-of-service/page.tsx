export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Read the NutriZen Terms and Conditions governing your use of our website and services.",
  alternates: { canonical: `${SITE_URL}/policies/terms-of-service` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/policies/terms-of-service`,
    title: "Terms and Conditions | NutriZen",
    description: "Read the NutriZen Terms and Conditions governing your use of our website and services.",
  },
};

const sections = [
  {
    number: "1",
    title: "Introduction",
    body: "Welcome to our store. These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to comply with these terms.",
  },
  {
    number: "2",
    title: "Products and Services",
    body: "We offer products and/or services as described on our website. Prices, availability and descriptions are subject to change without notice. We reserve the right to limit quantities or discontinue products at any time.",
  },
  {
    number: "3",
    title: "Orders and Payment",
    body: "All orders are subject to acceptance and availability. By placing an order, you confirm that you are authorized to use the selected payment method. Prices are in ZAR.",
  },
  {
    number: "4",
    title: "Shipping and Delivery",
    body: "We aim to deliver orders within the estimated timeframes provided in our shipping policy. However, delivery times are estimates and may be affected by unforeseen circumstances. Risk of loss transfers to the customer upon delivery.",
  },
  {
    number: "5",
    title: "Returns and Refunds",
    body: "Our return policy allows customers to return eligible products. Products must be in original condition with proof of purchase. Refunds will be processed in accordance with our refund policy.",
  },
  {
    number: "6",
    title: "Limitation of Liability",
    body: "To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from the use of our website or services.",
  },
  {
    number: "7",
    title: "Governing Law",
    body: "These Terms and Conditions are governed by the laws of South Africa. Any disputes shall be resolved in the courts of South Africa.",
  },
  {
    number: "8",
    title: "Amendments",
    body: "We may update these Terms and Conditions from time to time. Changes will be posted on our website and continued use of our services constitutes acceptance of the revised terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background-main pt-10 pb-12 md:pb-16">
        <div className="pointer-events-none absolute left-1/4 top-10 h-72 w-72 rounded-full bg-secondary/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Legal</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-neutral-darkest md:text-5xl">
            Terms and Conditions
          </h1>
          <p className="mt-4 text-sm text-neutral-dark">Last updated: April 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background-main px-6 pb-24 pt-4">
        <div className="mx-auto max-w-3xl space-y-6">
          {sections.map((s) => (
            <div
              key={s.number}
              className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md"
            >
              <h2 className="text-lg font-semibold text-neutral-darkest">
                {s.number}. {s.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-dark">{s.body}</p>
            </div>
          ))}

          {/* Contact CTA */}
          <div className="rounded-[2rem] border border-dashed border-primary/40 bg-primary/5 p-8 text-center">
            <p className="text-sm leading-relaxed text-neutral-dark">
              For any questions or concerns, please{" "}
              <Link href="/pages/contact" className="font-medium text-primary hover:text-primary/80">
                contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
