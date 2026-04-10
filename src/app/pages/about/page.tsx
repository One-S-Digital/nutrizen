import type { Metadata } from "next";
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
  title: "Our Story",
  description:
    "Why NutriZen exists: targeted formulas, true doses, better nutrient forms, and a calmer way to choose supplements. Transparent ingredients you can verify, high-quality nutrient forms chosen for absorption.",
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
    title: "Our Story | NutriZen",
    description:
      "Why NutriZen exists: targeted formulas, true doses, better nutrient forms, and a calmer way to choose supplements.",
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
      <StoryFinalCta />
    </div>
  );
}
