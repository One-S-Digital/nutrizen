import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogArticleCached } from "@/lib/shopify";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

type Props = { params: Promise<{ blogHandle: string; articleHandle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogHandle, articleHandle } = await params;
  const article = await getBlogArticleCached(blogHandle, articleHandle);
  if (!article) return {};

  const canonical = `${SITE_URL}/blogs/${blogHandle}/${articleHandle}`;

  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.excerpt,
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    author: { "@type": "Organization", name: "NutriZen" },
    datePublished: article.publishedAt,
    url: `${SITE_URL}/blogs/${blogHandle}/${articleHandle}`,
    publisher: {
      "@type": "Organization",
      name: "NutriZen",
      url: SITE_URL,
    },
    ...(article.imageUrl ? { image: article.imageUrl } : {}),
    ...(article.seoDescription ? { description: article.seoDescription } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
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
          </header>

          <div
            className="blog-content text-neutral-dark leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />
        </article>

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
