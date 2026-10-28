import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findTradeAccount } from "./accounts-source";
import { SESSION_TTL_SECONDS, TRADE_LOGIN_PATH, TRADE_SESSION_COOKIE } from "./constants";
import { signToken, verifyToken } from "./tokens";
import type { TradeAccount } from "./types";

/** Signing secret. In production it must be set (32+ chars) or nobody can sign in. */
export function getTradeSecret(): string | null {
  const secret = process.env.TRADE_SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV !== "production") return "dev-only-trade-secret-never-use-in-production";
  console.error("[trade] TRADE_SESSION_SECRET is missing or shorter than 32 characters.");
  return null;
}

export async function createTradeSession(email: string): Promise<void> {
  const secret = getTradeSecret();
  if (!secret) throw new Error("Trade sessions are not configured.");
  const token = await signToken({
    use: "session",
    email,
    expiresIn: `${SESSION_TTL_SECONDS}s`,
    secret,
  });
  const store = await cookies();
  store.set(TRADE_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // lax so a link opened from an email still arrives signed in
    path: "/trade",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearTradeSession(): Promise<void> {
  const store = await cookies();
  store.delete({ name: TRADE_SESSION_COOKIE, path: "/trade" });
}

/**
 * The real access check. Verifies the cookie signature AND that the email is still
 * on the approved list, so removing an account locks it out even with a live cookie.
 * The proxy only does a cheap "has a cookie" check; always call this next to the data.
 */
export const getTradeSession = cache(async (): Promise<TradeAccount | null> => {
  // Read the cookie first, always. It is a request-time API, so every page that calls
  // this renders per request and can never be prerendered at build time (for example
  // as a baked-in redirect when the secret is not set during the build).
  const token = (await cookies()).get(TRADE_SESSION_COOKIE)?.value;
  const secret = getTradeSecret();
  if (!token || !secret) return null;
  const claims = await verifyToken(token, "session", secret);
  if (!claims) return null;
  return findTradeAccount(claims.email);
});

export async function requireTradeSession(): Promise<TradeAccount> {
  const account = await getTradeSession();
  if (!account) redirect(TRADE_LOGIN_PATH);
  return account;
}
