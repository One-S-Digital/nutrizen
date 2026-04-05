"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/formatPrice";
import type { ProductDetail } from "@/lib/shopify";
import { BundleSaveSection } from "@/components/product/BundleSaveSection";
import { FrequentlyBoughtTogetherSection } from "@/components/product/FrequentlyBoughtTogetherSection";
import { ProductInfoStrip } from "@/components/product/ProductInfoStrip";
import { WellnessTimelineSection } from "@/components/product/WellnessTimelineSection";
import { ProductFaqSection } from "@/components/product/ProductFaqSection";
import { ProductReviewsSection } from "@/components/product/ProductReviewsSection";
import { cn } from "@/lib/utils";

type Props = {
  product: ProductDetail;
};

export default function ProductDetailClient({ product }: Props) {
  const variants = useMemo(
    () =>
      product.variants.length > 0
        ? product.variants
        : [
            {
              id: product.id,
              title: "Default",
              priceAmount: product.amount,
              compareAtAmount: null,
              currencyCode: product.currencyCode,
              availableForSale: true,
              priceDisplay: product.priceDisplay,
            },
          ],
    [product],
  );

  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]!.id);

  useEffect(() => {
    setSelectedVariantId(variants[0]!.id);
  }, [product.id, variants[0]?.id]);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) ?? variants[0]!,
    [variants, selectedVariantId],
  );

  const gallery = useMemo(() => {
    const g = product.gallery.length > 0 ? product.gallery : [];
    if (g.length === 0 && product.featuredImageUrl) {
      return [{ url: product.featuredImageUrl, alt: product.imageAlt ?? product.title }];
    }
    return g;
  }, [product]);

  const [activeUrl, setActiveUrl] = useState(gallery[0]?.url ?? product.featuredImageUrl ?? "");
  useEffect(() => {
    setActiveUrl(gallery[0]?.url ?? product.featuredImageUrl ?? "");
  }, [product.id, gallery, product.featuredImageUrl]);

  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();

  const lineTotal = formatPrice(
    String(parseFloat(selectedVariant.priceAmount) * quantity),
    selectedVariant.currencyCode,
  );

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: selectedVariant.id,
        productId: product.id,
        title: product.title,
        price: selectedVariant.priceAmount,
        image: activeUrl || "",
      });
    }
  };

  const showBenefits = product.benefits.length > 0;
  const showIngredients = product.ingredients.length > 0;
  const showVariantPicker = product.variants.length > 1;
  const showBundle = product.bundleProducts.length > 0;
  const showFbt = product.frequentlyBoughtTogether.length > 0;
  const showEditorialStrip =
    Boolean(product.featuredReview) ||
    product.ingredientEntries.length > 0 ||
    Boolean(product.directionsSummary?.trim()) ||
    Boolean(product.directionsFull?.trim());
  const showTimeline = product.timelineItems.length > 0;
  const showBadges = product.trustBadges.length > 0;
  const showFaq = product.faqItems.length > 0;
  const showReviews = product.productReviews.length > 0;

  return (
    <div className="min-h-screen bg-background-main pb-24 pt-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-20">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[2rem] border border-neutral-light bg-white p-8 md:p-12"
            >
              {activeUrl ? (
                <Image
                  src={activeUrl}
                  alt={product.imageAlt ?? product.title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-neutral-dark/40">No image</div>
              )}
            </motion.div>
            {gallery.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {gallery.map((img, i) => (
                  <button
                    key={`${img.url}-${i}`}
                    type="button"
                    onClick={() => setActiveUrl(img.url)}
                    className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 bg-white ${
                      activeUrl === img.url ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt ?? product.title}
                      fill
                      className="object-contain p-1"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="py-10">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <nav className="mb-4 text-sm text-neutral-dark" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
                <span className="mx-2 opacity-50">/</span>
                <Link href="/shop" className="hover:text-primary">
                  Shop
                </Link>
                <span className="mx-2 opacity-50">/</span>
                <span className="text-neutral-darkest">{product.title}</span>
              </nav>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-darkest md:text-5xl">{product.title}</h1>
              <div className="mb-2 flex flex-wrap items-baseline gap-3">
                <p className="text-2xl font-semibold text-neutral-dark">{selectedVariant.priceDisplay}</p>
                {selectedVariant.compareAtAmount ? (
                  <span className="text-lg text-neutral-dark line-through">
                    {formatPrice(selectedVariant.compareAtAmount, selectedVariant.currencyCode)}
                  </span>
                ) : null}
              </div>

              <p className="mb-6 text-lg leading-relaxed text-neutral-dark">{product.description}</p>

              {/* Express shipping */}
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-neutral-darkest">
                <svg
                  className="h-5 w-5 shrink-0 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 5v3h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span>
                  <span className="font-semibold">Express shipping available</span> — shipped through priority express
                </span>
              </div>

              {/* Trust badges */}
              {showBadges ? (
                <div className="mb-8 flex flex-wrap gap-2">
                  {product.trustBadges.map((badge, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-neutral-darkest"
                    >
                      <svg
                        className="h-3.5 w-3.5 shrink-0 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      {badge}
                    </span>
                  ))}
                </div>
              ) : null}

              {showVariantPicker ? (
                <div className="mb-8">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-dark">Choose size</p>
                  <div className="flex flex-wrap gap-3">
                    {variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        disabled={!v.availableForSale}
                        className={cn(
                          "min-h-[48px] min-w-[120px] rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition",
                          selectedVariantId === v.id
                            ? "border-primary bg-primary/10 text-neutral-darkest"
                            : "border-neutral-light bg-white text-neutral-dark hover:border-primary/40",
                          !v.availableForSale && "cursor-not-allowed opacity-50",
                        )}
                      >
                        <span className="block">{v.title}</span>
                        <span className="block text-xs opacity-80">{v.priceDisplay}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mb-12 rounded-3xl border border-neutral-light bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-4">
                  <div className="font-medium text-neutral-dark">Quantity</div>
                  <div className="ml-auto flex items-center overflow-hidden rounded-xl border border-neutral-light">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-background-alt px-4 py-4 font-bold transition hover:bg-neutral-light"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="bg-background-alt px-4 py-4 font-bold transition hover:bg-neutral-light"
                    >
                      +
                    </button>
                  </div>
                </div>
                <Button
                  size="lg"
                  fullWidth
                  variant="primary"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant.availableForSale}
                  className="py-5 text-lg"
                >
                  Add to Cart — {lineTotal}
                </Button>
              </div>

              {showBenefits ? (
                <div className="mb-12">
                  <h3 className="mb-4 text-xl font-bold text-neutral-darkest">Key Benefits</h3>
                  <ul className="space-y-3">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3 text-neutral-dark">
                        <svg
                          className="h-6 w-6 flex-shrink-0 text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {showIngredients ? (
                <div className="rounded-[2rem] border border-neutral-light bg-background-alt p-8">
                  <h3 className="mb-6 text-xl font-bold text-neutral-darkest">Transparent Formula</h3>
                  <div className="space-y-4">
                    {product.ingredients.map((ing, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border-b border-neutral-light/60 pb-4 last:border-0 last:pb-0"
                      >
                        <span className="font-medium text-neutral-dark">{ing.name}</span>
                        <span className="font-bold text-primary">{ing.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>

        {(showEditorialStrip || showTimeline || showFaq || showReviews) && (
          <div className="mt-16 space-y-16 pb-4">
            {showEditorialStrip ? (
              <ProductInfoStrip
                featuredReview={product.featuredReview}
                ingredientEntries={product.ingredientEntries}
                directionsSummary={product.directionsSummary}
                directionsFull={product.directionsFull}
              />
            ) : null}
            {showTimeline ? <WellnessTimelineSection items={product.timelineItems} /> : null}
            {showFaq ? <ProductFaqSection items={product.faqItems} /> : null}
            {showReviews ? <ProductReviewsSection reviews={product.productReviews} /> : null}
          </div>
        )}

        {(showBundle || showFbt) && (
          <div className="mt-16 space-y-12 pb-8">
            {showBundle ? <BundleSaveSection products={product.bundleProducts} /> : null}
            {showFbt ? (
              <FrequentlyBoughtTogetherSection
                products={product.frequentlyBoughtTogether}
                currencyCode={selectedVariant.currencyCode}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
