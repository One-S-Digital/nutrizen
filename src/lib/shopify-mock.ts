import { buildFallbackFooterColumns } from "@/lib/footer-nav";
import { formatPrice } from "@/lib/formatPrice";
import type {
  PdpFeaturedReview,
  PdpIngredientEntry,
  PdpTimelineMilestone,
  PdpFaqItem,
  PdpProductReview,
} from "@/lib/shopify-pdp-meta";
import type {
  ProductVariantSummary,
  ReferencedProductSummary,
} from "@/lib/shopify-referenced-products";

const VITACORE_FEATURED_REVIEW: PdpFeaturedReview = {
  quote:
    "My energy is steadier through the day and I actually look forward to taking this — no stomach upset like other multis I've tried.",
  author: "Shanice G.",
  customerSince: "2023",
};

const VITACORE_INGREDIENTS: PdpIngredientEntry[] = [
  { commonName: "Olive Oil", botanicalName: "Olea europaea L." },
  { commonName: "Coconut Oil", botanicalName: "Cocos nucifera" },
  { commonName: "Vitamin D3", botanicalName: "Cholecalciferol" },
  { commonName: "Zinc picolinate", botanicalName: null },
  { commonName: "Magnesium glycinate", botanicalName: null },
];

const VITACORE_DIRECTIONS_SUMMARY =
  "Take two capsules daily with food, or as directed by your healthcare practitioner.";

const VITACORE_DIRECTIONS_FULL = `Take two capsules daily with a meal. For best absorption, pair with a source of healthy fat. Do not exceed the recommended dose unless advised by a qualified professional.

Store in a cool, dry place away from direct sunlight. Keep out of reach of children.`;

const VITACORE_TIMELINE: PdpTimelineMilestone[] = [
  {
    stepNumber: 1,
    stepLabel: "Week 1",
    cardTitle: "The first signs of balance",
    body: "Your body begins adjusting to consistent micronutrient support. Many people notice subtle changes in daily rhythm and digestion.",
    benefits: [
      "Gentler onboarding for sensitive stomachs",
      "Easier habit stacking with breakfast or lunch",
      "A clearer sense of routine",
    ],
    tip: "Take capsules at the same meal each day so your body learns the rhythm.",
  },
  {
    stepNumber: 2,
    stepLabel: "Month 1",
    cardTitle: "Steadier energy patterns",
    body: "Nutrient gaps start to close; energy and focus may feel more even across the day instead of spiking and crashing.",
    benefits: [
      "More consistent afternoon energy",
      "Less reliance on quick sugar fixes",
      "Better tolerance to everyday stressors",
    ],
    tip: "Track sleep and hydration — they amplify how you feel on a multi.",
  },
  {
    stepNumber: 3,
    stepLabel: "3 Months",
    cardTitle: "Deeper resilience",
    body: "With consistent use, immune and metabolic support ingredients have time to express their full effect alongside diet and movement.",
    benefits: [
      "Immune readiness feels more stable",
      "Skin and hair may reflect improved nutrient status",
      "Workout recovery can feel a touch easier",
    ],
    tip: "Reassess your dose with a practitioner if your diet or activity level shifts significantly.",
  },
  {
    stepNumber: 4,
    stepLabel: "6 Months",
    cardTitle: "Long-game wellness",
    body: "This is where foundational nutrition really compounds — think maintenance, not quick fixes.",
    benefits: [
      "Sustained nutrient coverage for busy seasons",
      "Confidence in your daily baseline",
      "A formula you can stick with for years",
    ],
    tip: "Combine with annual blood work if recommended by your clinician.",
  },
];

/** Mirrors `shopify.ts` exports — kept local to avoid circular imports */
type MarqueeProduct = {
  id: string;
  title: string;
  handle: string;
  imageUrl: string | null;
};

type ShopProduct = {
  id: string;
  variantId: string | null;
  title: string;
  handle: string;
  priceDisplay: string;
  priceAmount: string;
  currencyCode: string;
  imageUrl: string | null;
  imageAlt: string | null;
};

type NavCollection = {
  id: string;
  title: string;
  handle: string;
  imageUrl: string | null;
  imageAlt: string | null;
};

type CollectionProductSummary = {
  id: string;
  variantId: string | null;
  title: string;
  handle: string;
  price: string;
  currencyCode: string;
  imageUrl: string | null;
  imageAlt: string | null;
};

type CollectionPageData = {
  id: string;
  title: string;
  description: string;
  handle: string;
  products: CollectionProductSummary[];
};

const ZAR = "ZAR";

function publicImage(filename: string): string {
  return `/${encodeURIComponent(filename)}`;
}

/** Shared mock rows — same handles as public/*.png assets where possible */
const MOCK_ROWS = [
  {
    id: "gid://shopify/Product/mock/vitacore",
    title: "VitaCore Daily",
    handle: "vitacore",
    amount: "349.00",
    file: "vitacore.png",
    blurb: "Foundational multi-nutrient support for everyday energy and balance.",
  },
  {
    id: "gid://shopify/Product/mock/zinc",
    title: "Zinc Picolinate",
    handle: "zinc",
    amount: "189.00",
    file: "zinc.png",
    blurb: "Highly absorbable zinc for immune and skin support.",
  },
  {
    id: "gid://shopify/Product/mock/mg-complex",
    title: "Magnesium Complex",
    handle: "magnesium-complex",
    amount: "229.00",
    file: "magnesium complex.png",
    blurb: "Multi-form magnesium for relaxation and muscle recovery.",
  },
  {
    id: "gid://shopify/Product/mock/d3",
    title: "Vitamin D3",
    handle: "vitamin-d3",
    amount: "159.00",
    file: "vitamin d3.png",
    blurb: "Bone and immune support with a clean daily dose.",
  },
  {
    id: "gid://shopify/Product/mock/adaptogen",
    title: "Adaptogen Balance",
    handle: "adaptogen",
    amount: "279.00",
    file: "adaptogen.png",
    blurb: "Stress resilience with researched botanical adaptogens.",
  },
  {
    id: "gid://shopify/Product/mock/glutathione",
    title: "Glutathione Support",
    handle: "glutathione",
    amount: "299.00",
    file: "glutathione.png",
    blurb: "Antioxidant support for cellular health.",
  },
  {
    id: "gid://shopify/Product/mock/iron",
    title: "Iron Bisglycinate",
    handle: "iron",
    amount: "199.00",
    file: "iron.png",
    blurb: "Gentle iron form with improved tolerability.",
  },
  {
    id: "gid://shopify/Product/mock/metabol",
    title: "Metabol Assist",
    handle: "metabol",
    amount: "319.00",
    file: "metabol.png",
    blurb: "Metabolic cofactors for steady energy metabolism.",
  },
  {
    id: "gid://shopify/Product/mock/cellunex",
    title: "CelluNex",
    handle: "cellunex",
    amount: "289.00",
    file: "cellunex.png",
    blurb: "Cellular vitality blend with targeted micronutrients.",
  },
  {
    id: "gid://shopify/Product/mock/mg-oxide",
    title: "Magnesium Oxide",
    handle: "magnesium-oxide",
    amount: "149.00",
    file: "magnesium oxide.png",
    blurb: "Economical magnesium for digestive-sensitive routines.",
  },
  {
    id: "gid://shopify/Product/mock/para",
    title: "Para Cleanse",
    handle: "para-cleanse",
    amount: "259.00",
    file: "para cleanse.png",
    blurb: "Botanical cleanse support for digestive comfort.",
  },
] as const;

function toShopProduct(row: (typeof MOCK_ROWS)[number]): ShopProduct {
  return {
    id: row.id,
    variantId: row.id.replace("Product", "ProductVariant") + "/default",
    title: row.title,
    handle: row.handle,
    priceAmount: row.amount,
    currencyCode: ZAR,
    priceDisplay: formatPrice(row.amount, ZAR),
    imageUrl: publicImage(row.file),
    imageAlt: row.title,
  };
}

function toCollectionSummary(row: (typeof MOCK_ROWS)[number]): CollectionProductSummary {
  return {
    id: row.id,
    variantId: row.id.replace("Product", "ProductVariant") + "/default",
    title: row.title,
    handle: row.handle,
    price: row.amount,
    currencyCode: ZAR,
    imageUrl: publicImage(row.file),
    imageAlt: row.title,
  };
}

const COLLECTION_DEFS: {
  id: string;
  title: string;
  description: string;
  handle: string;
  productHandles: readonly string[];
}[] = [
  {
    id: "gid://shopify/Collection/mock/daily",
    title: "Daily essentials",
    description: "Core nutrients for everyday wellbeing.",
    handle: "daily-essentials",
    productHandles: ["vitacore", "vitamin-d3", "zinc"],
  },
  {
    id: "gid://shopify/Collection/mock/minerals",
    title: "Minerals",
    description: "Thoughtful mineral forms for absorption and tolerance.",
    handle: "minerals",
    productHandles: ["magnesium-complex", "magnesium-oxide", "zinc", "iron"],
  },
  {
    id: "gid://shopify/Collection/mock/targeted",
    title: "Targeted support",
    description: "Focused formulas for stress, metabolism, and cellular health.",
    handle: "targeted-support",
    productHandles: ["adaptogen", "metabol", "glutathione", "cellunex", "para-cleanse"],
  },
];

function rowByHandle(handle: string): (typeof MOCK_ROWS)[number] | undefined {
  return MOCK_ROWS.find((r) => r.handle === handle);
}

function mockReferencedProduct(row: (typeof MOCK_ROWS)[number], compareAt?: string): ReferencedProductSummary {
  const cmp = compareAt ?? null;
  return {
    productId: row.id,
    handle: row.handle,
    title: row.title,
    imageUrl: publicImage(row.file),
    imageAlt: row.title,
    variantId: `${row.id}/Variant/default`,
    priceAmount: row.amount,
    compareAtAmount: cmp,
    currencyCode: ZAR,
    availableForSale: true,
    priceDisplay: formatPrice(row.amount, ZAR),
    compareAtDisplay: cmp ? formatPrice(cmp, ZAR) : null,
  };
}

function singleDefaultVariant(row: (typeof MOCK_ROWS)[number]): ProductVariantSummary {
  return {
    id: `${row.id}/Variant/default`,
    title: "Default",
    priceAmount: row.amount,
    compareAtAmount: null,
    currencyCode: ZAR,
    availableForSale: true,
    priceDisplay: formatPrice(row.amount, ZAR),
  };
}

/** Demo pack-size variants for “variant-based bundle” UX (mock only). */
function vitacorePackVariants(row: (typeof MOCK_ROWS)[number]): ProductVariantSummary[] {
  return [
    {
      id: `${row.id}/Variant/60ct`,
      title: "60 capsules",
      priceAmount: "349.00",
      compareAtAmount: "399.00",
      currencyCode: ZAR,
      availableForSale: true,
      priceDisplay: formatPrice("349.00", ZAR),
    },
    {
      id: `${row.id}/Variant/90ct`,
      title: "90 capsules",
      priceAmount: "449.00",
      compareAtAmount: "499.00",
      currencyCode: ZAR,
      availableForSale: true,
      priceDisplay: formatPrice("449.00", ZAR),
    },
    {
      id: `${row.id}/Variant/120ct`,
      title: "120 capsules",
      priceAmount: "549.00",
      compareAtAmount: null,
      currencyCode: ZAR,
      availableForSale: true,
      priceDisplay: formatPrice("549.00", ZAR),
    },
  ];
}

export function getMockCollections() {
  return COLLECTION_DEFS.map((c) => {
    const products = c.productHandles
      .map((h) => rowByHandle(h))
      .filter(Boolean)
      .map((row) => ({
        id: row!.id,
        variantId: row!.id.replace("Product", "ProductVariant") + "/default",
        title: row!.title,
        handle: row!.handle,
        price: formatPrice(row!.amount, ZAR),
        priceAmount: row!.amount,
        currencyCode: ZAR,
        imageUrl: publicImage(row!.file),
      }));
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      handle: c.handle,
      products,
    };
  }).filter((c) => c.products.length > 0);
}

export function getMockMarqueeProducts(limit: number): MarqueeProduct[] {
  return MOCK_ROWS.slice(0, Math.min(limit, MOCK_ROWS.length)).map((row) => ({
    id: row.id,
    title: row.title,
    handle: row.handle,
    imageUrl: publicImage(row.file),
  }));
}

export function getMockAllProductsForShop(): ShopProduct[] {
  return MOCK_ROWS.map(toShopProduct);
}

export function getMockNavCollections(): NavCollection[] {
  return COLLECTION_DEFS.map((c) => {
    const first = c.productHandles[0];
    const row = first ? rowByHandle(first) : undefined;
    return {
      id: c.id,
      title: c.title,
      handle: c.handle,
      imageUrl: row ? publicImage(row.file) : null,
      imageAlt: row ? row.title : c.title,
    };
  });
}

/** Footer columns for mock catalog — mirrors fallback structure (Shop + About). */
export function getMockFooterMenu() {
  return buildFallbackFooterColumns(getMockNavCollections());
}

/** Main-menu links for mock catalog — flat list mirroring the nav. */
export function getMockMainMenuLinks() {
  return getMockNavCollections().map((c) => ({
    id: c.id,
    title: c.title,
    href: `/shop?collection=${encodeURIComponent(c.handle)}`,
    external: false,
  }));
}

export function getMockCollectionByHandle(handle: string): CollectionPageData | null {
  const def = COLLECTION_DEFS.find((c) => c.handle === handle);
  if (!def) return null;
  const products = def.productHandles
    .map((h) => rowByHandle(h))
    .filter(Boolean)
    .map((row) => toCollectionSummary(row!));
  return {
    id: def.id,
    title: def.title,
    description: def.description,
    handle: def.handle,
    products,
  };
}

const VITACORE_TRUST_BADGES: string[] = [
  "Halal Certified",
  "GMO Free",
  "No Artificial Fillers",
  "Bioavailable Forms",
];

const VITACORE_FAQ: PdpFaqItem[] = [
  {
    question: "What is VitaCore Daily and what does it contain?",
    answer:
      "VitaCore Daily is a comprehensive multi-nutrient supplement formulated to fill everyday dietary gaps. It combines key vitamins, minerals, and botanical co-factors in their most bioavailable forms — no megadoses, no unnecessary fillers.",
  },
  {
    question: "What are the health benefits of VitaCore Daily?",
    answer:
      "Regular use supports steady energy metabolism, immune function, healthy skin and hair, and balanced mood. The formula is designed to complement a whole-food diet rather than replace it.",
  },
  {
    question: "How often should I use VitaCore Daily and how do I apply it?",
    answer:
      "Take two capsules daily with a meal. For best absorption, pair with a source of healthy fat. Consistency matters — daily use over weeks is when you start to notice the difference.",
  },
  {
    question: "How long before I can see results from taking VitaCore Daily?",
    answer:
      "Most users notice subtle improvements in energy and digestion within the first two weeks. Immune and metabolic benefits typically build over one to three months of consistent use.",
  },
  {
    question: "How long does it take to see hair growth results with VitaCore Daily?",
    answer:
      "Hair growth cycles are long — expect at least 8–12 weeks before visible changes. Nutrients like zinc and biotin in the formula support the scalp environment; results vary based on individual health and diet.",
  },
];

const VITACORE_REVIEWS: PdpProductReview[] = [
  {
    rating: 5,
    author: "Shanice G.",
    date: "2024-11-03",
    body: "My energy is steadier through the day and I actually look forward to taking this — no stomach upset like other multis I've tried.",
  },
  {
    rating: 5,
    author: "Kenneth Hall",
    date: "2024-10-27",
    body: "I was sceptical at first but after six weeks I genuinely feel more balanced. My afternoon slumps are mostly gone.",
  },
  {
    rating: 4,
    author: "Ryan Young",
    date: "2024-10-12",
    body: "Shipping was fast and the capsules are easy to swallow. Gave it 4 stars only because I need another month to properly judge the results.",
  },
  {
    rating: 5,
    author: "Tanya Pietersen",
    date: "2024-09-18",
    body: "Clean ingredients and no weird aftertaste. This is the first multi I've stuck with for more than a month.",
  },
  {
    rating: 4,
    author: "Gregory M.",
    date: "2024-09-05",
    body: "Good quality supplement. I pair it with the Magnesium Complex and notice a real difference in sleep. Would recommend.",
  },
];

/** PDP extras — only used in mock mode */
export type MockProductDetailExtras = {
  benefits: string[];
  ingredients: { name: string; amount: string }[];
  gallery: { url: string; alt: string }[];
};

export type MockProductDetail = {
  id: string;
  title: string;
  handle: string;
  description: string;
  amount: string;
  currencyCode: string;
  priceDisplay: string;
  featuredImageUrl: string;
  imageAlt: string;
  variants: ProductVariantSummary[];
  bundleProducts: ReferencedProductSummary[];
  frequentlyBoughtTogether: ReferencedProductSummary[];
  featuredReview: PdpFeaturedReview | null;
  ingredientEntries: PdpIngredientEntry[];
  directionsSummary: string | null;
  directionsFull: string | null;
  timelineItems: PdpTimelineMilestone[];
  trustBadges: string[];
  faqItems: PdpFaqItem[];
  productReviews: PdpProductReview[];
} & MockProductDetailExtras;

const DEFAULT_EXTRAS: MockProductDetailExtras = {
  benefits: [
    "Supports everyday nutrient gaps",
    "Clean label — no unnecessary fillers",
    "Dosed for real-world use",
  ],
  ingredients: [
    { name: "Active blend", amount: "Per label" },
    { name: "Bioavailable forms", amount: "As listed" },
  ],
  gallery: [],
};

export function getMockProductDetail(handle: string): MockProductDetail | null {
  const row = rowByHandle(handle);
  if (!row) return null;
  const baseUrl = publicImage(row.file);

  const isVitacore = handle === "vitacore";
  const variants = isVitacore ? vitacorePackVariants(row) : [singleDefaultVariant(row)];
  const primary = variants[0];

  const zinc = rowByHandle("zinc");
  const d3 = rowByHandle("vitamin-d3");
  const mg = rowByHandle("magnesium-complex");
  const adapt = rowByHandle("adaptogen");

  const bundleProducts =
    isVitacore && zinc && d3
      ? [mockReferencedProduct(zinc, "219.00"), mockReferencedProduct(d3, "189.00")]
      : [];

  const frequentlyBoughtTogether =
    isVitacore && mg && adapt ? [mockReferencedProduct(mg), mockReferencedProduct(adapt)] : [];

  return {
    id: row.id,
    title: row.title,
    handle: row.handle,
    description: row.blurb,
    amount: primary.priceAmount,
    currencyCode: ZAR,
    priceDisplay: primary.priceDisplay,
    featuredImageUrl: baseUrl,
    imageAlt: row.title,
    benefits: DEFAULT_EXTRAS.benefits,
    ingredients: DEFAULT_EXTRAS.ingredients,
    gallery: [{ url: baseUrl, alt: row.title }],
    variants,
    bundleProducts,
    frequentlyBoughtTogether,
    featuredReview: isVitacore ? VITACORE_FEATURED_REVIEW : null,
    ingredientEntries: isVitacore ? VITACORE_INGREDIENTS : [],
    directionsSummary: isVitacore ? VITACORE_DIRECTIONS_SUMMARY : null,
    directionsFull: isVitacore ? VITACORE_DIRECTIONS_FULL : null,
    timelineItems: isVitacore ? VITACORE_TIMELINE : [],
    trustBadges: isVitacore ? VITACORE_TRUST_BADGES : [],
    faqItems: isVitacore ? VITACORE_FAQ : [],
    productReviews: isVitacore ? VITACORE_REVIEWS : [],
  };
}
