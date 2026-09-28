export const revalidate = 86400; // 24 hours — static content

import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/seo/FaqAccordion";
import JsonLd from "@/components/seo/JsonLd";
import StoryFinalCta from "@/components/story/StoryFinalCta";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";
const CANONICAL = `${SITE_URL}/pages/quality`;

export const metadata: Metadata = {
  // Absolute: this title ends in "NutriZen South Africa", not "| NutriZen", so the
  // root layout's title.template would double-brand it if used as a plain string.
  title: { absolute: "Quality & Sourcing | NutriZen South Africa" },
  description:
    "How NutriZen supplements are made: manufactured in South Africa, halal and GMO free labelled, no proprietary blends, and full ingredient disclosure.",
  keywords: [
    "NutriZen quality",
    "supplement manufacturing South Africa",
    "no proprietary blend supplements",
    "halal supplements South Africa",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    url: CANONICAL,
    title: "Quality & Sourcing | NutriZen South Africa",
    description:
      "How NutriZen supplements are made: manufactured in South Africa, halal and GMO free labelled, no proprietary blends, and full ingredient disclosure.",
  },
};

const FAQS = [
  {
    question: "Are NutriZen supplements made in South Africa?",
    answer:
      "Yes. All NutriZen supplements are made in South Africa and delivered nationwide, so there are no import delays or customs fees.",
  },
  {
    question: "What does “no proprietary blend” mean?",
    answer:
      "It means every ingredient on a NutriZen label is listed with its own amount, rather than several ingredients being hidden under one combined weight.",
  },
  {
    question: "Are NutriZen supplements halal certified?",
    answer:
      "NutriZen products are labelled halal and GMO free, but we are not currently certified by a halal authority. Every ingredient is listed so you can check it yourself.",
  },
  {
    question: "Do NutriZen formulas contain fillers or artificial colourants?",
    answer: "No. NutriZen formulas are free from preservatives, lactose, fillers, artificial colourants and starch.",
  },
];

export default function QualityPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Quality & Sourcing",
    description: metadata.description,
    url: CANONICAL,
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
      { "@type": "ListItem", position: 2, name: "Quality & Sourcing", item: CANONICAL },
    ],
  };

  return (
    <div className="flex flex-col">
      <JsonLd data={webPageSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <section className="relative overflow-hidden bg-background-main pt-10 pb-12 md:pb-16">
        <div className="pointer-events-none absolute right-1/4 top-0 h-[380px] w-[380px] rounded-full bg-secondary/12 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Quality &amp; sourcing</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-neutral-darkest md:text-5xl">
            What&apos;s in <em className="italic text-primary">every</em> bottle.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-dark">
            Where NutriZen formulas are made, what goes into them, and what we deliberately leave out.
          </p>
        </div>
      </section>

      <section className="bg-background-main px-6 pb-24 pt-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">Made in South Africa</h2>
          <p className="text-neutral-dark leading-relaxed">
            Every NutriZen formula is manufactured in South Africa, from sourcing through to the finished
            capsule. That means shorter supply chains, no import delays, and easier accountability if something
            needs to be checked. Products are dispatched from within South Africa and delivered nationwide, with
            free delivery over R690.
          </p>

          <h2 className="mt-14 text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">
            Full ingredient disclosure
          </h2>
          <p className="text-neutral-dark leading-relaxed">
            Every active ingredient is listed on the label, with its form and amount, not folded into a vague
            &quot;blend.&quot; If a formula combines several nutrients, you can see what each one is and how much
            of it is included, so you can compare it against what you already take.
          </p>

          <h2 className="mt-14 text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">
            No proprietary blends
          </h2>
          <p className="text-neutral-dark leading-relaxed">
            NutriZen does not use proprietary blends. A proprietary blend lists ingredients under one combined
            weight, which hides how much of each ingredient is actually present. Every NutriZen formula shows
            individual ingredients and amounts, so nothing is left for you to guess at.
          </p>

          <h2 className="mt-14 text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">
            Halal and GMO free
          </h2>
          <p className="text-neutral-dark leading-relaxed">
            NutriZen products are labelled halal and GMO free. We are not currently certified by a halal
            authority such as SANHA or MJC. Every ingredient is listed on each product page, so you can check a
            formula against your own requirements before buying.
          </p>

          <h2 className="mt-14 text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">What we leave out</h2>
          <p className="text-neutral-dark leading-relaxed">
            NutriZen formulas are free from preservatives, lactose, fillers, artificial colourants and starch.
            Leaving these out keeps the capsule focused on the ingredients that are actually doing something,
            rather than padding the formula with inactive bulk.
          </p>

          <h2 className="mt-14 text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">Label accuracy</h2>
          <p className="text-neutral-dark leading-relaxed">
            Product pages are kept in line with what&apos;s actually inside each capsule; if a formula&apos;s
            ingredient list changes, the page is updated to match. If you spot something on a label or product
            page that looks unclear or inconsistent,{" "}
            <Link href="/pages/contact" className="font-medium text-primary hover:underline">
              contact us
            </Link>{" "}
            and we&apos;ll check it.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
            <Link href="/pages/science" className="text-primary hover:underline">
              How we formulate
            </Link>
            <Link href="/pages/about" className="text-primary hover:underline">
              Our story
            </Link>
            <Link href="/pages/faq" className="text-primary hover:underline">
              FAQ
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
