"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { logoutTradeAction, submitTradeOrderAction } from "@/lib/actions/trade";
import { MAX_QTY, PAYMENT_METHODS, SHIPPING, isResellerTier, money, priceOrder, tierLabel } from "@/lib/trade/order";
import type { OrderState, TradeAccount, TradeProduct, TradeTier } from "@/lib/trade/types";

const TIER_BLURB: Record<TradeTier, string> = {
  wholesaler: "Bulk stock for your own business. Delivered to you.",
  reseller: "You order for your customer and we ship to them, or to you.",
  resellerplus: "Our lowest reseller price. You order for your customer and we ship to them, or to you.",
};

const inputCls =
  "w-full rounded-xl border border-neutral-light bg-white px-4 py-3 text-sm text-neutral-darkest outline-none transition placeholder:text-neutral focus:border-primary focus:ring-2 focus:ring-primary/20";

const primaryBtnCls =
  "w-full rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-[0_4px_14px_0_rgba(140,171,119,0.35)] transition hover:bg-[#7a9d65] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60";

export default function OrderDesk({
  account,
  products,
}: {
  account: TradeAccount;
  products: TradeProduct[];
}) {
  // Bumping `round` remounts the form, which clears the previous order.
  const [round, setRound] = useState(0);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Trade portal</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-darkest md:text-4xl">
        Trade order portal
      </h1>
      <p className="mt-3 max-w-2xl text-neutral-dark">
        For approved NutriZen wholesalers and resellers. Build your order and send it to our team.
        Prices are in ZAR and confidential.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-dark">
        <span>
          Signed in as <strong className="font-semibold text-neutral-darkest">{account.email}</strong>
        </span>
        <span className="rounded-full bg-primary/15 px-3 py-1 font-medium text-neutral-darkest">
          {tierLabel(account.tier)}
        </span>
        <form action={logoutTradeAction}>
          <button type="submit" className="font-medium text-primary hover:underline">
            Sign out
          </button>
        </form>
      </div>

      <OrderForm
        key={round}
        account={account}
        products={products}
        onNewOrder={() => setRound((r) => r + 1)}
      />

      <p className="mt-10 text-xs text-neutral-dark">
        These products are supplements, not intended to diagnose, treat, cure or prevent any disease.
      </p>
    </section>
  );
}

function OrderForm({
  account,
  products,
  onNewOrder,
}: {
  account: TradeAccount;
  products: TradeProduct[];
  onNewOrder: () => void;
}) {
  const reseller = isResellerTier(account.tier);
  const [toSelf, setToSelf] = useState(false);
  const toCustomer = reseller && !toSelf;
  const [qty, setQty] = useState<Record<string, number>>({});
  const [state, dispatch, pending] = useActionState<OrderState, FormData>(submitTradeOrderAction, {
    status: "idle",
  });
  const resultRef = useRef<HTMLDivElement>(null);

  // The server recomputes all of this on submit; these totals are for display only.
  const { lines, subtotal, shipping, total } = priceOrder(products, qty);
  const profit = lines.reduce((s, l) => s + (l.rrp - l.unit) * l.qty, 0);

  useEffect(() => {
    if (state.status === "sent" || state.status === "manual") {
      resultRef.current?.scrollIntoView({ block: "start" });
    }
  }, [state]);

  function setQuantity(id: string, value: number) {
    const clean = Number.isFinite(value) ? Math.max(0, Math.min(MAX_QTY, Math.trunc(value))) : 0;
    setQty((q) => ({ ...q, [id]: clean }));
  }

  // onSubmit (not the form's action prop) so React does not wipe the form after a failed send.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => dispatch(data));
  }

  if (state.status === "sent") {
    return (
      <div ref={resultRef} className="mt-8 scroll-mt-40 rounded-[2rem] border-2 border-primary bg-primary/10 p-8">
        <h2 className="text-xl font-semibold text-neutral-darkest">Order {state.reference} sent</h2>
        <p className="mt-2 text-neutral-dark">
          Our team has received your order and will confirm payment and dispatch.
        </p>
        <button type="button" onClick={onNewOrder} className={`${primaryBtnCls} mt-6 sm:w-auto`}>
          Start another order
        </button>
      </div>
    );
  }

  return (
    <>
      {state.status === "manual" && (
        <div ref={resultRef} className="scroll-mt-40">
          <ManualPanel state={state} />
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="min-w-0 space-y-6">
            <Panel step="Step 1" title="Your price list">
              <p className="text-neutral-dark">
                You are ordering as a{" "}
                <strong className="font-semibold text-neutral-darkest">{tierLabel(account.tier)}</strong>.{" "}
                {TIER_BLURB[account.tier]}
              </p>
              <p className="mt-2 text-sm text-neutral-dark">
                Your price list is set by NutriZen. If it looks wrong, email{" "}
                <a href="mailto:hello@nutrizen.co.za" className="font-medium text-primary hover:underline">
                  hello@nutrizen.co.za
                </a>
                .
              </p>
            </Panel>

            <Panel step="Step 2" title="Choose products" hint="All products are 60 capsules.">
              <div
                className="hidden grid-cols-[minmax(0,1fr)_6rem_7.5rem_9rem] gap-x-4 border-b border-neutral-light pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-dark md:grid"
                aria-hidden
              >
                <span>Product</span>
                <span className="text-right">Retail price</span>
                <span className="text-right">{tierLabel(account.tier)} price</span>
                <span className="text-right">Qty</span>
              </div>
              <ul className="divide-y divide-neutral-light">
                {products.map((p) => (
                  <li
                    key={p.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 py-3 md:grid-cols-[minmax(0,1fr)_6rem_7.5rem_9rem]"
                  >
                    <p className="col-span-2 font-medium text-neutral-darkest md:col-span-1">{p.name}</p>
                    {/* Phone: your price on top, retail below. Desktop: wrapper dissolves into the table columns. */}
                    <div className="flex flex-col-reverse md:contents">
                      <p className="text-xs tabular-nums text-neutral-dark md:text-sm md:text-right">
                        <span className="md:hidden">Retail </span>
                        {money(p.rrp)}
                      </p>
                      <p className="text-base font-semibold tabular-nums text-neutral-darkest md:text-sm md:text-right">
                        {money(p.price)}
                      </p>
                    </div>
                    <Stepper
                      name={`qty_${p.id}`}
                      label={p.name}
                      value={qty[p.id] ?? 0}
                      onChange={(v) => setQuantity(p.id, v)}
                    />
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel step="Step 3" title="Your details" hint="Who is placing this order.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="business" label="Business name">
                  <input id="business" name="business" type="text" autoComplete="organization" defaultValue={account.business} className={inputCls} />
                </Field>
                <Field id="contact" label="Contact person">
                  <input id="contact" name="contact" type="text" autoComplete="name" className={inputCls} />
                </Field>
                <Field id="email" label="Email">
                  <input id="email" name="email" type="email" autoComplete="email" defaultValue={account.email} className={inputCls} />
                </Field>
                <Field id="phone" label="Phone">
                  <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputCls} />
                </Field>
              </div>
            </Panel>

            <Panel
              step="Step 4"
              title="Delivery"
              hint={
                !reseller
                  ? "Where we should deliver your stock."
                  : toCustomer
                    ? "Collect payment from your customer first, then enter their delivery details. Tracking goes to your own email above."
                    : "We deliver this order to you. Tracking goes to your email above."
              }
            >
              {reseller && (
                <fieldset className="mb-4">
                  <legend className="mb-2 text-sm font-medium text-neutral-700">Deliver to</legend>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                    <label className="flex items-center gap-2 text-sm text-neutral-800">
                      <input type="radio" name="deliverTo" value="customer" checked={!toSelf} onChange={() => setToSelf(false)} />
                      My customer
                    </label>
                    <label className="flex items-center gap-2 text-sm text-neutral-800">
                      <input type="radio" name="deliverTo" value="self" checked={toSelf} onChange={() => setToSelf(true)} />
                      Me (my own address)
                    </label>
                  </div>
                </fieldset>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {toCustomer && (
                  <>
                    <Field id="recipient" label="Customer name">
                      <input id="recipient" name="recipient" type="text" autoComplete="off" className={inputCls} />
                    </Field>
                    <Field id="recipientPhone" label="Customer phone">
                      <input id="recipientPhone" name="recipientPhone" type="tel" autoComplete="off" className={inputCls} />
                    </Field>
                  </>
                )}
                <Field id="address" label={toCustomer ? "Customer delivery address" : "Delivery address"} full>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    autoComplete="off"
                    placeholder="Street, suburb, city, postal code"
                    className={`${inputCls} resize-y`}
                  />
                </Field>
                <Field id="payment" label="Payment method">
                  <select id="payment" name="payment" defaultValue="" className={inputCls}>
                    <option value="">Select…</option>
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="notes" label="Order notes (optional)" full>
                  <textarea id="notes" name="notes" rows={3} placeholder="Anything we should know" className={`${inputCls} resize-y`} />
                </Field>
              </div>
            </Panel>

            <Panel step="Step 5" title="Before you send">
              <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-dark">
                <li>Orders placed before 10:00 are collected by courier the same day. Later orders go the next business day.</li>
                <li>Delivery takes 2–4 business days in main areas and 5–7 in outlying areas.</li>
                <li>Opened products cannot be returned. Report damaged or incorrect items within 24 hours, with photos.</li>
                <li>Full payment is required before delivery unless agreed otherwise.</li>
              </ul>
              <label htmlFor="agree" className="mt-5 flex items-start gap-3 text-sm text-neutral-darkest">
                <input id="agree" name="agree" type="checkbox" className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#8CAB77]" />
                <span>
                  I have signed the NutriZen Reseller Agreement and will follow its marketing, pricing and
                  confidentiality terms.
                </span>
              </label>
            </Panel>
          </div>

          <aside aria-label="Order summary" className="lg:sticky lg:top-36">
            <section className="rounded-[2rem] border border-neutral-light/90 bg-white/80 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-neutral-darkest">Your order</h2>

              {lines.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-dark">No products added yet.</p>
              ) : (
                <>
                  <ul className="mt-3 space-y-1.5 text-sm tabular-nums">
                    {lines.map((l) => (
                      <li key={l.name} className="flex justify-between gap-3">
                        <span className="min-w-0 [overflow-wrap:anywhere]">
                          {l.qty} × {l.name}
                        </span>
                        <span>{money(l.line)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 space-y-1 border-t border-neutral-light pt-3 text-sm tabular-nums">
                    <div className="flex justify-between gap-3">
                      <span>Products</span>
                      <span>{money(subtotal)}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Shipping</span>
                      <span>{money(shipping)}</span>
                    </div>
                    <div className="flex justify-between gap-3 pt-1.5 text-lg font-bold text-neutral-darkest">
                      <span>Total</span>
                      <span>{money(total)}</span>
                    </div>
                  </div>
                  {reseller && (
                    <p className="mt-3 rounded-xl bg-primary/15 px-3 py-2.5 text-sm text-neutral-darkest">
                      Your profit at recommended retail: <strong>{money(profit)}</strong> (retail price minus your price).
                    </p>
                  )}
                </>
              )}

              <button type="submit" disabled={pending} className={`${primaryBtnCls} mt-5`}>
                {pending ? "Sending…" : "Send order"}
              </button>

              <div role="alert" aria-live="assertive" className="mt-3 text-sm text-red-700">
                {state.status === "error" && (
                  <>
                    <strong>Please fix:</strong>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5">
                      {state.errors.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <p className="mt-3 text-xs text-neutral-dark">
                Shipping is {money(SHIPPING)} for orders under 5 kg. We confirm shipping for heavier orders.
              </p>
            </section>
          </aside>
        </div>
      </form>
    </>
  );
}

function Panel({
  step,
  title,
  hint,
  children,
}: {
  step: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-neutral-light/90 bg-white/80 p-6 shadow-sm md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{step}</p>
      <h2 className="mt-1 text-xl font-semibold text-neutral-darkest">{title}</h2>
      {hint && <p className="mt-1 text-sm text-neutral-dark">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  full,
  children,
}: {
  id: string;
  label: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-neutral-darkest">
        {label}
      </label>
      {children}
    </div>
  );
}

function Stepper({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const btn =
    "h-10 w-10 text-lg text-neutral-darkest transition hover:bg-primary/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-35";
  return (
    <div className="inline-flex items-center justify-self-end overflow-hidden rounded-xl border border-neutral-light bg-white">
      <button type="button" className={btn} aria-label={`Decrease ${label}`} disabled={value <= 0} onClick={() => onChange(value - 1)}>
        −
      </button>
      <input
        name={name}
        type="number"
        inputMode="numeric"
        min={0}
        max={MAX_QTY}
        value={value}
        aria-label={`Quantity for ${label}`}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="h-10 w-14 border-x border-neutral-light bg-white text-center text-sm tabular-nums text-neutral-darkest outline-none [appearance:textfield] focus:bg-primary/5 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button type="button" className={btn} aria-label={`Increase ${label}`} disabled={value >= MAX_QTY} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}

function ManualPanel({ state }: { state: Extract<OrderState, { status: "manual" }> }) {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const mailto = `mailto:${state.to}?subject=${encodeURIComponent(state.subject)}&body=${encodeURIComponent(state.text)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(state.text);
      setCopied(true);
    } catch {
      textRef.current?.focus();
      textRef.current?.select();
    }
  }

  return (
    <div role="status" className="mt-8 rounded-[2rem] border-2 border-secondary bg-secondary/10 p-8">
      <h2 className="text-xl font-semibold text-neutral-darkest">Order {state.reference} is ready. Not sent yet.</h2>
      <p className="mt-2 text-neutral-dark">
        We could not send this order from the portal. Press Email order to open your email app with
        everything filled in, then send it to {state.to}. If nothing opens, copy the order below and email
        it. You can also press Send order again.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a href={mailto} className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
          Email order
        </a>
        <button type="button" onClick={copy} className="rounded-xl border border-secondary bg-white px-4 py-2.5 text-sm font-semibold text-neutral-darkest transition hover:bg-secondary/10">
          {copied ? "Copied" : "Copy order"}
        </button>
      </div>
      <textarea
        ref={textRef}
        readOnly
        value={state.text}
        aria-label="Order text"
        className="mt-4 h-56 w-full rounded-xl border border-neutral-light bg-white p-3 font-mono text-xs text-neutral-darkest"
      />
    </div>
  );
}
