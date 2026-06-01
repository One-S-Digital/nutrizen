import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogCached } from "@/lib/shopify";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

type Props = { params: Promise<{ blogHandle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogHandle } = await params;
  const blog = await getBlogCached(blogHandle);
  if (!blog) return {};
  return {
    title: blog.title,
    description: `Read the latest articles from NutriZen — ${blog.title}.`,
    alternates: { canonical: `${SITE_URL}/blogs/${blog.handle}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/blogs/${blog.handle}`,
      title: `${blog.title} | NutriZen`,
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

export default async function BlogListingPage({ params }: Props) {
  const { blogHandle } = await params;
  const blog = await getBlogCached(blogHandle);
  if (!blog) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-darkest sm:text-5xl">
          {blog.title}
        </h1>
        <p className="mt-3 text-neutral-dark">
          Insights, guides, and research from the NutriZen team.
        </p>
      </header>

      {blog.articles.length === 0 ? (
        <p className="text-center text-neutral-dark">No articles yet — check back soon.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blog.articles.map((article) => (
            <Link
              key={article.id}
              href={`/blogs/${blog.handle}/${article.handle}`}
              className="group flex flex-col rounded-2xl border border-neutral-light bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden"
            >
              {article.imageUrl ? (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.imageAlt ?? article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                  <span className="text-primary/40 text-5xl font-bold select-none">
                    {article.title.charAt(0)}
                  </span>
                </div>
              )}

              <div className="flex flex-col flex-1 p-5">
                <p className="text-xs text-neutral-dark mb-2">
                  {formatDate(article.publishedAt)} · {article.author}
                </p>
                <h2 className="text-base font-semibold text-neutral-darkest group-hover:text-primary transition-colors leading-snug mb-2">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="text-sm text-neutral-dark line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>
                )}
                <span className="mt-4 text-sm font-medium text-primary">
                  Read article →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
