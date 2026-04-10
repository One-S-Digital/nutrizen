"use client";

import { logoutAction } from "@/lib/actions/auth";
import type { Customer, CustomerOrder } from "@/lib/shopify-customer";

interface AccountDashboardProps {
  customer: Customer;
  orders: CustomerOrder[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatMoney(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export default function AccountDashboard({ customer, orders }: AccountDashboardProps) {
  const displayName = [customer.firstName, customer.lastName].filter(Boolean).join(" ") || customer.email;

  return (
    <div className="space-y-10">
      {/* Profile card */}
      <div className="rounded-[2rem] border border-neutral-light/90 bg-white/70 p-8 shadow-sm backdrop-blur-md">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary mb-1">Account</p>
            <h2 className="text-2xl font-bold text-neutral-darkest">{displayName}</h2>
            <p className="mt-1 text-sm text-neutral-dark">{customer.email}</p>
            {customer.phone && (
              <p className="mt-0.5 text-sm text-neutral-dark">{customer.phone}</p>
            )}
            <p className="mt-2 text-xs text-neutral-400">
              Member since {formatDate(customer.createdAt)}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-xl border-2 border-primary/60 px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {/* Orders */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-darkest mb-4">Recent orders</h3>

        {orders.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-neutral-light bg-background-alt/60 px-8 py-12 text-center">
            <p className="text-neutral-dark text-sm">You haven&apos;t placed any orders yet.</p>
            <a
              href="/shop"
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(140,171,119,0.3)] transition hover:bg-[#7a9d65]"
            >
              Shop now
            </a>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-[2rem] border border-neutral-light/90 bg-white/70 p-6 shadow-sm backdrop-blur-md"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-neutral-darkest">{order.name}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">{formatDate(order.processedAt)}</p>
                    <ul className="mt-3 space-y-1">
                      {order.lineItems.map((item, i) => (
                        <li key={i} className="text-sm text-neutral-dark">
                          {item.quantity} &times; {item.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-neutral-darkest">
                      {formatMoney(order.totalPrice.amount, order.totalPrice.currencyCode)}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
                      {order.financialStatus.toLowerCase().replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
