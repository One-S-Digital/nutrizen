import Link from "next/link";
import { HOME_ABOUT } from "@/lib/seo-content/homepage";

export default function HomeAboutSection() {
  return (
    <section className="py-20 bg-background-alt border-y border-neutral-light/80">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-darkest mb-5 leading-tight">
          {HOME_ABOUT.heading}
        </h2>
        <p className="text-lg text-neutral-dark leading-relaxed mb-6">{HOME_ABOUT.body}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold">
          {HOME_ABOUT.links.map((link) => (
            <Link key={link.href} href={link.href} className="text-primary hover:underline">
              {link.label} →
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
