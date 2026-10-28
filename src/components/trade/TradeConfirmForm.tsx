"use client";

import Link from "next/link";
import { useActionState } from "react";
import { confirmTradeLoginAction } from "@/lib/actions/trade";
import type { ConfirmState } from "@/lib/trade/types";

const initialState: ConfirmState = {};

export default function TradeConfirmForm({ token }: { token: string }) {
  const [state, dispatch, pending] = useActionState(confirmTradeLoginAction, initialState);

  return (
    <form action={dispatch} className="space-y-5">
      <input type="hidden" name="token" value={token} />

      {state.error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{state.error}</p>
          <Link href="/trade/login" className="mt-2 inline-block font-medium underline">
            Get a new link
          </Link>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-[0_4px_14px_0_rgba(140,171,119,0.35)] transition hover:bg-[#7a9d65] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Open the order portal"}
      </button>
    </form>
  );
}
