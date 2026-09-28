import type { MetadataRoute } from "next";
import { getAllProductsForShop, getNavCollections, getBlog } from "@/lib/shopify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export const revalidate = 3600; // revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pages/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/pages/science`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/pages/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/pages/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/pages/magnesium-south-africa`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/pages/quality`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/pages/practitioners`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  let collectionRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const [products, collections, blog] = await Promise.all([
      getAllProductsForShop(250),
      getNavCollections(),
      getBlog("news"),
    ]);

    productRoutes = products.map((p) => ({
      url: `${SITE_URL}/products/${p.handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

    // "frontpage" is Shopify's auto-generated Home page collection — noindexed (see
    // collections/[handle]), so it's left out of the sitemap too.
    collectionRoutes = collections
      .filter((c) => c.handle !== "frontpage")
      .map((c) => ({
        url: `${SITE_URL}/collections/${c.handle}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    if (blog) {
      blogRoutes = [
        {
          url: `${SITE_URL}/blogs/${blog.handle}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        },
        ...blog.articles.map((a) => ({
          url: `${SITE_URL}/blogs/${blog.handle}/${a.handle}`,
          lastModified: a.publishedAt ? new Date(a.publishedAt) : now,
          changeFrequency: "monthly" as const,
          priority: 0.65,
        })),
      ];
    }
  } catch {
    // If Shopify is not configured, skip dynamic routes
  }

  return [...staticRoutes, ...collectionRoutes, ...productRoutes, ...blogRoutes];
}
