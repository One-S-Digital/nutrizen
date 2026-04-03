const FAQ_SECTIONS: { heading: string; items: { q: string; a: string }[] }[] = [
  {
    heading: "Orders & delivery",
    items: [
      {
        q: "Where do you ship?",
        a: "We ship across South Africa. Rates and timelines are calculated at checkout based on your address and selected service. You will see the full total—including any promotions—before you pay.",
      },
      {
        q: "How long does delivery take?",
        a: "Most orders leave our fulfilment partner within 1–2 business days. Courier delivery is typically 2–5 business days depending on your area. You will receive tracking details by email or SMS when your parcel is on the way.",
      },
      {
        q: "Can I change or cancel an order?",
        a: "If your order has not yet been dispatched, we may be able to update the address or cancel it. Contact us as soon as possible via the contact page with your order number, and we will do our best to help.",
      },
    ],
  },
  {
    heading: "Products & usage",
    items: [
      {
        q: "How should I take NutriZen supplements?",
        a: "Directions vary by product. Always read the label on your bottle first—timing (with food vs. away from meals), daily amount, and duration can differ between formulas. If you are pregnant, nursing, on medication, or managing a health condition, speak to a qualified practitioner before starting any new supplement.",
      },
      {
        q: "Are your ingredients tested?",
        a: "We work with reputable manufacturers and prioritise transparent labelling and consistent quality. Specific testing claims depend on the product line; batch documentation and specifications are held to the standards our suppliers and regulatory context require.",
      },
      {
        q: "Can I combine multiple products?",
        a: "Many customers stack targeted formulas, but nutrient overlap matters—especially for minerals and fat-soluble vitamins. If you are unsure about combining products, a pharmacist or clinician can help you avoid redundant or excessive intakes.",
      },
    ],
  },
  {
    heading: "Returns & refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "Opened supplement bottles generally cannot be resold for safety reasons. If your order arrived damaged, incorrect, or missing items, contact us within 14 days of delivery with photos where relevant, and we will arrange a replacement or refund in line with applicable consumer law.",
      },
      {
        q: "How do I report a problem with my order?",
        a: "Use the contact page and include your order number and a short description. For damaged goods, attach clear photos of the packaging and product. We aim to respond within one to two business days.",
      },
    ],
  },
  {
    heading: "Account & privacy",
    items: [
      {
        q: "Do I need an account to shop?",
        a: "You can check out as a guest. Creating an account makes it easier to review past orders and speeds up repeat purchases, but it is optional.",
      },
      {
        q: "How do you use my data?",
        a: "We use your details to process orders, communicate about your purchase, and—if you opt in—share occasional product updates. See our Privacy Policy for full details on cookies, marketing, and your rights.",
      },
    ],
  },
];

export default function FaqContent() {
  return (
    <div className="mx-auto max-w-3xl pb-24">
      {FAQ_SECTIONS.map((section) => (
        <section key={section.heading} className="mb-14 last:mb-0">
          <h2 className="text-lg font-semibold text-neutral-darkest mb-6">{section.heading}</h2>
          <div className="space-y-3">
            {section.items.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-neutral-light/90 bg-white/70 px-5 shadow-sm backdrop-blur-sm open:shadow-md transition-shadow"
              >
                <summary className="cursor-pointer list-none py-4 font-medium text-neutral-darkest flex items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <span className="text-left">{item.q}</span>
                  <span
                    className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-light/80 bg-background-main text-neutral-dark transition group-open:rotate-180"
                    aria-hidden
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-neutral-light/70 pb-4 pt-3 text-sm leading-relaxed text-neutral-dark">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
