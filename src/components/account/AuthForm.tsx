"use client";

import { useActionState, useState } from "react";
import { loginAction, registerAction } from "@/lib/actions/auth";
import type { AuthState } from "@/lib/auth-config";

const initialState: AuthState = {};

export default function AuthForm() {
  const [tab, setTab] = useState<"login" | "register">("login");

  const [loginState, loginDispatch, loginPending] = useActionState(loginAction, initialState);
  const [registerState, registerDispatch, registerPending] = useActionState(registerAction, initialState);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-neutral-light mb-8">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={`flex-1 py-3 text-sm font-semibold tracking-wide transition-colors ${
            tab === "login"
              ? "text-primary border-b-2 border-primary -mb-px"
              : "text-neutral-dark hover:text-neutral-darkest"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={`flex-1 py-3 text-sm font-semibold tracking-wide transition-colors ${
            tab === "register"
              ? "text-primary border-b-2 border-primary -mb-px"
              : "text-neutral-dark hover:text-neutral-darkest"
          }`}
        >
          Create account
        </button>
      </div>

      {tab === "login" ? (
        <form action={loginDispatch} className="space-y-5">
          {loginState.error && (
            <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {loginState.error}
            </p>
          )}

          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-neutral-darkest mb-1.5">
              Email address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-neutral-light bg-white px-4 py-3 text-sm text-neutral-darkest placeholder-neutral-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-neutral-darkest mb-1.5">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-neutral-light bg-white px-4 py-3 text-sm text-neutral-darkest placeholder-neutral-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loginPending}
            className="w-full rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-[0_4px_14px_0_rgba(140,171,119,0.35)] transition hover:bg-[#7a9d65] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {loginPending ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-sm text-neutral-dark">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setTab("register")}
              className="font-medium text-primary hover:underline"
            >
              Create one
            </button>
          </p>
        </form>
      ) : (
        <form action={registerDispatch} className="space-y-5">
          {registerState.error && (
            <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {registerState.error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-firstName" className="block text-sm font-medium text-neutral-darkest mb-1.5">
                First name
              </label>
              <input
                id="reg-firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="w-full rounded-xl border border-neutral-light bg-white px-4 py-3 text-sm text-neutral-darkest placeholder-neutral-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Jane"
              />
              {registerState.fieldErrors?.firstName && (
                <p className="mt-1 text-xs text-red-600">{registerState.fieldErrors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="reg-lastName" className="block text-sm font-medium text-neutral-darkest mb-1.5">
                Last name
              </label>
              <input
                id="reg-lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                className="w-full rounded-xl border border-neutral-light bg-white px-4 py-3 text-sm text-neutral-darkest placeholder-neutral-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Smith"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-neutral-darkest mb-1.5">
              Email address
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-neutral-light bg-white px-4 py-3 text-sm text-neutral-darkest placeholder-neutral-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="you@example.com"
            />
            {registerState.fieldErrors?.email && (
              <p className="mt-1 text-xs text-red-600">{registerState.fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-neutral-darkest mb-1.5">
              Password
              <span className="ml-1 font-normal text-neutral-400">(min. 8 characters)</span>
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="w-full rounded-xl border border-neutral-light bg-white px-4 py-3 text-sm text-neutral-darkest placeholder-neutral-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
            />
            {registerState.fieldErrors?.password && (
              <p className="mt-1 text-xs text-red-600">{registerState.fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={registerPending}
            className="w-full rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-[0_4px_14px_0_rgba(140,171,119,0.35)] transition hover:bg-[#7a9d65] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {registerPending ? "Creating account…" : "Create account"}
          </button>

          <p className="text-center text-sm text-neutral-dark">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setTab("login")}
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
