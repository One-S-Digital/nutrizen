export const revalidate = 300;

import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductDetailCached as getProductDetailFromCache } from "@/lib/shopify";
import ProductDetailClient from "./ProductDetailClient";
import JsonLd from "@/components/seo/JsonLd";

// React.cache() deduplicates calls within the same render pass (generateMetadata
// + page body). unstable_cache (in shopify.ts) persists the result across
// requests for 5 minutes. Together they eliminate all redundant fetches.
const getProductDetailCached = cache(getProductDetailFromCache);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductDetailCached(handle);
  if (!product) return {};

  const title = product.seoTitle ?? product.title;
  const description =
    product.seoDescription ?? product.description?.slice(0, 160) ?? undefined;
  const canonical = `${SITE_URL}/products/${handle}`;
  const image = product.featuredImageUrl;

  return {
    title,
    description,
    keywords: [
      product.title,
      "supplement South Africa",
      "natural supplement",
      "NutriZen",
      ...(product.benefits?.slice(0, 4) ?? []),
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: `${title} | NutriZen`,
      description,
      ...(image
        ? {
            images: [
              {
                url: image,
                alt: product.imageAlt ?? product.title,
                width: 800,
                height: 800,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | NutriZen`,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductDetailCached(handle);
  if (!product) {
    notFound();
  }

  const canonical = `${SITE_URL}/products/${handle}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    url: canonical,
    brand: {
      "@type": "Brand",
      name: "NutriZen",
    },
    ...(product.featuredImageUrl
      ? {
          image: product.gallery?.length
            ? product.gallery.map((g) => g.url)
            : [product.featuredImageUrl],
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: product.currencyCode ?? "ZAR",
      price: product.amount,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "NutriZen",
      },
    },
    ...(product.faqItems?.length
      ? {
          mainEntity: product.faqItems.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : {}),
  };

  return (
    <>
      <JsonLd data={productSchema} />
      <ProductDetailClient product={product} />
    </>
  );
}
