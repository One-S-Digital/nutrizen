export const revalidate = 300;

import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductDetailCached as getProductDetailFromCache } from "@/lib/shopify";
import ProductDetailClient from "./ProductDetailClient";
import JsonLd from "@/components/seo/JsonLd";
import { PRODUCT_SEO_CONTENT } from "@/lib/seo-content/products";

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

  const seoContent = PRODUCT_SEO_CONTENT[handle];
  const title = seoContent?.title ?? product.seoTitle ?? product.title;
  const description =
    seoContent?.metaDescription ?? product.seoDescription ?? product.description?.slice(0, 160) ?? undefined;
  const canonical = `${SITE_URL}/products/${handle}`;
  const image = product.featuredImageUrl;
  // seoContent titles already carry the full "… | NutriZen[ South Africa]" brand
  // suffix (it varies per product); the legacy fallback path still needs it appended.
  const brandedTitle = seoContent ? title : `${title} | NutriZen`;

  return {
    title: seoContent ? { absolute: title } : title,
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
      title: brandedTitle,
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
      title: brandedTitle,
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
  const seoContent = PRODUCT_SEO_CONTENT[handle];
  const allFaqItems = seoContent ? [...product.faqItems, ...seoContent.newFaqs] : product.faqItems;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: seoContent?.metaDescription ?? product.description,
    url: canonical,
    sku: product.sku ?? product.variants[0]?.id ?? product.id,
    countryOfOrigin: "ZA",
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
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "ZA",
        },
        // Flat courier rate for packages under 5kg (policies/shipping-policy); free over R690
        // is out of scope for this single static Offer entry.
        shippingRate: {
          "@type": "MonetaryAmount",
          currency: "ZAR",
          value: 130,
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 5, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "ZA",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
      },
    },
  };

  const faqSchema = allFaqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: allFaqItems.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
      { "@type": "ListItem", position: 3, name: product.title, item: canonical },
    ],
  };

  return (
    <>
      <JsonLd data={productSchema} />
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      <JsonLd data={breadcrumbSchema} />
      <ProductDetailClient
        product={{ ...product, faqItems: allFaqItems }}
        descriptorLine={seoContent?.descriptorLine}
        relatedReading={seoContent?.relatedReading}
      />
    </>
  );
}
