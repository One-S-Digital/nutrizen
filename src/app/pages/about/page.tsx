export const revalidate = 86400; // 24 hours — static content

import type { Metadata } from "next";
import Link from "next/link";
import AboutHero from "@/components/story/AboutHero";
import StoryProblemSection from "@/components/story/StoryProblemSection";
import PhilosophyCards from "@/components/story/PhilosophyCards";
import StoryAbsorptionTeaser from "@/components/story/StoryAbsorptionTeaser";
import ComparisonSection from "@/components/brand/ComparisonSection";
import ProductPurposeStrip from "@/components/story/ProductPurposeStrip";
import BrandQuoteSection from "@/components/story/BrandQuoteSection";
import StoryFinalCta from "@/components/story/StoryFinalCta";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export const metadata: Metadata = {
  // Absolute: the spec's target title doesn't end in "| NutriZen" (it already carries
  // the brand mid-string), so the root layout's title.template would double-brand it.
  title: { absolute: "About NutriZen South Africa | Our Story" },
  description:
    "NutriZen South Africa makes targeted supplements with transparent ingredients and no proprietary blends. Made in South Africa, delivered nationwide.",
  keywords: [
    "NutriZen story",
    "about NutriZen",
    "supplement transparency",
    "why NutriZen",
    "natural supplement brand South Africa",
    "honest supplements",
  ],
  alternates: { canonical: `${SITE_URL}/pages/about` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/pages/about`,
    title: "About NutriZen South Africa | Our Story",
    description:
      "NutriZen South Africa makes targeted supplements with transparent ingredients and no proprietary blends. Made in South Africa, delivered nationwide.",
  },
};

const COMPARE_LEFT = [
  "Hidden blends and proprietary stacks",
  "Cheap mineral forms with poor uptake",
  "Filler-heavy formulas",
  "Unclear purpose behind each ingredient",
  "Low-value formulation dressed as premium",
] as const;

const COMPARE_RIGHT = [
  "Transparent ingredients you can verify",
  "High-quality nutrient forms chosen for absorption",
  "Targeted support for real health goals",
  "Complementary compounds where they matter",
  "Simple, effective formulation-by design",
] as const;

export default function OurStoryPage() {
  return (
    <div className="flex flex-col">
      <AboutHero />
      <section className="bg-background-main py-14">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-lg leading-relaxed text-neutral-dark">
            NutriZen South Africa is a South African supplement brand. We make 12 targeted formulas for
            sleep, stress, energy, immunity, digestion and metabolic support, all made in South Africa and
            delivered nationwide. Every formula lists its ingredients in full, with no proprietary blends.
          </p>
        </div>
      </section>
      <StoryProblemSection />
      <PhilosophyCards />
      <StoryAbsorptionTeaser />
      <ComparisonSection
        title="What makes NutriZen different"
        subtitle="The supplement aisle rewards noise. We built NutriZen for people who want clarity-without sacrificing depth."
        leftItems={COMPARE_LEFT}
        rightItems={COMPARE_RIGHT}
      />
      <ProductPurposeStrip />
      <BrandQuoteSection />
      <section className="bg-background-main py-10">
        <div className="max-w-3xl mx-auto px-6 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
          <Link href="/pages/science" className="text-primary hover:underline">
            How we formulate
          </Link>
          <Link href="/blogs/news" className="text-primary hover:underline">
            Read the Journal
          </Link>
          <Link href="/pages/faq" className="text-primary hover:underline">
            Questions? See our FAQ
          </Link>
        </div>
      </section>
      <StoryFinalCta />
    </div>
  );
}
