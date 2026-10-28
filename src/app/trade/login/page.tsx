import { redirect } from "next/navigation";
import TradeLoginForm from "@/components/trade/TradeLoginForm";
import { getTradeSession } from "@/lib/trade/session";

export default async function TradeLoginPage() {
  if (await getTradeSession()) redirect("/trade");

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
      <div className="mx-auto max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Trade portal</p>
        <h1 className="mt-3 text-3xl font-bold text-neutral-darkest md:text-4xl">Sign in to order</h1>
        <p className="mt-3 text-neutral-dark">
          For approved NutriZen wholesalers and resellers. Enter your email and we will send you a
          sign-in link. No password needed.
        </p>

        <div className="mt-10 rounded-[2rem] border border-neutral-light/90 bg-white/80 p-8 shadow-sm backdrop-blur-md">
          <TradeLoginForm
            siteKey={
              process.env.TURNSTILE_SITE_KEY ??
              process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
              "1x00000000000000000000AA"
            }
          />
        </div>

        <p className="mt-6 text-sm text-neutral-dark">
          Not set up yet? Email{" "}
          <a href="mailto:hello@nutrizen.co.za" className="font-medium text-primary hover:underline">
            hello@nutrizen.co.za
          </a>{" "}
          and we will get you started.
        </p>
      </div>
    </section>
  );
}
