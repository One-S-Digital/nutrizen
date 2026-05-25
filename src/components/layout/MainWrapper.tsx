"use client";

import { useUIStore } from "@/store/uiStore";

export default function MainWrapper({
  children,
  hasMockBanner,
}: {
  children: React.ReactNode;
  hasMockBanner: boolean;
}) {
  const { bannerVisible } = useUIStore();

  if (hasMockBanner) {
    return (
      <main className={`flex-grow ${bannerVisible ? "pt-[152px]" : "pt-32"}`}>
        {children}
      </main>
    );
  }

  return (
    <main className={`flex-grow transition-[padding] duration-300 ${bannerVisible ? "pt-[116px]" : "pt-20"}`}>
      {children}
    </main>
  );
}
