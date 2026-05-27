import Link from "next/link";
import Image from "next/image";
import type { MarqueeProduct } from "@/lib/shopify";
import { optimizeShopifyImage } from "@/lib/optimize-shopify-image";

const MarqueeItem = ({
  title,
  href,
  imageUrl,
}: {
  title: string;
  href: string;
  imageUrl: string | null;
}) => (
  <Link
    href={href}
    className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-2 px-6 transition-all group flex-shrink-0"
  >
    <div className="relative w-8 h-10 bg-white/90 rounded flex-shrink-0 overflow-hidden border border-white/20">
      {imageUrl ? (
        <Image
          src={optimizeShopifyImage(imageUrl)}
          alt=""
          fill
          className="object-cover"
          sizes="32px"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-neutral-dark/40">
          IMG
        </span>
      )}
    </div>

    <div className="flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase">
          Shop Now
        </span>
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      </div>
      <span className="text-sm font-bold text-white transition-colors line-clamp-2 max-w-[min(90vw,280px)]">
        {title}
      </span>
    </div>

    <svg
      className="w-4 h-4 text-white/30 group-hover:text-white transition-colors ml-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  </Link>
);

type ProductMarqueeProps = {
  products: MarqueeProduct[];
};

export default function ProductMarquee({ products }: ProductMarqueeProps) {
  if (!products.length) {
    return null;
  }

  const items = products.map((p) => ({
    title: p.title,
    href: `/products/${p.handle}`,
    imageUrl: p.imageUrl,
  }));

  const duplicatedItems = [...items, ...items];

  return (
    <div className="bg-[#425244] py-4 overflow-hidden border-y border-white/10 flex items-center relative z-20 -mt-20">
      <div className="flex w-[200%] animate-marquee gap-8 items-center cursor-pointer hover:[animation-play-state:paused]">
        {duplicatedItems.map((item, i) => (
          <div key={`${item.href}-${i}`} className="flex items-center gap-8 flex-shrink-0">
            <MarqueeItem title={item.title} href={item.href} imageUrl={item.imageUrl} />
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
