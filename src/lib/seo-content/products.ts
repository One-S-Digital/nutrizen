/**
 * Product SEO/GEO copy — NutriZen SEO-GEO Developer Spec §3.5–§3.7.
 * Keyed by live Shopify product handle (verified against the store, 2026-09-28).
 * Overrides the Shopify seoTitle/seoDescription metafields so title tags match the
 * spec exactly (some end in "NutriZen", others "NutriZen South Africa" — a single
 * template can't produce both, so the full string lives here).
 */

export type ProductFaq = { question: string; answer: string };

export type ProductRelatedReading = {
  collectionHandle: string;
  collectionLabel: string;
  journalLinks: { title: string; href: string }[];
};

export type ProductSeoContent = {
  title: string;
  metaDescription: string;
  descriptorLine: string;
  newFaqs: ProductFaq[];
  relatedReading: ProductRelatedReading;
};

const JOURNAL_BASE = "/blogs/news";

export const PRODUCT_SEO_CONTENT: Record<string, ProductSeoContent> = {
  "nutrizen-vitamin-d3-magnesium-glycinate": {
    title: "Vitamin D3 & Magnesium Glycinate South Africa | NutriZen",
    metaDescription:
      "Vitamin D3 (cholecalciferol) with magnesium glycinate in one capsule, for bones, immunity and relaxation. Made in South Africa. R269, free delivery over R690.",
    descriptorLine: "Vitamin D3 with magnesium glycinate for bones, immunity and calm",
    newFaqs: [
      {
        question: "Why take vitamin D3 with magnesium?",
        answer:
          "Magnesium helps the body convert vitamin D into its active form, so the two work together. This formula combines vitamin D3 (cholecalciferol) with magnesium glycinate, a form that is gentle on the stomach, in one capsule.",
      },
      {
        question: "Do South Africans need vitamin D supplements?",
        answer:
          "Many do, despite the sunshine. Indoor work, sunscreen, winter and darker skin all reduce how much vitamin D the skin makes. A blood test is the only way to know your level; ask your doctor if you're unsure.",
      },
    ],
    relatedReading: {
      collectionHandle: "immunity-and-defense",
      collectionLabel: "Immunity & Defense",
      journalLinks: [
        {
          title: "Vitamin D3 and Magnesium: Why They Are Often Taken Together",
          href: `${JOURNAL_BASE}/vitamin-d3-and-magnesium-why-they-are-often-taken-together`,
        },
        {
          title: "Can You Be Low in Vitamin D in Sunny South Africa?",
          href: `${JOURNAL_BASE}/can-you-be-low-in-vitamin-d-in-sunny-south-africa`,
        },
      ],
    },
  },

  "nutrizen-zinc-copper-selenium": {
    title: "Zinc, Copper & Selenium Supplement South Africa | NutriZen",
    metaDescription:
      "Chelated zinc balanced with copper and selenium for immune defence, skin and thyroid support. Made in South Africa. R199, free delivery over R690.",
    descriptorLine: "Chelated zinc balanced with copper and selenium",
    newFaqs: [
      {
        question: "Why is copper added to a zinc supplement?",
        answer:
          "Taking zinc on its own over time can lower copper levels, because the two compete for absorption. Adding a balanced amount of copper helps keep the two minerals in proportion.",
      },
      {
        question: "Is zinc good for immunity?",
        answer:
          "Zinc contributes to the normal function of the immune system. This formula combines it with selenium, which supports the body's antioxidant defences.",
      },
    ],
    relatedReading: {
      collectionHandle: "immunity-and-defense",
      collectionLabel: "Immunity & Defense",
      journalLinks: [
        {
          title: "Zinc, Copper, and Selenium: Why Balance Matters",
          href: `${JOURNAL_BASE}/zinc-copper-and-selenium-why-balance-matters`,
        },
      ],
    },
  },

  "nutrizen-vitacore-b-complex": {
    title: "Vitamin B Complex South Africa | Vitacore | NutriZen",
    metaDescription:
      "Vitamins B1–B9 with choline, inositol, taurine and NAC for energy metabolism and nervous system support. Made in South Africa. R279, free delivery over R690.",
    descriptorLine: "B-vitamins with choline, taurine and NAC for everyday energy",
    newFaqs: [
      {
        question: "Does Vitacore contain vitamin B12?",
        answer:
          "No. Vitacore contains vitamins B1 to B9 with choline, inositol, taurine and NAC. If you need B12, for example if you're over 50, vegan or on long-term metformin or acid-reducing medication, ask your doctor about testing and a separate B12 supplement.",
      },
      {
        question: "When is the best time to take a B-complex?",
        answer:
          "With breakfast or lunch. B-vitamins support energy metabolism, so most people prefer to take them earlier in the day rather than at night.",
      },
    ],
    relatedReading: {
      collectionHandle: "energy-and-vitality",
      collectionLabel: "Energy & Vitality",
      journalLinks: [
        {
          title: "B-Complex Vitamins Explained: What Each One Does",
          href: `${JOURNAL_BASE}/b-complex-vitamins-explained-what-each-one-does`,
        },
      ],
    },
  },

  "nutrizen-magnesium-complex": {
    title: "Magnesium Complex South Africa | 4 Magnesium Forms | NutriZen",
    metaDescription:
      "Magnesium bisglycinate, citrate, malate and oxide in one capsule for sleep, stress and muscle cramps. Halal, GMO free. R259, free delivery over R690.",
    descriptorLine: "Four forms of magnesium for sleep, stress and cramps",
    newFaqs: [
      {
        question: "What are the four forms of magnesium in this formula?",
        answer:
          "Bisglycinate, citrate, malate and oxide. Each form has different absorption and digestive effects, so combining them gives a broad, balanced magnesium intake in one capsule.",
      },
      {
        question: "Can I take magnesium every day?",
        answer:
          "Yes, magnesium is suitable for daily use at the recommended dose. If you have kidney disease or take prescription medication, check with your doctor or pharmacist first.",
      },
      {
        question: "Is Magnesium Complex halal?",
        answer: "It is labelled halal and GMO free. NutriZen is not currently certified by a halal authority.",
      },
    ],
    relatedReading: {
      collectionHandle: "stress-sleep-and-mood",
      collectionLabel: "Stress, Sleep & Mood",
      journalLinks: [
        {
          title: "Magnesium Glycinate vs Citrate vs Oxide: Which One Should You Choose?",
          href: `${JOURNAL_BASE}/magnesium-glycinate-vs-citrate-vs-oxide-which-one-should-you-choose`,
        },
      ],
    },
  },

  "nutrizen-metabol-plus-improve-metabolism": {
    title: "Metabol+ Digestive & Metabolism Support | NutriZen South Africa",
    metaDescription:
      "Fenugreek, ajwain and fennel in a herbal formula for bloating, gas and heavy meals, supporting healthy digestion and metabolism. R199, free delivery over R690.",
    descriptorLine: "Fenugreek, ajwain and fennel for bloating and heavy meals",
    newFaqs: [
      {
        question: "What does Metabol+ help with?",
        answer:
          "Metabol+ combines fenugreek, ajwain (carom seed) and fennel, herbs traditionally used for digestion. It supports comfortable digestion after meals and may help with bloating, gas and a heavy feeling after eating.",
      },
      {
        question: "When should I take Metabol+?",
        answer:
          "About an hour before meals, as directed on the label. Taking it before your larger meals gives it time to work alongside digestion.",
      },
    ],
    relatedReading: {
      collectionHandle: "detox-and-digestive-health",
      collectionLabel: "Detox & Digestive Health",
      journalLinks: [
        {
          title: "Bloating After Eating: Causes and Natural Support",
          href: `${JOURNAL_BASE}/bloating-after-eating`,
        },
      ],
    },
  },

  "nutrizen-magnesium-oxide": {
    title: "Magnesium Oxide Supplement South Africa | NutriZen",
    metaDescription:
      "High-potency magnesium oxide for muscle cramps, occasional constipation and restful sleep. Made in South Africa. R199, free delivery over R690.",
    descriptorLine: "High-potency magnesium oxide for cramps and regularity",
    newFaqs: [
      {
        question: "What is magnesium oxide best for?",
        answer:
          "Magnesium oxide provides a high amount of magnesium per capsule and has a mild natural laxative effect, so it is often chosen for occasional constipation and muscle cramps.",
      },
      {
        question: "Magnesium oxide or Magnesium Complex?",
        answer:
          "Choose Magnesium Oxide for regularity and cramps. Choose Magnesium Complex if sleep and stress are your main focus, as it adds gentler forms such as bisglycinate.",
      },
    ],
    relatedReading: {
      collectionHandle: "bone-muscle-and-recovery",
      collectionLabel: "Bone, Muscle & Recovery",
      journalLinks: [
        {
          title: "Magnesium Glycinate vs Citrate vs Oxide: Which One Should You Choose?",
          href: `${JOURNAL_BASE}/magnesium-glycinate-vs-citrate-vs-oxide-which-one-should-you-choose`,
        },
      ],
    },
  },

  "nutrizen-glutathione-precursor-nac": {
    title: "NAC & Glutathione Precursor Supplement South Africa | NutriZen",
    metaDescription:
      "N-acetyl-cysteine with glycine, glutamine and cysteine, the building blocks of glutathione, for antioxidant, liver and respiratory support. R279.",
    descriptorLine: "NAC and the amino acids your body uses to make glutathione",
    newFaqs: [
      {
        question: "Is it better to take NAC or glutathione?",
        answer:
          "Glutathione taken by mouth is broken down in digestion, so many formulas supply its building blocks instead. This formula provides NAC with glycine, glutamine and cysteine, which the body uses to make its own glutathione.",
      },
      {
        question: "Can I buy NAC in South Africa?",
        answer:
          "Yes. NutriZen Glutathione Precursor + NAC is available online with nationwide delivery, free on orders over R690.",
      },
    ],
    relatedReading: {
      collectionHandle: "cellular-health-and-longevity",
      collectionLabel: "Cellular Health & Longevity",
      journalLinks: [
        {
          title: "NAC vs Glutathione: What Is the Difference?",
          href: `${JOURNAL_BASE}/nac-vs-glutathione-what-is-the-difference`,
        },
      ],
    },
  },

  "nutrizen-cellunex-insulin-support": {
    title: "Cellunex Blood Sugar Support Supplement | NutriZen South Africa",
    metaDescription:
      "Bitter melon, cinnamon bark and gymnema with prebiotic fibre for healthy glucose metabolism, steadier energy and fewer cravings. R399, free delivery over R690.",
    descriptorLine: "Bitter melon, cinnamon and gymnema for glucose metabolism support",
    newFaqs: [
      {
        question: "Can I take Cellunex if I'm on diabetes medication?",
        answer:
          "Speak to your doctor first. Cellunex supports healthy glucose metabolism and may add to the effect of glucose-lowering medication, so your dose may need to be monitored.",
      },
      {
        question: "What is gymnema?",
        answer:
          "Gymnema sylvestre is a herb traditionally used in Ayurvedic practice. It is included in Cellunex with bitter melon and cinnamon bark to support healthy glucose metabolism and help reduce sugar cravings.",
      },
    ],
    relatedReading: {
      collectionHandle: "metabolism-and-blood-sugar",
      collectionLabel: "Metabolism & Blood Sugar",
      journalLinks: [
        {
          title: "Blood Sugar Support: Lifestyle and Nutrient Foundations",
          href: `${JOURNAL_BASE}/blood-sugar-support-lifestyle-and-nutrient-foundations`,
        },
      ],
    },
  },

  "nutrizen-adaptogen-plus-complex": {
    title: "Ashwagandha & Adaptogen Supplement South Africa | NutriZen",
    metaDescription:
      "Ashwagandha, rhodiola, reishi and Siberian ginseng in one adaptogen formula for stress, steady energy and calm focus. R279, free delivery over R690.",
    descriptorLine: "Ashwagandha, rhodiola and reishi for stress and steady energy",
    newFaqs: [
      {
        question: "What are adaptogens?",
        answer:
          "Adaptogens are herbs and mushrooms traditionally used to help the body cope with stress. Adaptogen+ combines ashwagandha, rhodiola, reishi, Siberian ginseng and other botanicals in one formula.",
      },
      {
        question: "Who should avoid Adaptogen+?",
        answer:
          "Speak to a healthcare professional before use if you are pregnant or breastfeeding, have a thyroid condition, or take medication for blood pressure, sleep or blood sugar.",
      },
    ],
    relatedReading: {
      collectionHandle: "stress-sleep-and-mood",
      collectionLabel: "Stress, Sleep & Mood",
      journalLinks: [
        {
          title: "Adaptogens Explained: Ashwagandha, Rhodiola, Maca, and More",
          href: `${JOURNAL_BASE}/adaptogens-explained-ashwagandha-rhodiola-maca-and-more`,
        },
      ],
    },
  },

  "nutrizen-daily-immunity-recovery-stack": {
    title: "Immunity Supplement Bundle South Africa | NutriZen",
    metaDescription:
      "Zinc + Copper & Selenium, Vitamin D3 + Magnesium Glycinate and Glutathione + NAC together for immune support and recovery. R674, save R75, free delivery.",
    descriptorLine: "Three formulas for daily immune support and recovery",
    newFaqs: [
      {
        question: "What's in the immunity stack?",
        answer:
          "Three NutriZen formulas: Zinc + Copper & Selenium, Vitamin D3 + Magnesium Glycinate, and Glutathione Precursor + NAC. Together they support immune function, antioxidant defences and recovery.",
      },
      {
        question: "How much do I save with the bundle?",
        answer:
          "The three formulas cost R749 separately and R674 as a bundle, a saving of R75. The bundle also qualifies for free delivery.",
      },
    ],
    relatedReading: {
      collectionHandle: "immunity-and-defense",
      collectionLabel: "Immunity & Defense",
      journalLinks: [
        {
          title: "Vitamin D3 and Magnesium: Why They Are Often Taken Together",
          href: `${JOURNAL_BASE}/vitamin-d3-and-magnesium-why-they-are-often-taken-together`,
        },
      ],
    },
  },

  "nutrizen-iron-plus-supplement": {
    title: "Iron Bisglycinate South Africa | Iron+ with Vitamin C | NutriZen",
    metaDescription:
      "Gentle iron bisglycinate with buffered vitamin C and spirulina for red blood cell formation and energy. Test your iron first. R269, free delivery over R690.",
    descriptorLine: "Gentle iron bisglycinate with buffered vitamin C",
    newFaqs: [
      {
        question: "Should I test my iron before taking an iron supplement?",
        answer:
          "Yes. Iron builds up in the body, so it should only be taken when levels are low. Ask your doctor for a blood test that includes ferritin, especially if you're a man or post-menopausal.",
      },
      {
        question: "Why iron bisglycinate?",
        answer:
          "Iron bisglycinate is a chelated form of iron that is generally gentler on the stomach than ferrous sulphate. Iron+ adds buffered vitamin C, which supports iron absorption.",
      },
    ],
    relatedReading: {
      collectionHandle: "energy-and-vitality",
      collectionLabel: "Energy & Vitality",
      journalLinks: [
        {
          title: "Iron Bisglycinate vs Regular Iron: Why “Gentle Iron” Matters",
          href: `${JOURNAL_BASE}/iron-bisglycinate-vs-regular-iron-why-gentle-iron-matters`,
        },
        {
          title: "What Not to Take With Iron Supplements",
          href: `${JOURNAL_BASE}/what-not-to-take-with-iron-supplements`,
        },
      ],
    },
  },

  "nutrizen-para-cleanse-complex": {
    title: "Para-Cleanse Herbal Parasite Cleanse South Africa | NutriZen",
    metaDescription:
      "Black walnut hull, wormwood and clove in a traditional herbal cleanse, taken for 2–4 weeks starting before the full moon. R249, free delivery over R690.",
    descriptorLine: "Black walnut, wormwood and clove herbal cleanse",
    newFaqs: [
      {
        question: "How do I use Para-Cleanse?",
        answer:
          "Start three days before the full moon and take one capsule twice daily with meals for two to four weeks, as directed on the label. Drink plenty of water during the cleanse.",
      },
      {
        question: "Who should not use Para-Cleanse?",
        answer:
          "Do not use it if you are pregnant or breastfeeding, and speak to a doctor first if you take medication or have a medical condition. If you suspect an infection, see a doctor for testing.",
      },
    ],
    relatedReading: {
      collectionHandle: "detox-and-digestive-health",
      collectionLabel: "Detox & Digestive Health",
      journalLinks: [
        {
          title: "How to Do a Herbal Parasite Cleanse: Timing, Ingredients and Safety",
          href: `${JOURNAL_BASE}/how-to-do-a-herbal-parasite-cleanse`,
        },
      ],
    },
  },
};
