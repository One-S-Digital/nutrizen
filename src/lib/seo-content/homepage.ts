/** Homepage SEO/GEO copy — About + FAQ sections (NutriZen SEO-GEO Developer Spec §3.3). */

export const HOME_ABOUT = {
  heading: "About NutriZen South Africa",
  body: "NutriZen South Africa makes targeted vitamins and supplements for sleep, stress, energy, immunity, digestion and metabolic support. Every formula is made in South Africa, uses no proprietary blends and lists its ingredients in full. Orders are delivered nationwide, with free delivery over R690.",
  links: [
    { label: "How we formulate", href: "/pages/science" },
    { label: "Our story", href: "/pages/about" },
  ],
};

export type HomeFaqItem = { question: string; answer: string };

export const HOME_FAQS: HomeFaqItem[] = [
  {
    question: "What is NutriZen?",
    answer:
      "NutriZen is a South African supplement brand selling targeted formulas online. The range covers magnesium, vitamin D, iron, zinc, B-vitamins, adaptogens, antioxidants, digestive support, blood sugar support and a herbal cleanse. Every formula lists its ingredients in full, with no proprietary blends.",
  },
  {
    question: "Where are NutriZen supplements made?",
    answer:
      "All NutriZen supplements are made in South Africa and delivered nationwide from here, so there are no import delays or customs fees. Orders over R690 ship free, and our team is available on WhatsApp every day if you have questions about a formula.",
  },
  {
    question: "Are NutriZen supplements halal?",
    answer:
      "NutriZen products are labelled halal and GMO free. We are not currently certified by a halal authority such as SANHA or MJC. Every ingredient is listed on each product page, so you can check a formula against your own requirements.",
  },
  {
    question: "Which supplement should I start with if I'm always tired?",
    answer:
      "Ongoing tiredness can be linked to low iron, vitamin D or magnesium, among other causes. Take the free 2-minute nutrient test to see which areas your symptoms point to. If iron comes up, ask your doctor for a blood test first, since iron should only be taken when levels are low.",
  },
  {
    question: "Can I take vitamin D and magnesium together?",
    answer:
      "Yes. Magnesium helps the body convert vitamin D into its active form, which is why the two are often taken together. NutriZen Vitamin D3 + Magnesium Glycinate combines both in one capsule. Take it with a meal that contains some healthy fat to help vitamin D absorption.",
  },
  {
    question: "How long before I notice a difference?",
    answer:
      "It depends on the formula and your starting levels. Some people notice changes in sleep or digestion within the first week or two, while nutrient levels usually take four to eight weeks of daily use to build. Each product page has a \"How you'll feel\" timeline.",
  },
  {
    question: "How much is delivery in South Africa?",
    answer:
      "Delivery is free on orders over R690. Orders below that pay a flat-rate delivery fee, shown at checkout. We deliver nationwide, with express shipping available on most products, and you have 30 days to return an order if you're not satisfied.",
  },
];
