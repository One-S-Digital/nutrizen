export const revalidate = 300;

import Hero from "@/components/home/Hero";
import ProductMarquee from "@/components/home/ProductMarquee";
import DynamicProductShowcase from "@/components/home/DynamicProductShowcase";
import ProblemSolution from "@/components/home/ProblemSolution";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import IngredientBreakdown from "@/components/home/IngredientBreakdown";
import SocialProof from "@/components/home/SocialProof";
import { getCollections, getMarqueeProducts, isShopifyConfigured } from "@/lib/shopify";

export default async function Home() {
  const [collections, marqueeProducts] = await Promise.all([
    getCollections(),
    getMarqueeProducts(24),
  ]);

  const shopifyReady = isShopifyConfigured();

  return (
    <div className="flex flex-col min-h-screen">
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
