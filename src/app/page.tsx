export const revalidate = 300;

import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ProductMarquee from "@/components/home/ProductMarquee";
import DynamicProductShowcase from "@/components/home/DynamicProductShowcase";
import ProblemSolution from "@/components/home/ProblemSolution";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import IngredientBreakdown from "@/components/home/IngredientBreakdown";
import SocialProof from "@/components/home/SocialProof";
import JsonLd from "@/components/seo/JsonLd";
import { getCollectionsCached, getMarqueeProductsCached, isShopifyConfigured } from "@/lib/shopify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export const metadata: Metadata = {
  title: "Premium Natural Supplements",
  description:
    "NutriZen delivers premium supplements with transparent ingredients, bioavailable nutrient forms, and targeted formulas for immune support, energy, sleep, and more. Free delivery across South Africa.",
  keywords: [
    "natural supplements South Africa",
    "premium vitamins",
    "bioavailable minerals",
    "immune support supplements",
    "magnesium complex South Africa",
    "vitamin D3 supplement",
    "NutriZen supplements",
    "buy supplements online South Africa",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    url: SITE_URL,
    title: "NutriZen | Premium Natural Supplements",
    description:
      "Transparent ingredients. High-quality nutrient forms. Targeted support for real health goals. Delivered across South Africa.",
    images: [
      {
        url: "/nutrizen-logo.png",
        width: 1200,
        height: 630,
        alt: "NutriZen – Premium Natural Supplements",
      },
    ],
  },
};

const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "NutriZen",
  url: SITE_URL,
  description:
    "Premium natural supplements with transparent ingredients and high-quality nutrient forms, delivered across South Africa.",
  image: `${SITE_URL}/nutrizen-logo.png`,
  priceRange: "$$",
  currenciesAccepted: "ZAR",
  paymentAccepted: "Credit Card, EFT",
  address: {
    "@type": "PostalAddress",
    addressCountry: "ZA",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "NutriZen Supplement Range",
    url: `${SITE_URL}/shop`,
  },
};

export default async function Home() {
  const [collections, marqueeProducts] = await Promise.all([
    getCollectionsCached(),
    getMarqueeProductsCached(24),
  ]);

  const shopifyReady = isShopifyConfigured();

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={homePageSchema} />
      <Hero />
      <ProductMarquee products={marqueeProducts} />
      <DynamicProductShowcase />
      <ProblemSolution />
      {collections.length > 0 ? (
        <CategoryShowcase categories={collections} />
      ) : (
        <section className="py-16 bg-white border-y border-neutral-light/80">
          <div className="max-w-2xl mx-auto px-6 text-center text-neutral-dark text-sm leading-relaxed">
            {shopifyReady ? (
              <p>
                No collections with products were returned from Shopify. Add products to collections in{" "}
                <strong>Shopify Admin</strong>, or check that collections are published to the Online Store.
              </p>
            ) : (
              <p>
                Set <code className="text-xs bg-neutral-light px-1.5 py-0.5 rounded">SHOPIFY_STORE_DOMAIN</code>{" "}
                and{" "}
                <code className="text-xs bg-neutral-light px-1.5 py-0.5 rounded">
                  SHOPIFY_STOREFRONT_ACCESS_TOKEN
                </code>{" "}
                in your Render environment variables to load categories and products from your live store.
              </p>
            )}
          </div>
        </section>
      )}
      <IngredientBreakdown />
      <SocialProof />
    </div>
  );
}
