export const revalidate = 86400; // 24 hours — static content

import type { Metadata } from "next";
import Link from "next/link";
import FaqContent from "@/components/pages/FaqContent";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about NutriZen supplements – shipping across South Africa, how to use our formulas, return policy, and account details. Clear and straightforward answers.",
  keywords: [
    "NutriZen FAQ",
    "supplement shipping South Africa",
    "supplement return policy",
    "how to take supplements",
    "NutriZen help",
  ],
  alternates: { canonical: `${SITE_URL}/pages/faq` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/pages/faq`,
    title: "FAQ | NutriZen",
    description:
      "Quick answers about orders, shipping, product use, returns, and your account. Clear and straightforward.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where do you ship?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We ship across South Africa. Rates and timelines are calculated at checkout based on your address and selected service. You will see the full total—including any promotions—before you pay.",
      },
    },
    {
      "@type": "Question",
      name: "How long does delivery take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most orders leave our fulfilment partner within 1–2 business days. Courier delivery is typically 2–5 business days depending on your area. You will receive tracking details by email or SMS when your parcel is on the way.",
      },
    },
    {
      "@type": "Question",
      name: "Can I change or cancel an order?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If your order has not yet been dispatched, we may be able to update the address or cancel it. Contact us as soon as possible via the contact page with your order number, and we will do our best to help.",
      },
    },
    {
      "@type": "Question",
      name: "How should I take NutriZen supplements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Directions vary by product. Always read the label on your bottle first—timing (with food vs. away from meals), daily amount, and duration can differ between formulas. If you are pregnant, nursing, on medication, or managing a health condition, speak to a qualified practitioner before starting any new supplement.",
      },
    },
    {
      "@type": "Question",
      name: "Are your ingredients tested?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We work with reputable manufacturers and prioritise transparent labelling and consistent quality. Specific testing claims depend on the product line; batch documentation and specifications are held to the standards our suppliers and regulatory context require.",
      },
    },
    {
      "@type": "Question",
      name: "Can I combine multiple products?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Many customers stack targeted formulas, but nutrient overlap matters—especially for minerals and fat-soluble vitamins. If you are unsure about combining products, a pharmacist or clinician can help you avoid redundant or excessive intakes.",
      },
    },
    {
      "@type": "Question",
      name: "What is your return policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Opened supplement bottles generally cannot be resold for safety reasons. If your order arrived damaged, incorrect, or missing items, contact us within 14 days of delivery with photos where relevant, and we will arrange a replacement or refund in line with applicable consumer law.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need an account to shop?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can check out as a guest. Creating an account makes it easier to review past orders and speeds up repeat purchases, but it is optional.",
      },
    },
    {
      "@type": "Question",
      name: "How do you use my data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We use your details to process orders, communicate about your purchase, and—if you opt in—share occasional product updates. See our Privacy Policy for full details on cookies, marketing, and your rights.",
      },
    },
  ],
};

export default function FaqPage() {
  return (
    <div className="flex flex-col">
      <JsonLd data={faqSchema} />
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
