import Link from "next/link";
import FaqAccordion from "@/components/seo/FaqAccordion";
import type { CollectionSeoContent } from "@/lib/seo-content/collections";

export default function CollectionSeoSection({ content }: { content: CollectionSeoContent }) {
  return (
    <section className="mt-16 border-t border-neutral-light/80 pt-14">
      <div className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">{content.h2}</h2>
        <p className="text-neutral-dark leading-relaxed">{content.answer}</p>
        <p className="mt-4 text-neutral-darkest">
          <span className="font-semibold">Start with:</span> {content.startWith}
        </p>
      </div>

      <div className="mt-10 max-w-3xl">
        <h3 className="text-lg font-semibold text-neutral-darkest mb-4">Frequently asked questions</h3>
        <FaqAccordion items={content.faqs} />
      </div>

      {content.relatedReading.length > 0 ? (
        <div className="mt-8 max-w-3xl text-sm text-neutral-dark">
          <span className="font-semibold text-neutral-darkest">Related reading: </span>
          {content.relatedReading.map((link, i) => (
            <span key={link.href}>
              <Link href={link.href} className="text-primary hover:underline">
                {link.title}
              </Link>
              {i < content.relatedReading.length - 1 ? " · " : ""}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
