import Link from "next/link";
import Image from "next/image";
import type { MarqueeProduct } from "@/lib/shopify";
import { optimizeShopifyImage } from "@/lib/optimize-shopify-image";

const IndexItem = ({
  index,
  title,
  href,
  imageUrl,
}: {
  index: number;
  title: string;
  href: string;
  imageUrl: string | null;
}) => (
  <Link href={href} className="group flex flex-shrink-0 items-center gap-5 px-8">
    <span className="font-mono text-xs tracking-[0.15em] text-ink/35 transition-colors duration-300 group-hover:text-ink/70">
      {String(index + 1).padStart(2, "0")}
    </span>
    <span className="relative h-12 w-9 flex-shrink-0 overflow-hidden rounded-md border border-ink/10 bg-white grayscale transition-all duration-500 group-hover:grayscale-0">
      {imageUrl ? (
        <Image
          src={optimizeShopifyImage(imageUrl)}
          alt=""
          fill
          className="object-cover"
          sizes="36px"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-ink/30">
          —
        </span>
      )}
    </span>
    <span className="relative whitespace-nowrap font-serif text-3xl leading-none text-ink transition-colors duration-300 group-hover:text-goal-immunity md:text-[2.4rem]">
      {title}
      <span
        className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-ink/60 transition-transform duration-500 ease-out group-hover:scale-x-100"
        aria-hidden
      />
    </span>
  </Link>
);

type ProductMarqueeProps = {
  products: MarqueeProduct[];
};

export default function ProductMarquee({ products }: ProductMarqueeProps) {
  if (!products.length) {
    return null;
  }

  const items = products.slice(0, 14).map((p, i) => ({
    index: i,
    title: p.title.replace(/^NutriZen\s+/i, ""),
    href: `/products/${p.handle}`,
    imageUrl: p.imageUrl,
  }));

  const duplicatedItems = [...items, ...items];

  return (
    <section className="relative overflow-hidden border-y border-ink/10 bg-paper">
      <p className="flex items-center justify-center gap-4 pt-7 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/45">
        <span className="h-px w-10 bg-ink/15" aria-hidden />
        The formula index · {items.length} precision formulas · 0 fillers
        <span className="h-px w-10 bg-ink/15" aria-hidden />
      </p>
      <div className="flex w-max animate-marquee items-center py-7 [animation-duration:70s] hover:[animation-play-state:paused]">
        {duplicatedItems.map((item, i) => (
          <div key={`${item.href}-${i}`} className="flex flex-shrink-0 items-center">
            <IndexItem
              index={item.index}
              title={item.title}
              href={item.href}
              imageUrl={item.imageUrl}
            />
            <span className="font-serif text-lg text-ink/20" aria-hidden>
              ✦
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
