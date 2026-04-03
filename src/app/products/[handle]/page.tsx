import { notFound } from "next/navigation";
import { getProductDetail } from "@/lib/shopify";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductDetail(handle);
  if (!product) {
    notFound();
  }
  return <ProductDetailClient product={product} />;
}
