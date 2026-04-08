export const revalidate = 300;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductDetail } from "@/lib/shopify";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductDetail(handle);
  if (!product) return {};
  return {
    title: product.seoTitle ?? product.title,
    description:
      product.seoDescription ?? product.description?.slice(0, 160) ?? undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductDetail(handle);
  if (!product) {
    notFound();
  }
  return <ProductDetailClient product={product} />;
}
