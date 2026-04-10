import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerToken } from "@/lib/actions/auth";
import { getCustomerWithOrders } from "@/lib/shopify-customer";
import AccountDashboard from "@/components/account/AccountDashboard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Account",
  description: "View your NutriZen orders and manage your account details.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const token = await getCustomerToken();
  if (!token) redirect("/pages/account/login");

  const { customer, orders } = await getCustomerWithOrders(token);

  if (!customer) {
    // Token is invalid / expired — clear it and redirect
    redirect("/pages/account/login");
  }

  return (
    <div className="relative">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed left-0 top-32 h-96 w-96 rounded-full bg-primary/6 blur-[120px]" />
      <div className="pointer-events-none fixed right-0 bottom-20 h-72 w-72 rounded-full bg-secondary/6 blur-[100px]" />

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-16 md:py-24">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-neutral-dark" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-darkest">Account</span>
        </nav>

        <AccountDashboard customer={customer} orders={orders} />
      </section>
    </div>
  );
}
