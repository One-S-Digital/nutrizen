/**
 * Free nutrient test page — new crawlable content, NutriZen SEO-GEO Developer
 * Spec §4.3. Rendered as static server HTML below the interactive quiz, since
 * the quiz app itself is client-only and not crawlable.
 */

export const HOW_IT_WORKS_STEPS = [
  "Answer 10 short questions about your energy, sleep, stress, digestion and lifestyle.",
  "See which nutrient areas your answers point to, with an explanation for each.",
  "Get a recommendation of up to four NutriZen formulas, with the reasoning behind each one.",
] as const;

export const WHAT_IT_CANT_TELL_YOU =
  "The test looks for patterns in common symptoms, such as tiredness, poor sleep, muscle cramps and frequent colds, that are often linked to low magnesium, vitamin D, iron, zinc or B-vitamins. It is a wellness guide, not a medical assessment or a diagnosis.";

export type NutrientTestFaq = { question: string; answer: string };

export const NUTRIENT_TEST_FAQS: NutrientTestFaq[] = [
  {
    question: "Is the nutrient test free?",
    answer: "Yes. It's free, takes about two minutes, and there's no obligation to buy.",
  },
  {
    question: "Can the test diagnose a deficiency?",
    answer:
      "No. It points to nutrient areas worth exploring, based on the symptoms you describe. It is a wellness guide, not a medical assessment.",
  },
  {
    question: "Which supplement do I need?",
    answer:
      "It depends on your symptoms, diet and lifestyle. The test matches your answers to the most relevant NutriZen formulas and explains why each one fits.",
  },
  {
    question: "What happens to my answers?",
    answer:
      "Your answers are used only to build your result. If you choose to receive your results by email, we ask for your consent first.",
  },
];
