/**
 * Collection SEO/GEO copy — NutriZen SEO-GEO Developer Spec §4.2.
 * Keyed by live Shopify collection handle (verified against the store during Step 1).
 * Rendered below the existing product grid; the collection's own H1/intro stay as-is.
 */

export type CollectionFaq = { question: string; answer: string };
export type CollectionJournalLink = { title: string; href: string };

export type CollectionSeoContent = {
  title: string;
  metaDescription: string;
  h2: string;
  answer: string;
  startWith: string;
  faqs: CollectionFaq[];
  relatedReading: CollectionJournalLink[];
};

const JOURNAL_BASE = "/blogs/news";

export const COLLECTION_SEO_CONTENT: Record<string, CollectionSeoContent> = {
  "energy-and-vitality": {
    title: "Energy Supplements South Africa | NutriZen",
    metaDescription:
      "Supplements for tiredness and low energy: B-vitamins, gentle iron bisglycinate and glucose support. Made in South Africa. Free delivery over R690.",
    h2: "Which supplement helps with tiredness?",
    answer:
      "Ongoing tiredness has many possible causes, including low iron, low vitamin D, poor sleep and unsteady blood sugar. B-vitamins support energy metabolism, iron supports oxygen transport, and steadier blood sugar can reduce afternoon crashes. If you're unsure which applies to you, take the free 2-minute nutrient test.",
    startWith: "Vitacore B-Complex for everyday energy. Iron+ only if a blood test shows low iron.",
    faqs: [
      {
        question: "Can supplements help with fatigue?",
        answer:
          "They can if a nutrient shortfall is part of the cause. B-vitamins contribute to normal energy metabolism and iron to reduced tiredness when levels are low. Persistent exhaustion should always be checked by a doctor.",
      },
      {
        question: "Should I take iron for tiredness?",
        answer:
          "Only if a blood test shows your iron is low. Iron builds up in the body, so taking it without a reason isn't recommended.",
      },
      {
        question: "What's the difference between Vitacore and Iron+?",
        answer:
          "Vitacore supplies B-vitamins, choline, taurine and NAC for energy metabolism. Iron+ supplies iron bisglycinate and vitamin C for people with low iron.",
      },
    ],
    relatedReading: [
      { title: "B-Complex Vitamins Explained: What Each One Does", href: `${JOURNAL_BASE}/b-complex-vitamins-explained-what-each-one-does` },
      { title: "Iron Bisglycinate vs Regular Iron: Why “Gentle Iron” Matters", href: `${JOURNAL_BASE}/iron-bisglycinate-vs-regular-iron-why-gentle-iron-matters` },
    ],
  },

  "stress-sleep-and-mood": {
    title: "Supplements for Stress & Sleep South Africa | NutriZen",
    metaDescription:
      "Magnesium and adaptogen supplements for stress, sleep and calm. Magnesium Complex, Magnesium Oxide and Adaptogen+. Made in South Africa. Free delivery over R690.",
    h2: "What is the best supplement for stress and sleep?",
    answer:
      "Magnesium is usually the first place to start. It supports the nervous system and muscle relaxation, and many people take it in the evening. If stress is ongoing, adaptogens such as ashwagandha and rhodiola are traditionally used to help the body cope. Check with a professional if you take medication.",
    startWith: "Magnesium Complex, taken in the evening.",
    faqs: [
      {
        question: "Which magnesium is best for sleep?",
        answer:
          "Gentle forms such as magnesium bisglycinate are often chosen for evening use. Magnesium Complex combines bisglycinate with citrate, malate and oxide.",
      },
      {
        question: "Can I take magnesium and ashwagandha together?",
        answer:
          "Many people do, as they work in different ways. Speak to a professional first if you're pregnant, have a thyroid condition or take medication.",
      },
      {
        question: "How long does magnesium take to work for sleep?",
        answer:
          "Some people notice a difference within a week or two of nightly use; others need several weeks.",
      },
    ],
    relatedReading: [
      { title: "Magnesium Glycinate vs Citrate vs Oxide: Which One Should You Choose?", href: `${JOURNAL_BASE}/magnesium-glycinate-vs-citrate-vs-oxide-which-one-should-you-choose` },
      { title: "Adaptogens Explained: Ashwagandha, Rhodiola, Maca, and More", href: `${JOURNAL_BASE}/adaptogens-explained-ashwagandha-rhodiola-maca-and-more` },
    ],
  },

  "immunity-and-defense": {
    title: "Immune Support Supplements South Africa | NutriZen",
    metaDescription:
      "Vitamin D3, zinc, selenium and NAC for everyday immune support, or all three in the Daily Immunity & Recovery Stack for R674. Made in South Africa.",
    h2: "Which supplements support the immune system?",
    answer:
      "Vitamin D and zinc both contribute to the normal function of the immune system, and selenium supports the body's antioxidant defences. Low vitamin D is common in South Africans who work indoors, especially in winter. The Daily Immunity & Recovery Stack combines all three NutriZen immune formulas.",
    startWith: "the Daily Immunity & Recovery Stack (R674, save R75).",
    faqs: [
      {
        question: "When should I start taking immune supplements?",
        answer: "Many people start before winter, from around April or May, and continue through the colder months.",
      },
      {
        question: "Can I take vitamin D and zinc together?",
        answer: "Yes. They are often taken together, and both are included in the Daily Immunity & Recovery Stack.",
      },
      {
        question: "Do I need all three products in the stack?",
        answer:
          "Not necessarily. Each formula can be taken alone; the stack is simply better value if you want all three.",
      },
    ],
    relatedReading: [
      { title: "Can You Be Low in Vitamin D in Sunny South Africa?", href: `${JOURNAL_BASE}/can-you-be-low-in-vitamin-d-in-sunny-south-africa` },
      { title: "Zinc, Copper, and Selenium: Why Balance Matters", href: `${JOURNAL_BASE}/zinc-copper-and-selenium-why-balance-matters` },
    ],
  },

  "detox-and-digestive-health": {
    title: "Digestive Supplements & Herbal Cleanse South Africa | NutriZen",
    metaDescription:
      "Herbal support for bloating and digestion with Metabol+, and the Para-Cleanse herbal cleanse with black walnut, wormwood and clove. Free delivery over R690.",
    h2: "What helps with bloating after eating?",
    answer:
      "Bloating after meals is often linked to eating quickly, large or rich meals, and slow digestion. Herbs such as fenugreek, ajwain and fennel are traditionally used to support comfortable digestion. Persistent bloating, pain or changes in bowel habits should be checked by a doctor.",
    startWith: "Metabol+ before your larger meals.",
    faqs: [
      {
        question: "What is the difference between Metabol+ and Para-Cleanse?",
        answer:
          "Metabol+ is for everyday digestive comfort. Para-Cleanse is a 2–4 week herbal cleanse with black walnut, wormwood and clove.",
      },
      {
        question: "When should I start Para-Cleanse?",
        answer: "Three days before the full moon, as directed on the label.",
      },
      {
        question: "Can I take Metabol+ every day?",
        answer: "Yes, it is designed for daily use before meals, as directed on the label.",
      },
    ],
    // "Bloating after eating" and "How to do a herbal parasite cleanse" (spec §6.2) aren't published yet.
    relatedReading: [],
  },

  "metabolism-and-blood-sugar": {
    title: "Blood Sugar & Metabolism Supplements South Africa | NutriZen",
    metaDescription:
      "Support healthy glucose metabolism and digestion with Cellunex and Metabol+. Bitter melon, cinnamon, gymnema and digestive herbs. Free delivery over R690.",
    h2: "Can supplements support healthy blood sugar?",
    answer:
      "Diet, sleep and movement matter most for blood sugar. Some botanicals, including bitter melon, cinnamon and gymnema, are traditionally used to support healthy glucose metabolism and reduce sugar cravings. If you take diabetes medication, speak to your doctor before adding a blood sugar supplement.",
    startWith: "Cellunex for glucose metabolism support; add Metabol+ if digestion is also a concern.",
    faqs: [
      {
        question: "Is Cellunex safe with metformin?",
        answer: "Speak to your doctor first, as it may add to the effect of glucose-lowering medication.",
      },
      {
        question: "Can supplements help with sugar cravings?",
        answer:
          "Gymnema is traditionally used to reduce the taste of sweetness and sugar cravings, and is included in Cellunex.",
      },
      {
        question: "What does Metabol+ do?",
        answer: "It combines fenugreek, ajwain and fennel to support digestion and a balanced metabolic response after meals.",
      },
    ],
    // "Sugar cravings and energy crashes" (spec §6.2) isn't published yet.
    relatedReading: [{ title: "Blood Sugar Support: Lifestyle and Nutrient Foundations", href: `${JOURNAL_BASE}/blood-sugar-support-lifestyle-and-nutrient-foundations` }],
  },

  "bone-muscle-and-recovery": {
    title: "Magnesium & Vitamin D for Muscles & Bones | NutriZen South Africa",
    metaDescription:
      "Magnesium and vitamin D3 supplements for muscle cramps, recovery and bone health. Three formulas, made in South Africa. Free delivery over R690.",
    h2: "Which supplements help with muscle cramps?",
    answer:
      "Magnesium contributes to normal muscle function, and low intake is a common factor in muscle cramps, especially at night. Vitamin D supports bone health and muscle function. Choose Magnesium Oxide for cramps and regularity, Magnesium Complex for cramps with poor sleep, or Vitamin D3 + Magnesium Glycinate for bones.",
    startWith: "Magnesium Complex.",
    faqs: [
      {
        question: "Why do I get leg cramps at night?",
        answer:
          "Common factors include dehydration, long periods of sitting or standing, exercise, some medications and low magnesium. Frequent cramps should be checked by a doctor.",
      },
      {
        question: "Which is better for cramps: magnesium oxide or complex?",
        answer: "Both help. Oxide provides more magnesium per capsule; Complex adds gentler forms for evening use.",
      },
      {
        question: "Do I need vitamin D for my bones?",
        answer: "Vitamin D helps the body absorb calcium, which bones need. Many South Africans are low, especially in winter.",
      },
    ],
    // "Magnesium for night leg cramps" (spec §6.2) isn't published yet.
    relatedReading: [{ title: "Magnesium Glycinate vs Citrate vs Oxide: Which One Should You Choose?", href: `${JOURNAL_BASE}/magnesium-glycinate-vs-citrate-vs-oxide-which-one-should-you-choose` }],
  },

  "cellular-health-and-longevity": {
    title: "Antioxidant & Longevity Supplements South Africa | NutriZen",
    metaDescription:
      "NAC, glutathione precursors and metabolic support for long-term cellular health. Glutathione Precursor + NAC and Cellunex. Free delivery over R690.",
    h2: "What is glutathione and why does it matter?",
    answer:
      "Glutathione is one of the body's main antioxidants, helping protect cells from oxidative stress. The body makes it from amino acids, including cysteine, glycine and glutamine. NAC is a well-studied source of cysteine, which is why it's often used to support glutathione levels.",
    startWith: "Glutathione Precursor + NAC.",
    faqs: [
      {
        question: "NAC or glutathione: which should I take?",
        answer:
          "Oral glutathione is largely broken down in digestion, so many people take NAC and its fellow building blocks instead.",
      },
      {
        question: "When should I take NAC?",
        answer: "On an empty stomach, in the morning or between meals, as directed on the label.",
      },
      {
        question: "Is NAC available in South Africa?",
        answer: "Yes, NutriZen Glutathione Precursor + NAC delivers nationwide.",
      },
    ],
    relatedReading: [{ title: "NAC vs Glutathione: What Is the Difference?", href: `${JOURNAL_BASE}/nac-vs-glutathione-what-is-the-difference` }],
  },
};

/** Spec §4.2's "All" row — title/meta/H1 override only; no H2/FAQ/related-reading block. */
export const ALL_COLLECTION_OVERRIDE = {
  handle: "all",
  title: "All Supplements | NutriZen South Africa",
  metaDescription:
    "The full NutriZen range: 12 targeted supplements for sleep, stress, energy, immunity, digestion and metabolic support. Made in South Africa.",
  h1: "All NutriZen supplements",
};
