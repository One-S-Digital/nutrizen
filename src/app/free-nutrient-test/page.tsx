import type { Metadata } from "next";
import QuizClient from "@/components/quiz/QuizClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export const metadata: Metadata = {
  title: "Free Nutrient Test",
  description:
    "Ten short questions about how you've been feeling. Find out which nutrients your symptoms point to, and why — a wellness guide, not a medical assessment.",
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

export default function FreeNutrientTestPage() {
  return <QuizClient />;
}
