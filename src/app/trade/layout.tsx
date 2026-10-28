import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trade order portal",
  description: "Private order portal for approved NutriZen wholesalers and resellers.",
  robots: { index: false, follow: false, nocache: true },
};

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
