import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { getFooterColumns, getMainMenuLinks, getNavCollections } from "@/lib/shopify";
import { shouldUseShopifyMock } from "@/lib/shopify-mode";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NutriZen | Premium Natural Supplements",
  description: "High-conversion, immersive digital experience for premium wellness.",
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
        <Navbar collections={shopCategories} />
        <CartDrawer />
        <main className={previewMockCatalog ? "flex-grow pt-32" : "flex-grow pt-20"}>
          {children}
        </main>
        <Footer footerColumns={footerColumns} mainMenuLinks={mainMenuLinks} />
      </body>
    </html>
  );
}
