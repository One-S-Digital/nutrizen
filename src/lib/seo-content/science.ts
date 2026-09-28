/**
 * Science page — new content, NutriZen SEO-GEO Developer Spec §4.5.
 * Product handles verified against the live Shopify store (Step 1).
 */

export type NutrientFormRow = {
  form: string;
  knownFor: string;
  usedIn: { title: string; handle: string }[];
};

export const NUTRIENT_FORMS: NutrientFormRow[] = [
  {
    form: "Magnesium bisglycinate (glycinate)",
    knownFor: "Gentle on the stomach; often chosen for evening use",
    usedIn: [
      { title: "Magnesium Complex", handle: "nutrizen-magnesium-complex" },
      { title: "Vitamin D3 + Magnesium Glycinate", handle: "nutrizen-vitamin-d3-magnesium-glycinate" },
    ],
  },
  {
    form: "Magnesium citrate",
    knownFor: "Well absorbed; mild laxative effect at higher doses",
    usedIn: [{ title: "Magnesium Complex", handle: "nutrizen-magnesium-complex" }],
  },
  {
    form: "Magnesium malate",
    knownFor: "Often chosen for daytime and muscle support",
    usedIn: [{ title: "Magnesium Complex", handle: "nutrizen-magnesium-complex" }],
  },
  {
    form: "Magnesium oxide",
    knownFor: "High magnesium per capsule; supports regularity",
    usedIn: [
      { title: "Magnesium Complex", handle: "nutrizen-magnesium-complex" },
      { title: "Magnesium Oxide", handle: "nutrizen-magnesium-oxide" },
    ],
  },
  {
    form: "Iron bisglycinate",
    knownFor: "Chelated iron, generally gentler than ferrous sulphate",
    usedIn: [{ title: "Iron+", handle: "nutrizen-iron-plus-supplement" }],
  },
  {
    form: "Zinc amino acid chelate",
    knownFor: "Chelated zinc form",
    usedIn: [{ title: "Zinc + Copper & Selenium", handle: "nutrizen-zinc-copper-selenium" }],
  },
  {
    form: "Selenium as L-selenomethionine",
    knownFor: "Organic form of selenium",
    usedIn: [{ title: "Zinc + Copper & Selenium", handle: "nutrizen-zinc-copper-selenium" }],
  },
  {
    form: "Vitamin D3 (cholecalciferol)",
    knownFor: "The form of vitamin D the skin makes from sunlight",
    usedIn: [{ title: "Vitamin D3 + Magnesium Glycinate", handle: "nutrizen-vitamin-d3-magnesium-glycinate" }],
  },
];

export type ScienceFaq = { question: string; answer: string };

export const SCIENCE_FAQS: ScienceFaq[] = [
  {
    question: "What is a proprietary blend?",
    answer:
      "A proprietary blend lists several ingredients under one combined weight without showing how much of each is included. It lets brands hide small, ineffective amounts. NutriZen does not use proprietary blends.",
  },
  {
    question: "Why does the form of a nutrient matter?",
    answer:
      "Different forms of the same mineral differ in how much they supply, how well they're absorbed and how they feel on the stomach. Magnesium oxide and magnesium bisglycinate, for example, behave very differently.",
  },
  {
    question: "What does \"elemental\" mean on a supplement label?",
    answer:
      "It is the amount of the actual mineral, not the whole compound. 500 mg of a magnesium compound supplies less than 500 mg of elemental magnesium, because part of the weight is the compound it's bound to.",
  },
  {
    question: "Are NutriZen supplements made in South Africa?",
    answer: "Yes. All NutriZen supplements are made in South Africa.",
  },
];

export const SCIENCE_JOURNAL_LINKS = [
  { title: "How to Read a Supplement Label Before You Buy", href: "/blogs/news/how-to-read-a-supplement-label-before-you-buy" },
  { title: "Proprietary Blends vs Transparent Formulas", href: "/blogs/news/proprietary-blends-vs-transparent-formulas" },
];
