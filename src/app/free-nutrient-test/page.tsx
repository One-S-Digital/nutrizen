import type { Metadata } from "next";
import QuizClient from "@/components/quiz/QuizClient";
import NutrientTestInfoSections from "@/components/quiz/NutrientTestInfoSections";
import JsonLd from "@/components/seo/JsonLd";
import { NUTRIENT_TEST_FAQS } from "@/lib/seo-content/nutrient-test";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export const metadata: Metadata = {
  title: "Free Nutrient Test: Which Supplement Do I Need?",
  description:
    "Answer 10 quick questions about energy, sleep, stress and digestion to see which nutrients your symptoms point to. Free, 2 minutes, no diagnosis.",
  keywords: [
    "nutrient deficiency quiz",
    "vitamin deficiency test",
    "what supplements do I need",
    "NutriZen quiz",
  ],
  alternates: { canonical: `${SITE_URL}/free-nutrient-test` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/free-nutrient-test`,
    title: "Free Nutrient Test | NutriZen",
    description: "Find out what your body is running low on — ten short questions, personalised results.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: NUTRIENT_TEST_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function FreeNutrientTestPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <QuizClient />
      <NutrientTestInfoSections />
    </>
  );
}
