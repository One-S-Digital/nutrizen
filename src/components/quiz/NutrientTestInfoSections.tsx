import FaqAccordion from "@/components/seo/FaqAccordion";
import { HOW_IT_WORKS_STEPS, WHAT_IT_CANT_TELL_YOU, NUTRIENT_TEST_FAQS } from "@/lib/seo-content/nutrient-test";

export default function NutrientTestInfoSections() {
  return (
    <div className="bg-background-main py-20">
      <div className="max-w-3xl mx-auto px-6 space-y-16">
        <section>
          <h2 className="font-serif text-3xl font-bold text-neutral-darkest mb-6">How the nutrient test works</h2>
          <ol className="space-y-4">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <li key={step} className="flex gap-4 text-neutral-dark leading-relaxed">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-3xl font-bold text-neutral-darkest mb-4">
            What the test can and can&apos;t tell you
          </h2>
          <p className="text-neutral-dark leading-relaxed">{WHAT_IT_CANT_TELL_YOU}</p>
        </section>

        <section>
          <h2 className="font-serif text-3xl font-bold text-neutral-darkest mb-6">Frequently asked questions</h2>
          <FaqAccordion items={NUTRIENT_TEST_FAQS} />
        </section>
      </div>
    </div>
  );
}
