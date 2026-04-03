import { formatPrice } from "@/lib/formatPrice";

/** First variant summary for PDP / merchandising cards (Storefront API shape). */
export type ProductVariantSummary = {
  id: string;
  title: string;
  priceAmount: string;
  compareAtAmount: string | null;
  currencyCode: string;
  availableForSale: boolean;
  priceDisplay: string;
};

export type ReferencedProductSummary = {
  productId: string;
  handle: string;
  title: string;
  imageUrl: string | null;
  imageAlt: string | null;
  variantId: string;
  priceAmount: string;
  compareAtAmount: string | null;
  currencyCode: string;
  availableForSale: boolean;
  priceDisplay: string;
  compareAtDisplay: string | null;
};

type GqlMoney = { amount: string; currencyCode: string } | null;

type GqlVariantNode = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: GqlMoney;
  compareAtPrice: GqlMoney;
};

type GqlProductRefNode = {
  id: string;
  handle: string;
  title: string;
  featuredImage: { url: string; altText: string | null } | null;
  variants: { edges: { node: GqlVariantNode }[] };
};

function moneyOrZero(m: GqlMoney): { amount: string; currencyCode: string } {
  if (!m?.amount) return { amount: "0", currencyCode: "USD" };
  return { amount: m.amount, currencyCode: m.currencyCode };
}

export function variantFromGql(node: GqlVariantNode): ProductVariantSummary {
  const { amount, currencyCode } = moneyOrZero(node.price);
  const cmp = node.compareAtPrice?.amount ? node.compareAtPrice : null;
  return {
    id: node.id,
    title: node.title,
    priceAmount: amount,
    compareAtAmount: cmp?.amount ?? null,
    currencyCode,
    availableForSale: node.availableForSale,
    priceDisplay: formatPrice(amount, currencyCode),
  };
}

export function referencedProductFromGql(node: GqlProductRefNode | null | undefined): ReferencedProductSummary | null {
  if (!node?.id) return null;
  const vEdge = node.variants?.edges?.[0];
  if (!vEdge?.node) return null;
  const v = vEdge.node;
  const { amount, currencyCode } = moneyOrZero(v.price);
  const cmp = v.compareAtPrice?.amount ? v.compareAtPrice : null;
  return {
    productId: node.id,
    handle: node.handle,
    title: node.title,
    imageUrl: node.featuredImage?.url ?? null,
    imageAlt: node.featuredImage?.altText ?? node.title,
    variantId: v.id,
    priceAmount: amount,
    compareAtAmount: cmp?.amount ?? null,
    currencyCode,
    availableForSale: v.availableForSale,
    priceDisplay: formatPrice(amount, currencyCode),
    compareAtDisplay: cmp ? formatPrice(cmp.amount, currencyCode) : null,
  };
}

export function referencedProductsFromMetafield(metafield: {
  references?: {
    edges: { node: GqlProductRefNode | null }[];
  } | null;
} | null): ReferencedProductSummary[] {
  if (!metafield?.references?.edges?.length) return [];
  const out: ReferencedProductSummary[] = [];
  for (const e of metafield.references.edges) {
    const row = referencedProductFromGql(e.node ?? undefined);
    if (row) out.push(row);
  }
  return out;
}

export function savingsPercent(price: string, compareAt: string | null): number | null {
  if (!compareAt) return null;
  const p = parseFloat(price);
  const c = parseFloat(compareAt);
  if (!(c > p) || c <= 0) return null;
  return Math.round(((c - p) / c) * 100);
}
