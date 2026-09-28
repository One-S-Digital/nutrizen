import Link from "next/link";
import { NUTRIENT_FORMS } from "@/lib/seo-content/science";

export default function NutrientFormsTable() {
  return (
    <section className="bg-background-main py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-serif text-3xl font-bold text-neutral-darkest mb-6">Nutrient forms compared</h2>
        <div className="overflow-x-auto rounded-2xl border border-neutral-light/80">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-neutral-light/40 text-neutral-darkest">
                <th className="px-5 py-3 font-semibold">Nutrient form</th>
                <th className="px-5 py-3 font-semibold">What it&apos;s known for</th>
                <th className="px-5 py-3 font-semibold">Used in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-light/70">
              {NUTRIENT_FORMS.map((row) => (
                <tr key={row.form}>
                  <td className="px-5 py-4 font-medium text-neutral-darkest align-top">{row.form}</td>
                  <td className="px-5 py-4 text-neutral-dark align-top">{row.knownFor}</td>
                  <td className="px-5 py-4 align-top">
                    {row.usedIn.map((p, i) => (
                      <span key={p.handle}>
                        <Link href={`/products/${p.handle}`} className="text-primary hover:underline">
                          {p.title}
                        </Link>
                        {i < row.usedIn.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
