export const revalidate = 86400; // 24 hours — static content

import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/seo/FaqAccordion";
import JsonLd from "@/components/seo/JsonLd";
import PractitionerForm from "@/components/pages/PractitionerForm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";
const CANONICAL = `${SITE_URL}/pages/practitioners`;

export const metadata: Metadata = {
  // Absolute: this title ends in "NutriZen South Africa", not "| NutriZen", so the
  // root layout's title.template would double-brand it if used as a plain string.
  title: { absolute: "For Healthcare Practitioners | NutriZen South Africa" },
  description:
    "Transparent formulas for South African pharmacists, dietitians and doctors: full ingredient lists, nutrient forms and practitioner enquiries.",
  keywords: [
    "supplement formula sheet",
    "NutriZen practitioners",
    "pharmacist supplement enquiry South Africa",
    "dietitian supplement ingredients",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    url: CANONICAL,
    title: "For Healthcare Practitioners | NutriZen South Africa",
    description:
      "Transparent formulas for South African pharmacists, dietitians and doctors: full ingredient lists, nutrient forms and practitioner enquiries.",
  },
};

const FAQS = [
  {
    question: "Do you provide formula sheets to practitioners?",
    answer:
      "Yes. Request one below with the product name and your practice details, and we'll send the full ingredient breakdown by email.",
  },
  {
    question: "Are NutriZen formulas third-party tested?",
    answer:
      "Testing and quality documentation vary by product line; ask for the specific formula sheet and we'll share what's available for that product.",
  },
  {
    question: "Can I recommend NutriZen products to patients on medication?",
    answer:
      "Several NutriZen ingredients can interact with common medications — for example, iron with certain antibiotics, or adaptogens with thyroid or blood pressure medication. Check the formula sheet and use your own clinical judgement before recommending.",
  },
];

export default function PractitionersPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "For Healthcare Practitioners",
    description: metadata.description,
    url: CANONICAL,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "For Healthcare Practitioners", item: CANONICAL },
    ],
  };

  return (
    <div className="flex flex-col">
      <JsonLd data={webPageSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <section className="relative overflow-hidden bg-background-main pt-10 pb-12 md:pb-16">
        <div className="pointer-events-none absolute left-1/4 top-0 h-[380px] w-[380px] rounded-full bg-primary/12 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">For practitioners</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-neutral-darkest md:text-5xl">
            Formulas you can <em className="italic text-primary">check</em>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-dark">
            Full ingredient lists, specific nutrient forms, and a direct line to request a formula sheet for any
            NutriZen product.
          </p>
        </div>
      </section>

      <section className="bg-background-main px-6 pb-24 pt-4">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">Who this is for</h2>
            <p className="text-neutral-dark leading-relaxed">
              This page is for pharmacists, dietitians, doctors and other healthcare practitioners in South
              Africa who want to understand what&apos;s in a NutriZen formula before recommending or discussing
              it with a patient or client. If that&apos;s not you, the{" "}
              <Link href="/pages/science" className="font-medium text-primary hover:underline">
                Science page
              </Link>{" "}
              covers the same information in a more general form.
            </p>

            <h2 className="mt-12 text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">What we provide</h2>
            <p className="text-neutral-dark leading-relaxed">
              On request, we can share a formula sheet for any NutriZen product: the full ingredient list with
              amounts, the specific form of each nutrient (for example magnesium bisglycinate rather than just
              &quot;magnesium&quot;), and any known contraindications or interactions worth being aware of. We
              also flag which formulas overlap in nutrients, in case a patient is already taking more than one.
            </p>

            <div className="mt-12">
              <h2 className="text-xl font-bold text-neutral-darkest mb-4">Frequently asked questions</h2>
              <FaqAccordion items={FAQS} />
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
              <Link href="/pages/science" className="text-primary hover:underline">
                How we formulate
              </Link>
              <Link href="/pages/quality" className="text-primary hover:underline">
                Quality &amp; sourcing
              </Link>
              <Link href="/shop" className="text-primary hover:underline">
                Browse the shop
              </Link>
            </div>
          </div>

          <PractitionerForm
            siteKey={
              process.env.TURNSTILE_SITE_KEY ??
              process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
              "1x00000000000000000000AA"
            }
          />
        </div>
      </section>
    </div>
  );
}
