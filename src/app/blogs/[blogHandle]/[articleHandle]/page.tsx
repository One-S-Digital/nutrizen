import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogArticleCached } from "@/lib/shopify";
import { JOURNAL_SEO_CONTENT } from "@/lib/seo-content/journal";
import JournalSeoSection from "@/components/journal/JournalSeoSection";
import JsonLd from "@/components/seo/JsonLd";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

type Props = { params: Promise<{ blogHandle: string; articleHandle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogHandle, articleHandle } = await params;
  const article = await getBlogArticleCached(blogHandle, articleHandle);
  if (!article) return {};

  const seoContent = JOURNAL_SEO_CONTENT[articleHandle];
  const description = seoContent?.metaDescription ?? article.seoDescription ?? article.excerpt;
  const canonical = `${SITE_URL}/blogs/${blogHandle}/${articleHandle}`;

  return {
    title: article.seoTitle ?? article.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: article.seoTitle ?? article.title,
      description,
      publishedTime: article.publishedAt,
      authors: [article.author],
      ...(article.imageUrl ? { images: [{ url: article.imageUrl, alt: article.imageAlt ?? article.title }] } : {}),
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { blogHandle, articleHandle } = await params;
  const article = await getBlogArticleCached(blogHandle, articleHandle);
  if (!article) notFound();

  const seoContent = JOURNAL_SEO_CONTENT[articleHandle];
  const canonical = `${SITE_URL}/blogs/${blogHandle}/${articleHandle}`;
  const description = seoContent?.metaDescription ?? article.seoDescription ?? article.excerpt;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    ...(description ? { description } : {}),
    ...(article.imageUrl ? { image: article.imageUrl } : {}),
    datePublished: article.publishedAt,
    dateModified: seoContent?.lastReviewed ?? article.publishedAt,
    author: { "@type": "Organization", name: "NutriZen South Africa" },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: canonical,
    url: canonical,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/blogs/${blogHandle}` },
      { "@type": "ListItem", position: 3, name: article.title, item: canonical },
    ],
  };

  const faqSchema = seoContent
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seoContent.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <nav className="mb-8 text-sm text-neutral-dark">
          <Link href={`/blogs/${blogHandle}`} className="hover:text-primary transition-colors">
            ← Back to Journal
          </Link>
        </nav>

        <article>
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl sm:h-80">
            {article.imageUrl ? (
              <Image
                src={article.imageUrl}
                alt={article.imageAlt ?? article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/20 via-primary/10 to-background-alt flex items-end p-8">
                <span className="text-4xl font-bold text-primary/30 leading-none select-none line-clamp-2">
                  {article.title}
                </span>
              </div>
            )}
          </div>

          <header className="mb-8">
            <p className="text-sm text-neutral-dark mb-3">
              {formatDate(article.publishedAt)} · NutriZen
              {seoContent ? ` · Last reviewed: ${formatDate(seoContent.lastReviewed)}` : ""}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-darkest sm:text-4xl leading-tight">
              {article.title}
            </h1>

            {article.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {seoContent ? (
              <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <p className="mb-1 text-sm font-semibold text-primary">In short</p>
                <p className="text-neutral-dark leading-relaxed">{seoContent.inShort}</p>
              </div>
            ) : null}
          </header>

          <div
            className="blog-content text-neutral-dark leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />
        </article>

        {seoContent ? <JournalSeoSection content={seoContent} /> : null}

        <footer className="mt-12 border-t border-neutral-light pt-8">
          <Link
            href={`/blogs/${blogHandle}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            ← More articles
          </Link>
        </footer>
      </main>
    </>
  );
}
