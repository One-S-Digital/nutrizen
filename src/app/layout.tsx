import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { getFooterColumns, getMainMenuLinks, getNavCollections } from "@/lib/shopify";
import { shouldUseShopifyMock } from "@/lib/shopify-mode";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";
const SITE_NAME = "NutriZen";
const SITE_DESCRIPTION =
  "Premium natural supplements formulated for real results. Transparent ingredients, high-quality nutrient forms, and targeted support for your wellness goals. Free delivery across South Africa.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Premium Natural Supplements`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "natural supplements",
    "premium supplements South Africa",
    "vitamins and minerals",
    "bioavailable supplements",
    "immune support",
    "magnesium complex",
    "vitamin D3",
    "iron supplement",
    "glutathione",
    "adaptogen",
    "wellness supplements",
    "NutriZen",
    "transparent ingredients",
    "supplement South Africa",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Health & Wellness",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Premium Natural Supplements`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/nutrizen favicon.png",
        width: 762,
        height: 762,
        alt: "NutriZen – Premium Natural Supplements",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium Natural Supplements`,
    description: SITE_DESCRIPTION,
    images: ["/nutrizen favicon.png"],
    creator: "@nutrizen",
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/nutrizen-logo.png`,
  description: SITE_DESCRIPTION,
  email: "hello@nutrizen.co.za",
  address: {
    "@type": "PostalAddress",
    addressCountry: "ZA",
  },
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shopCategories = await getNavCollections();
  const [footerColumns, mainMenuLinks] = await Promise.all([
    getFooterColumns(shopCategories),
    getMainMenuLinks(shopCategories),
  ]);
  const previewMockCatalog = shouldUseShopifyMock();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans bg-background-main text-neutral-darkest antialiased flex flex-col min-h-screen`}
      >
        {previewMockCatalog ? (
          <div className="fixed left-0 right-0 top-20 z-[45] border-b border-amber-200/80 bg-amber-100/95 px-4 py-2 text-center text-xs font-medium text-amber-950">
            {process.env.VERCEL_ENV === "preview"
              ? "Preview deployment: mock Shopify catalog (Storefront API not used)."
              : "Mock Shopify catalog (Storefront API not used). Set SHOPIFY_USE_MOCK=false to use your live store."}
          </div>
        ) : null}
        <Navbar collections={shopCategories} mainMenuLinks={mainMenuLinks} />
        <CartDrawer />
        <main className={previewMockCatalog ? "flex-grow pt-32" : "flex-grow pt-20"}>
          {children}
        </main>
        <Footer footerColumns={footerColumns} mainMenuLinks={mainMenuLinks} />
      </body>
    </html>
  );
}
