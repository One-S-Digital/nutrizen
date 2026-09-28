export const revalidate = 86400; // 24 hours — static content

import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/seo/FaqAccordion";
import JsonLd from "@/components/seo/JsonLd";
import StoryFinalCta from "@/components/story/StoryFinalCta";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";
const CANONICAL = `${SITE_URL}/pages/magnesium-south-africa`;
const LAST_REVIEWED = "2026-09-28";

export const metadata: Metadata = {
  // Plain string, no "| NutriZen" suffix — the root layout's title.template adds it.
  title: "Magnesium Supplements South Africa: Forms, Uses & How to Choose",
  description:
    "Which magnesium supplement is right for you? Glycinate, citrate, oxide and malate compared for sleep, stress, cramps and digestion, with prices.",
  keywords: [
    "magnesium supplement South Africa",
    "magnesium glycinate vs citrate",
    "magnesium for sleep",
    "magnesium for cramps",
    "best magnesium South Africa",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    url: CANONICAL,
    title: "Magnesium Supplements South Africa: Forms, Uses & How to Choose | NutriZen",
    description:
      "Which magnesium supplement is right for you? Glycinate, citrate, oxide and malate compared for sleep, stress, cramps and digestion, with prices.",
  },
};

const FAQS = [
  {
    question: "Which magnesium is best for sleep?",
    answer:
      "Glycinate (bisglycinate) is the form most often chosen for evening use because it's gentle on the stomach and supports relaxation.",
  },
  {
    question: "Can I take magnesium every day?",
    answer:
      "Yes, magnesium is suitable for daily use at the recommended dose. Speak to your doctor first if you have kidney disease or take prescription medication.",
  },
  {
    question: "What's the difference between magnesium citrate and oxide?",
    answer:
      "Citrate is better absorbed and milder; oxide is more concentrated and has a stronger laxative effect. Both are commonly used for regularity.",
  },
  {
    question: "Can magnesium help with anxiety?",
    answer:
      "Magnesium contributes to normal nervous system function, and some people find it supports a sense of calm, but it isn't a treatment for anxiety. Speak to a healthcare professional if anxiety is ongoing.",
  },
  {
    question: "Is it safe to combine magnesium with other supplements?",
    answer:
      "Usually, yes, but check for overlap if you're taking more than one magnesium-containing product, and speak to a pharmacist if you're on regular medication.",
  },
];

const FORMS_TABLE = [
  {
    form: "Magnesium glycinate (bisglycinate)",
    bestFor: "Calm, relaxation, sleep",
    product: { title: "Vitamin D3 + Magnesium Glycinate", handle: "nutrizen-vitamin-d3-magnesium-glycinate" },
    price: "R269",
  },
  {
    form: "Oxide, citrate, bisglycinate & malate (complex)",
    bestFor: "Broad daily support — sleep, stress, muscles, digestion",
    product: { title: "Magnesium Complex", handle: "nutrizen-magnesium-complex" },
    price: "R259",
  },
  {
    form: "Magnesium oxide (concentrated)",
    bestFor: "Regularity, occasional constipation, cramps",
    product: { title: "Magnesium Oxide", handle: "nutrizen-magnesium-oxide" },
    price: "R199",
  },
];

export default function MagnesiumHubPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Which magnesium is right for you?",
    description: metadata.description,
    url: CANONICAL,
    mainEntityOfPage: CANONICAL,
    datePublished: LAST_REVIEWED,
    dateModified: LAST_REVIEWED,
    author: { "@type": "Organization", name: "NutriZen South Africa" },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Magnesium in South Africa", item: CANONICAL },
    ],
  };

  return (
    <div className="flex flex-col">
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <section className="relative overflow-hidden bg-background-main pt-10 pb-12 md:pb-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/12 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Magnesium guide</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-neutral-darkest md:text-5xl">
            Which magnesium is <em className="italic text-primary">right</em> for you?
          </h1>
          <p className="mt-3 text-sm text-neutral-dark">Last reviewed: 28 September 2026</p>
          <div className="mt-6 max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <p className="mb-1 text-sm font-semibold text-primary">In short</p>
            <p className="text-neutral-dark leading-relaxed">
              Magnesium supports muscle function, nerve signalling, sleep and bone health, but no single form
              works best for every goal. Glycinate suits calm and sleep, citrate and oxide suit digestion and
              regularity, and a multi-form complex covers more ground at once. Match the form to what you&apos;re
              trying to fix.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background-main px-6 pb-24 pt-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">What does magnesium do?</h2>
          <p className="text-neutral-dark leading-relaxed">
            Magnesium is involved in hundreds of processes in the body — muscle contraction and relaxation,
            nerve signalling, energy production, and maintaining a steady heart rhythm. It also contributes to
            normal bone structure and helps regulate blood pressure.
          </p>
          <p className="mt-4 text-neutral-dark leading-relaxed">
            Because it&apos;s needed in so many places, low intake can show up in different ways: cramping, poor
            sleep, tension, or low energy. Most South African diets provide some magnesium through leafy greens,
            nuts, seeds and whole grains, but modern diets, stress and certain medications can all reduce how
            much the body actually retains.
          </p>

          <h2 className="mt-14 text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">
            Signs you may be low in magnesium
          </h2>
          <ul className="space-y-2 text-neutral-dark leading-relaxed">
            {[
              "Muscle cramps or twitches, especially in the calves at night",
              "Trouble winding down or restless sleep",
              "Tension headaches",
              "Fatigue that doesn't match your activity level",
              "Constipation or irregular digestion",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-neutral-dark leading-relaxed">
            These signs are common and have many possible causes, so they&apos;re not proof of a magnesium
            shortfall on their own. If they persist, a blood test can help confirm whether magnesium is part of
            the picture.
          </p>

          <h2 className="mt-14 text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">
            Magnesium forms compared
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-neutral-light/80">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-alt text-neutral-darkest">
                <tr>
                  <th className="px-4 py-3 font-semibold">Form</th>
                  <th className="px-4 py-3 font-semibold">Best for</th>
                  <th className="px-4 py-3 font-semibold">NutriZen product</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-light/70">
                {FORMS_TABLE.map((row) => (
                  <tr key={row.form}>
                    <td className="px-4 py-3 text-neutral-dark">{row.form}</td>
                    <td className="px-4 py-3 text-neutral-dark">{row.bestFor}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/products/${row.product.handle}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {row.product.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-dark">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-neutral-dark leading-relaxed">
            If you only want one form, start with your main goal: glycinate for evening calm, a complex for
            all-round support, or oxide if regularity is the main concern.
          </p>

          <h2 className="mt-14 text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">Magnesium for sleep</h2>
          <p className="text-neutral-dark leading-relaxed">
            Magnesium contributes to normal muscle relaxation and nervous system function, which is why many
            people take it in the evening. Glycinate (bisglycinate) is the form most often chosen for this
            because it&apos;s gentle on the stomach and less likely to cause the laxative effect some other forms
            have. A consistent bedtime routine and reduced screen time before bed still matter more than any
            single supplement.
          </p>

          <h2 className="mt-14 text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">
            Magnesium for muscle cramps
          </h2>
          <p className="text-neutral-dark leading-relaxed">
            Low magnesium is one of several factors linked to muscle cramps, particularly at night. Magnesium
            contributes to normal muscle function, so a consistent daily intake may help if low levels are part
            of the cause. Dehydration, prolonged standing or sitting, and intense exercise are other common
            triggers worth ruling out first. For more on this, see our guide to{" "}
            <Link href="/blogs/news/magnesium-for-night-leg-cramps" className="font-medium text-primary hover:underline">
              magnesium and night leg cramps
            </Link>
            .
          </p>

          <h2 className="mt-14 text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">
            Magnesium for constipation
          </h2>
          <p className="text-neutral-dark leading-relaxed">
            Magnesium oxide and magnesium citrate both draw water into the bowel, which is why they&apos;re
            commonly used for occasional constipation. Oxide is more concentrated and has a stronger effect;
            citrate is milder and better absorbed. Start with the lower end of the suggested dose and drink
            enough water alongside it.
          </p>

          <h2 className="mt-14 text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">
            Medications that can lower magnesium
          </h2>
          <p className="text-neutral-dark leading-relaxed">
            Certain medications can reduce magnesium levels over time, including long-term proton-pump
            inhibitors (reflux medication), some diuretics, and certain antibiotics. If you take any of these
            regularly and notice cramping, fatigue or poor sleep, it&apos;s worth asking your doctor or
            pharmacist whether your magnesium should be checked. See our full guide on{" "}
            <Link href="/blogs/news/medications-that-lower-magnesium" className="font-medium text-primary hover:underline">
              medications that can lower magnesium
            </Link>
            .
          </p>

          <h2 className="mt-14 text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">
            How much magnesium per day?
          </h2>
          <p className="text-neutral-dark leading-relaxed">
            Recommended daily intakes for adults are generally in the region of 300–420 mg, depending on age
            and sex, though needs can vary. Follow the dose on your NutriZen product label rather than combining
            multiple magnesium products at once, since elemental magnesium can add up quickly across formulas.
            If you have kidney disease, speak to your doctor before supplementing, since the kidneys clear
            excess magnesium.
          </p>

          <div className="mt-10 text-sm text-neutral-dark">
            <span className="font-semibold text-neutral-darkest">Shop by goal: </span>
            <Link href="/collections/stress-sleep-and-mood" className="text-primary hover:underline">
              Stress, Sleep &amp; Mood
            </Link>
            {" · "}
            <Link href="/collections/bone-muscle-and-recovery" className="text-primary hover:underline">
              Bone, Muscle &amp; Recovery
            </Link>
            {" · "}
            <Link
              href="/blogs/news/magnesium-glycinate-vs-citrate-vs-oxide-which-one-should-you-choose"
              className="text-primary hover:underline"
            >
              Magnesium forms compared
            </Link>
          </div>

          <div className="mt-14">
            <h2 className="text-xl font-bold text-neutral-darkest mb-4">Frequently asked questions</h2>
            <FaqAccordion items={FAQS} />
          </div>
        </div>
      </section>

      <StoryFinalCta />
    </div>
  );
}
