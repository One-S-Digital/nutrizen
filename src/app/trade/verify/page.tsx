import type { Metadata } from "next";
import Link from "next/link";
import TradeConfirmForm from "@/components/trade/TradeConfirmForm";
import { findTradeAccount } from "@/lib/trade/accounts-source";
import { getTradeSecret } from "@/lib/trade/session";
import { verifyToken } from "@/lib/trade/tokens";

// The sign-in token is in this page's URL, so never send it on as a referrer.
export const metadata: Metadata = { referrer: "no-referrer" };

export default async function TradeVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  // Checks the link without using it up. Signing in happens when the button is pressed.
  const secret = getTradeSecret();
  const claims = secret && token ? await verifyToken(token, "magic", secret) : null;
  const account = claims ? await findTradeAccount(claims.email) : null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
      <div className="mx-auto max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Trade portal</p>

        {token && account ? (
          <>
            <h1 className="mt-3 text-3xl font-bold text-neutral-darkest md:text-4xl">
              Welcome{account.business ? `, ${account.business}` : ""}
            </h1>
            <p className="mt-3 text-neutral-dark">One more step: press the button to open the order portal.</p>
            <div className="mt-10 rounded-[2rem] border border-neutral-light/90 bg-white/80 p-8 shadow-sm backdrop-blur-md">
              <TradeConfirmForm token={token} />
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-bold text-neutral-darkest md:text-4xl">Link not valid</h1>
            <p className="mt-3 text-neutral-dark">
              This sign-in link has expired or is not valid. Links last 15 minutes and work once.
            </p>
            <Link
              href="/trade/login"
              className="mt-8 inline-block rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-[0_4px_14px_0_rgba(140,171,119,0.35)] transition hover:bg-[#7a9d65]"
            >
              Get a new link
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
