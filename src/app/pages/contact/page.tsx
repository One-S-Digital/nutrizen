import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/pages/ContactForm";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@nutrizen.co.za";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the NutriZen team for product questions, order help, or partnerships. We respond within 1–2 business days, Monday to Friday.",
  keywords: ["contact NutriZen", "NutriZen support", "supplement help South Africa"],
  alternates: { canonical: `${SITE_URL}/pages/contact` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/pages/contact`,
    title: "Contact | NutriZen",
    description:
      "Reach the NutriZen team for product questions, order help, or partnerships. We respond within 1–2 business days.",
  },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-background-main pt-10 pb-12 md:pb-16">
        <div className="pointer-events-none absolute left-1/4 top-10 h-72 w-72 rounded-full bg-secondary/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Contact</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-neutral-darkest md:text-5xl">
            We are here to help
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-dark">
            Questions about an order, a formula, or working with NutriZen? Send us a note—we read every message
            and aim to respond within one to two business days.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/pages/faq"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-primary bg-transparent px-8 py-3.5 text-base font-medium text-primary transition-colors hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Read the FAQ
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-2xl border border-neutral-light/90 bg-white/80 px-8 py-3.5 text-base font-medium text-neutral-darkest shadow-sm backdrop-blur-sm transition-colors hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Shop supplements
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background-main px-6 pb-24 pt-4">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
              <h2 className="text-lg font-semibold text-neutral-darkest">Direct email</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-dark">
                For the fastest route, email us with your order number (if applicable) and a short summary.
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="mt-4 inline-flex text-lg font-medium text-primary hover:text-primary/90"
              >
                {contactEmail}
              </a>
            </div>

            <div className="rounded-[2rem] border border-neutral-light/90 bg-white/60 p-8 shadow-sm backdrop-blur-md">
              <h2 className="text-lg font-semibold text-neutral-darkest">Response times</h2>
              <ul className="mt-4 space-y-3 text-sm text-neutral-dark">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>Monday to Friday, excluding public holidays</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>We typically reply within 1–2 business days</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>Urgent order issues: mention &quot;Urgent&quot; in the subject line</span>
                </li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-dashed border-neutral-light bg-background-alt/80 p-8">
              <p className="text-sm leading-relaxed text-neutral-dark">
                <strong className="font-semibold text-neutral-darkest">Medical disclaimer:</strong> NutriZen
                does not provide medical advice. For questions about medications or conditions, speak with a
                qualified healthcare professional.
              </p>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
