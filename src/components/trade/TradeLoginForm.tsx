"use client";

import { useActionState, useEffect } from "react";
import Script from "next/script";
import { requestTradeLinkAction } from "@/lib/actions/trade";
import type { LinkRequestState } from "@/lib/trade/types";

const initialState: LinkRequestState = {};

export default function TradeLoginForm({ siteKey }: { siteKey: string }) {
  const [state, dispatch, pending] = useActionState(requestTradeLinkAction, initialState);

  // A Turnstile token works once, so get a fresh one after every attempt. The form is
  // never hidden: a widget that is hidden with display:none comes back blank.
  useEffect(() => {
    if (state.error || state.sent) {
      (window as Window & { turnstile?: { reset: () => void } }).turnstile?.reset();
    }
  }, [state]);

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />

      {state.sent && (
        <div role="status" className="mb-6 space-y-1.5 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3.5">
          <h2 className="text-base font-semibold text-neutral-darkest">Check your inbox</h2>
          <p className="text-sm text-neutral-dark">
            If <strong className="font-medium text-neutral-darkest">{state.email}</strong> is approved for
            the trade portal, a sign-in link is on its way. It works once and expires in 15 minutes.
            Nothing there? Check your spam folder.
          </p>
        </div>
      )}

      <form action={dispatch} className="space-y-5">
        {state.error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <div>
          <label htmlFor="trade-email" className="mb-1.5 block text-sm font-medium text-neutral-darkest">
            Email address
          </label>
          <input
            id="trade-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            defaultValue={state.error ? (state.email ?? "") : ""}
            className="w-full rounded-xl border border-neutral-light bg-white px-4 py-3 text-sm text-neutral-darkest outline-none transition placeholder:text-neutral focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="you@yourbusiness.co.za"
          />
        </div>

        <div className="cf-turnstile" data-sitekey={siteKey} data-theme="light" />

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-[0_4px_14px_0_rgba(140,171,119,0.35)] transition hover:bg-[#7a9d65] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60"
        >
          {pending ? "Sending…" : state.sent ? "Send another link" : "Email me a sign-in link"}
        </button>
      </form>
    </>
  );
}
