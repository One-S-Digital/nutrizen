import type { Metadata } from "next";
import ScienceHero from "@/components/science/ScienceHero";
import SciencePrinciples from "@/components/science/SciencePrinciples";
import FormulaEcosystem from "@/components/science/FormulaEcosystem";
import BioavailabilityStrip from "@/components/science/BioavailabilityStrip";
import ComparisonSection from "@/components/brand/ComparisonSection";
import StoryFinalCta from "@/components/story/StoryFinalCta";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export const metadata: Metadata = {
  title: "The Science",
  description:
    "How NutriZen formulates for bioavailability, synergy, and credible dosing – explained clearly, without the hype. Nutrient forms chosen for uptake, transparent labelling, and evidence-aligned dosing.",
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
    title: "The Science | NutriZen",
    description:
      "How NutriZen formulates for bioavailability, synergy, and credible dosing – explained clearly, without the hype.",
  },
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
      <ScienceHero />
      <SciencePrinciples />
      <FormulaEcosystem />
      <BioavailabilityStrip />
      <ComparisonSection
        eyebrow="Credibility, clearly"
        title="General supplements vs. NutriZen"
        subtitle="A side-by-side view of what often happens on shelves-and the standard we hold ourselves to."
        leftItems={SCIENCE_LEFT}
        rightItems={SCIENCE_RIGHT}
      />
      <StoryFinalCta />
    </div>
  );
}
