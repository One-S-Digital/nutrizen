import Link from "next/link";
import FaqAccordion from "@/components/seo/FaqAccordion";
import type { JournalSeoContent } from "@/lib/seo-content/journal";

export default function JournalSeoSection({ content }: { content: JournalSeoContent }) {
  const { shopThisTopic } = content;

  return (
    <section className="mt-12 border-t border-neutral-light pt-10">
      <h2 className="text-xl font-bold text-neutral-darkest mb-4">Frequently asked questions</h2>
      <FaqAccordion items={content.faqs} />

      <div className="mt-8 rounded-2xl border border-neutral-light/80 bg-white p-6">
        <h3 className="mb-3 text-sm font-semibold text-neutral-darkest">Shop this topic</h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            href={`/products/${shopThisTopic.productHandle}`}
            className="font-medium text-primary hover:underline"
          >
            {shopThisTopic.productLabel} →
          </Link>
          <Link
            href={`/collections/${shopThisTopic.collectionHandle}`}
            className="font-medium text-primary hover:underline"
          >
            Shop {shopThisTopic.collectionLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
