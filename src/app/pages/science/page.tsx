export const revalidate = 86400; // 24 hours — static content

import type { Metadata } from "next";
import Link from "next/link";
import ScienceHero from "@/components/science/ScienceHero";
import SciencePrinciples from "@/components/science/SciencePrinciples";
import FormulaEcosystem from "@/components/science/FormulaEcosystem";
import BioavailabilityStrip from "@/components/science/BioavailabilityStrip";
import ComparisonSection from "@/components/brand/ComparisonSection";
import StoryFinalCta from "@/components/story/StoryFinalCta";
import NutrientFormsTable from "@/components/science/NutrientFormsTable";
import FaqAccordion from "@/components/seo/FaqAccordion";
import JsonLd from "@/components/seo/JsonLd";
import { SCIENCE_FAQS, SCIENCE_JOURNAL_LINKS } from "@/lib/seo-content/science";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export const metadata: Metadata = {
  title: "Supplement Science: Nutrient Forms & No Proprietary Blends",
  description:
    "How NutriZen chooses nutrient forms and doses, why we don't use proprietary blends, and how to compare supplements. Made in South Africa.",
  keywords: [
    "supplement bioavailability",
    "nutrient absorption",
    "supplement science",
    "chelated minerals",
    "NutriZen formulation",
    "evidence-based supplements",
    "synergistic nutrients",
  ],
  alternates: { canonical: `${SITE_URL}/pages/science` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/pages/science`,
    title: "Supplement Science: Nutrient Forms & No Proprietary Blends | NutriZen",
    description:
      "How NutriZen chooses nutrient forms and doses, why we don't use proprietary blends, and how to compare supplements. Made in South Africa.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SCIENCE_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const SCIENCE_LEFT = [
  "One-size blends that ignore nutrient interactions",
  "Forms selected for cost-not utilization",
  "Marketing doses that look good but underdeliver",
  "Complex labels that hide weak inputs",
  "Trend-chasing stacks with little coherence",
] as const;

const SCIENCE_RIGHT = [
  "Formulas shaped around uptake and tolerability",
  "Mineral and nutrient forms chosen with intent",
  "Dosing aligned with evidence-not filler hype",
  "Transparent labeling with a clear purpose per ingredient",
  "Synergistic design that respects physiology",
] as const;

export default function SciencePage() {
  return (
    <div className="flex flex-col">
      <JsonLd data={faqSchema} />
      <ScienceHero />
      <SciencePrinciples />
      <FormulaEcosystem />
      <BioavailabilityStrip />
      <NutrientFormsTable />
      <ComparisonSection
        eyebrow="Credibility, clearly"
        title="General supplements vs. NutriZen"
        subtitle="A side-by-side view of what often happens on shelves-and the standard we hold ourselves to."
        leftItems={SCIENCE_LEFT}
        rightItems={SCIENCE_RIGHT}
      />
      <section className="bg-background-main py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-bold text-neutral-darkest mb-6">Frequently asked questions</h2>
          <FaqAccordion items={SCIENCE_FAQS} />
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
            {SCIENCE_JOURNAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-primary hover:underline">
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <StoryFinalCta />
    </div>
  );
}
