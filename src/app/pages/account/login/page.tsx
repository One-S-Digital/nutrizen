import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerToken } from "@/lib/actions/auth";
import AuthForm from "@/components/account/AuthForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your NutriZen account to view orders and manage your profile.",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Redirect authenticated users to their account
  const token = await getCustomerToken();
  if (token) redirect("/pages/account");

  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed left-1/4 top-20 h-80 w-80 rounded-full bg-primary/8 blur-[100px]" />
      <div className="pointer-events-none fixed right-1/4 bottom-20 h-64 w-64 rounded-full bg-secondary/8 blur-[80px]" />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
        <div className="mx-auto max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Your account</p>
          <h1 className="mt-3 text-3xl font-bold text-neutral-darkest md:text-4xl">
            Welcome back
          </h1>
          <p className="mt-3 text-neutral-dark">
            Sign in to track orders and manage your NutriZen account.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-md">
          <div className="rounded-[2rem] border border-neutral-light/90 bg-white/80 p-8 shadow-sm backdrop-blur-md">
            <AuthForm />
          </div>
        </div>
      </section>
    </div>
  );
}
