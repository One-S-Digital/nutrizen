/**
 * Journal (blog) SEO/GEO copy — NutriZen SEO-GEO Developer Spec §5.
 * Keyed by live Shopify article handle (verified against the store, 2026-09-28).
 * The duplicate "-1" post 301-redirects to its canonical handle (next.config.ts),
 * so only the canonical handle needs an entry here.
 */

export type JournalFaq = { question: string; answer: string };

export type JournalShopTopic = {
  productHandle: string;
  productLabel: string;
  collectionHandle: string;
  collectionLabel: string;
};

export type JournalSeoContent = {
  metaDescription: string;
  inShort: string;
  faqs: JournalFaq[];
  shopThisTopic: JournalShopTopic;
  /** ISO date — also used as the Article schema's dateModified. */
  lastReviewed: string;
};

export const JOURNAL_INDEX_SEO = {
  title: "Supplement Guides & Journal | NutriZen South Africa",
  metaDescription:
    "Clear, practical guides to vitamins, minerals and supplements for South Africans: magnesium, vitamin D, iron, zinc, adaptogens and more.",
  displayTitle: "Journal",
};

const LAST_REVIEWED = "2026-09-28";

export const JOURNAL_SEO_CONTENT: Record<string, JournalSeoContent> = {
  "magnesium-glycinate-vs-citrate-vs-oxide-which-one-should-you-choose": {
    metaDescription:
      "Magnesium glycinate, citrate and oxide compared: absorption, stomach comfort, and which form suits sleep, stress, cramps or constipation.",
    inShort:
      "Magnesium glycinate is gentle on the stomach and popular for evening use. Citrate is well absorbed and mildly laxative at higher doses. Oxide supplies more magnesium per capsule and is often used for regularity. If you want a mix, a multi-form formula combines them.",
    faqs: [
      {
        question: "Which magnesium is best for sleep?",
        answer:
          "Glycinate (bisglycinate) is the form most often chosen for evening use because it's gentle on the stomach.",
      },
      {
        question: "Which magnesium is best for constipation?",
        answer:
          "Oxide and citrate have a mild laxative effect, which is why they're often used for occasional constipation.",
      },
    ],
    shopThisTopic: {
      productHandle: "nutrizen-magnesium-complex",
      productLabel: "Magnesium Complex",
      collectionHandle: "stress-sleep-and-mood",
      collectionLabel: "Stress, Sleep & Mood",
    },
    lastReviewed: LAST_REVIEWED,
  },
  "can-you-be-low-in-vitamin-d-in-sunny-south-africa": {
    metaDescription:
      "Yes. Indoor work, sunscreen, winter and darker skin all limit vitamin D. Who is most at risk in South Africa, and when to consider a test.",
    inShort:
      "Yes. Sunshine alone doesn't guarantee enough vitamin D. Working indoors, using sunscreen, covering up, winter months and darker skin all reduce how much vitamin D the skin makes. South African studies have found low levels in many adults. A blood test is the only way to know your level.",
    faqs: [
      {
        question: "Who is most at risk of low vitamin D in South Africa?",
        answer:
          "Office workers, people with darker skin, older adults, and anyone who spends little time outdoors, especially in winter.",
      },
      {
        question: "How do I test my vitamin D level?",
        answer: "Ask your doctor or a pathology lab for a 25-hydroxy vitamin D blood test.",
      },
    ],
    shopThisTopic: {
      productHandle: "nutrizen-vitamin-d3-magnesium-glycinate",
      productLabel: "Vitamin D3 + Magnesium Glycinate",
      collectionHandle: "immunity-and-defense",
      collectionLabel: "Immunity & Defense",
    },
    lastReviewed: LAST_REVIEWED,
  },
  "vitamin-d3-and-magnesium-why-they-are-often-taken-together": {
    metaDescription:
      "Magnesium helps the body activate vitamin D, which is why the two are often paired. How they work together, and how to take them.",
    inShort:
      "Magnesium is needed to convert vitamin D into its active form in the body, so low magnesium can limit the benefit of vitamin D. That's why they're often taken together. Take vitamin D with a meal that contains some healthy fat to help absorption.",
    faqs: [
      {
        question: "Should I take vitamin D and magnesium at the same time?",
        answer: "Yes, they can be taken together, ideally with a meal containing some fat.",
      },
      {
        question: "What's the best time of day to take them?",
        answer:
          "Many people take them with breakfast or lunch; magnesium glycinate can also be taken in the evening.",
      },
    ],
    shopThisTopic: {
      productHandle: "nutrizen-vitamin-d3-magnesium-glycinate",
      productLabel: "Vitamin D3 + Magnesium Glycinate",
      collectionHandle: "bone-muscle-and-recovery",
      collectionLabel: "Bone, Muscle & Recovery",
    },
    lastReviewed: LAST_REVIEWED,
  },
  "iron-bisglycinate-vs-regular-iron-why-gentle-iron-matters": {
    metaDescription:
      "Iron bisglycinate vs ferrous sulphate: why chelated iron is generally gentler on the stomach, and why you should test your iron first.",
    inShort:
      "Iron bisglycinate is a chelated form of iron bound to the amino acid glycine. It is generally gentler on the stomach than ferrous sulphate and less likely to cause constipation. Whatever the form, only take iron if a blood test shows your levels are low.",
    faqs: [
      {
        question: "Is iron bisglycinate better absorbed?",
        answer:
          "It is generally well absorbed and better tolerated than ferrous sulphate, especially on an empty stomach.",
      },
      {
        question: "Do I need a blood test before taking iron?",
        answer: "Yes. Ask your doctor for a test that includes ferritin.",
      },
    ],
    shopThisTopic: {
      productHandle: "nutrizen-iron-plus-supplement",
      productLabel: "Iron+ Supplement",
      collectionHandle: "energy-and-vitality",
      collectionLabel: "Energy & Vitality",
    },
    lastReviewed: LAST_REVIEWED,
  },
  "what-not-to-take-with-iron-supplements": {
    metaDescription:
      "Coffee, tea, calcium, dairy and some medicines reduce iron absorption. What to avoid, how long to wait, and what helps iron absorb better.",
    inShort:
      "Avoid taking iron at the same time as coffee, tea, dairy, calcium supplements and antacids, as they reduce absorption. Leave about two hours between them. Vitamin C helps iron absorb. If you take thyroid or other medication, ask your pharmacist about timing.",
    faqs: [
      {
        question: "Can I take iron with coffee?",
        answer: "It's best not to. Wait at least an hour, ideally two, after taking iron.",
      },
      {
        question: "What helps iron absorb better?",
        answer: "Vitamin C, which is why Iron+ includes buffered vitamin C.",
      },
    ],
    shopThisTopic: {
      productHandle: "nutrizen-iron-plus-supplement",
      productLabel: "Iron+ Supplement",
      collectionHandle: "energy-and-vitality",
      collectionLabel: "Energy & Vitality",
    },
    lastReviewed: LAST_REVIEWED,
  },
  "zinc-copper-and-selenium-why-balance-matters": {
    metaDescription:
      "Why zinc is paired with copper and selenium: how zinc can lower copper over time, and how the three minerals support immunity and antioxidant defence.",
    inShort:
      "Zinc and copper compete for absorption, so taking zinc alone for long periods can lower copper levels. Balanced formulas add copper to prevent this. Selenium is included because it supports the body's antioxidant defences and thyroid function alongside zinc's role in immunity.",
    faqs: [
      {
        question: "Can taking zinc cause copper deficiency?",
        answer: "Long-term, high-dose zinc on its own can. Pairing it with copper helps keep the two in balance.",
      },
      {
        question: "What does selenium do?",
        answer: "It contributes to antioxidant protection, normal thyroid function and the immune system.",
      },
    ],
    shopThisTopic: {
      productHandle: "nutrizen-zinc-copper-selenium",
      productLabel: "Zinc + Copper & Selenium",
      collectionHandle: "immunity-and-defense",
      collectionLabel: "Immunity & Defense",
    },
    lastReviewed: LAST_REVIEWED,
  },
  "b-complex-vitamins-explained-what-each-one-does": {
    metaDescription:
      "What each B-vitamin does, from B1 thiamine to B9 folate, who may need more, and how to choose a B-complex supplement.",
    inShort:
      "B-vitamins help turn food into energy and support the nervous system. Each has its own role: B1, B2, B3, B5 and B6 in energy metabolism, B7 (biotin) in skin and hair, and B9 (folate) in cell division. B12 is often sold separately.",
    faqs: [
      {
        question: "When should I take a B-complex?",
        answer: "With breakfast or lunch, as B-vitamins support energy metabolism.",
      },
      {
        question: "Does a B-complex always include B12?",
        answer: "Not always. Check the label. NutriZen Vitacore contains B1–B9 and no B12.",
      },
    ],
    shopThisTopic: {
      productHandle: "nutrizen-vitacore-b-complex",
      productLabel: "Vitacore B-Complex",
      collectionHandle: "energy-and-vitality",
      collectionLabel: "Energy & Vitality",
    },
    lastReviewed: LAST_REVIEWED,
  },
  "adaptogens-explained-ashwagandha-rhodiola-maca-and-more": {
    metaDescription:
      "What adaptogens are, how ashwagandha, rhodiola, reishi and maca differ, and who should avoid them. A practical guide for South Africans.",
    inShort:
      "Adaptogens are herbs and mushrooms traditionally used to help the body cope with stress. Ashwagandha is often chosen for calm and sleep, rhodiola for mental fatigue, and reishi for general resilience. Check with a professional if you're pregnant, have a thyroid condition or take medication.",
    faqs: [
      {
        question: "How long do adaptogens take to work?",
        answer: "Most are taken daily for several weeks before people notice a difference.",
      },
      {
        question: "Can I take ashwagandha with thyroid medication?",
        answer: "Speak to your doctor first, as ashwagandha may affect thyroid hormone levels.",
      },
    ],
    shopThisTopic: {
      productHandle: "nutrizen-adaptogen-plus-complex",
      productLabel: "Adaptogen+ Complex",
      collectionHandle: "stress-sleep-and-mood",
      collectionLabel: "Stress, Sleep & Mood",
    },
    lastReviewed: LAST_REVIEWED,
  },
  "nac-vs-glutathione-what-is-the-difference": {
    metaDescription:
      "NAC vs glutathione: why oral glutathione is poorly absorbed, how NAC helps the body make its own, and which one to choose.",
    inShort:
      "Glutathione is the body's main internal antioxidant. Taken as a supplement, much of it is broken down in digestion. NAC (N-acetyl-cysteine) supplies cysteine, the building block the body most needs to make its own glutathione, which is why NAC is often preferred.",
    faqs: [
      {
        question: "Is NAC the same as glutathione?",
        answer: "No. NAC is a precursor the body uses to make glutathione.",
      },
      {
        question: "When should I take NAC?",
        answer: "On an empty stomach, in the morning or between meals.",
      },
    ],
    shopThisTopic: {
      productHandle: "nutrizen-glutathione-precursor-nac",
      productLabel: "Glutathione Precursor + NAC",
      collectionHandle: "cellular-health-and-longevity",
      collectionLabel: "Cellular Health & Longevity",
    },
    lastReviewed: LAST_REVIEWED,
  },
  "blood-sugar-support-lifestyle-and-nutrient-foundations": {
    metaDescription:
      "Everyday habits and nutrients that support healthy blood sugar, plus which botanicals are traditionally used for glucose metabolism.",
    inShort:
      "Healthy blood sugar starts with regular meals, fibre and protein, sleep and movement. Some botanicals, including bitter melon, cinnamon and gymnema, are traditionally used to support glucose metabolism and reduce cravings. If you take diabetes medication, check with your doctor before adding a supplement.",
    faqs: [
      {
        question: "What causes energy crashes after eating?",
        answer:
          "Meals high in refined carbohydrates can cause a sharp rise and fall in blood sugar, often felt as tiredness or cravings.",
      },
      {
        question: "Can supplements replace diabetes medication?",
        answer: "No. Supplements are not a replacement for prescribed treatment.",
      },
    ],
    shopThisTopic: {
      productHandle: "nutrizen-cellunex-insulin-support",
      productLabel: "Cellunex",
      collectionHandle: "metabolism-and-blood-sugar",
      collectionLabel: "Metabolism & Blood Sugar",
    },
    lastReviewed: LAST_REVIEWED,
  },
  "how-to-read-a-supplement-label-before-you-buy": {
    metaDescription:
      "How to read a supplement label: active ingredients, nutrient forms, elemental amounts, proprietary blends and fillers. A South African buyer's guide.",
    inShort:
      "Look for three things: every active ingredient with its exact amount, the form of each nutrient (such as magnesium bisglycinate rather than just \"magnesium\"), and whether any ingredients are hidden in a proprietary blend. For minerals, check the elemental amount.",
    faqs: [
      {
        question: "What is an elemental amount?",
        answer: "The amount of the actual mineral, not the whole compound it's bound to.",
      },
      {
        question: "Why avoid proprietary blends?",
        answer:
          "They hide individual doses, so you can't tell whether each ingredient is present in a useful amount.",
      },
    ],
    shopThisTopic: {
      productHandle: "nutrizen-magnesium-complex",
      productLabel: "Magnesium Complex",
      collectionHandle: "all",
      collectionLabel: "All supplements",
    },
    lastReviewed: LAST_REVIEWED,
  },
  "proprietary-blends-vs-transparent-formulas": {
    metaDescription:
      "What a proprietary blend is, why brands use them, and how transparent formulas let you compare doses before you buy.",
    inShort:
      "A proprietary blend lists ingredients under one total weight without showing individual amounts. A transparent formula shows every ingredient and its dose. Transparency lets you compare products and check whether each ingredient is present in a meaningful amount.",
    faqs: [
      {
        question: "Are proprietary blends bad?",
        answer: "Not always, but they make it impossible to check individual doses.",
      },
      {
        question: "Does NutriZen use proprietary blends?",
        answer: "No. Every NutriZen formula lists its ingredients in full.",
      },
    ],
    shopThisTopic: {
      productHandle: "nutrizen-magnesium-complex",
      productLabel: "Magnesium Complex",
      collectionHandle: "all",
      collectionLabel: "All supplements",
    },
    lastReviewed: LAST_REVIEWED,
  },
};
