import Image from "next/image";
import Link from "next/link";

/** Point this at your combo product: internal path (e.g. `/products/your-handle`) or any URL. */
export const COMBO_PRODUCT_HREF = "/shop";

const BENEFIT_PILLS = [
  "Supports immune defense",
  "Boosts antioxidant protection",
  "Promotes energy and resilience",
  "Supports bone, muscle, and recovery",
] as const;

export default function DynamicProductShowcase() {
  return (
    <section className="py-24 bg-[#F9F8F2]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Product image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-neutral-light/50 bg-[#EEF1EC] shadow-md">
          <Image
            src="/immunity-power-pack-hero.png"
            alt="NutriZen Immunity Power Pack: Zinc plus Copper and Selenium, Vitamin D3 plus Magnesium Glycinate, and Glutathione Precursor plus NAC"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Right: Content */}
        <div className="flex flex-col text-center items-center lg:items-start lg:text-left">
          <span className="text-[#DE9E48] font-bold tracking-widest uppercase text-[12px] mb-4">
            Immunity Power Pack
          </span>

          <h2
            className="text-4xl md:text-5xl font-semibold text-[#3B4A3F] mb-5 tracking-tight max-w-xl"
            style={{
              fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
            }}
          >
            Your Daily Immunity &amp; Recovery Stack
          </h2>

          <p className="text-[#3B4A3F] text-[15px] leading-relaxed mb-6 max-w-[520px]">
            This powerful 3-product combo is built to support immune strength, antioxidant defense, and
            everyday vitality. With Zinc + Copper &amp; Selenium, Vitamin D3 + Magnesium Glycinate, and
            Glutathione Precursor + NAC, you get targeted support for immunity, recovery, cellular
            protection, and overall wellbeing.
          </p>

          {/* Benefit pills */}
          <div className="mb-5 flex w-full max-w-xl flex-wrap justify-center gap-2 lg:justify-start">
            {BENEFIT_PILLS.map((label) => (
              <span
                key={label}
                className="inline-flex rounded-full border border-[#3B4A3F]/12 bg-white/95 px-4 py-2.5 text-left text-[12px] font-medium leading-snug text-[#3B4A3F] shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
              >
                {label}
              </span>
            ))}
          </div>

          <p className="mb-8 max-w-[520px] text-[13px] font-medium leading-relaxed text-[#3B4A3F]/85">
            3 targeted formulas. 1 smarter daily support system.
          </p>

          <div className="mb-8 w-full max-w-md rounded-[1.25rem] border border-black/8 bg-white/90 px-6 py-5 text-left shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <p className="text-lg font-semibold text-[#3B4A3F]">Immunity Power Pack</p>
            <p className="mt-4 text-[15px] text-[#3B4A3F]">
              <span className="text-neutral-dark/80">Total: </span>
              <span className="mr-2 text-[14px] text-neutral-dark/55 line-through">R749.97</span>
              <span className="text-lg font-bold text-[#425244]">R674.97</span>
            </p>
          </div>

          <Link
            href={COMBO_PRODUCT_HREF}
            className="group inline-flex items-center gap-3 rounded-[2rem] bg-[#425244] px-10 py-4 text-[13px] font-bold uppercase tracking-wider text-white shadow-md transition-colors hover:bg-[#344136]"
          >
            GET THE COMBO &amp; SAVE
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
