import Link from "next/link";
import type { ProductRelatedReading } from "@/lib/seo-content/products";

type Props = {
  relatedReading: ProductRelatedReading;
};

export function RelatedReading({ relatedReading }: Props) {
  const { collectionHandle, collectionLabel, journalLinks } = relatedReading;

  return (
    <section className="rounded-[1.25rem] border border-neutral-light/80 bg-white p-6 shadow-sm md:p-8">
      <h3 className="mb-4 text-lg font-bold text-neutral-darkest">Related reading</h3>
      <ul className="space-y-2.5 text-sm">
        <li>
          <Link
            href={`/collections/${collectionHandle}`}
            className="font-medium text-primary hover:underline"
          >
            Shop the {collectionLabel} range →
          </Link>
        </li>
        {journalLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="font-medium text-primary hover:underline">
              {link.title} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
