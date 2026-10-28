"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { isValidEmail, normalizeEmail } from "@/lib/trade/accounts";
import { findTradeAccount } from "@/lib/trade/accounts-source";
import { MAGIC_LINK_TTL, MAGIC_LINK_TTL_MS, TRADE_LOGIN_PATH, TRADE_VERIFY_PATH } from "@/lib/trade/constants";
import { allow, consumeOnce } from "@/lib/trade/guards";
import { sendTradeMail } from "@/lib/trade/mailer";
import {
  formatOrderText,
  makeReference,
  orderSubject,
  parseQuantities,
  priceOrder,
  readDetails,
  validateOrder,
} from "@/lib/trade/order";
import { productsForTier } from "@/lib/trade/products";
import { clearTradeSession, createTradeSession, getTradeSecret, getTradeSession } from "@/lib/trade/session";
import { signToken, verifyToken } from "@/lib/trade/tokens";
import type { ConfirmState, LinkRequestState, OrderState } from "@/lib/trade/types";
import { verifyTurnstile } from "@/lib/turnstile";

// Best-effort: X-Forwarded-For can be spoofed, so the per-email limit is the real brake.
function clientIp(h: Headers): string {
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

// Sign-in links are built from config in production, never from the request's Host header.
function siteOrigin(h: Headers): string {
  if (process.env.NODE_ENV === "production") {
    return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutrizen.co.za").replace(/\/$/, "");
  }
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${h.get("x-forwarded-proto") ?? "http"}://${host}`;
}

// ---------------------------------------------------------------------------
// Step 1: ask for a sign-in link. The answer is identical whether or not the
// email is approved, so this form cannot be used to discover who has an account.
// ---------------------------------------------------------------------------
export async function requestTradeLinkAction(
  _prev: LinkRequestState,
  formData: FormData
): Promise<LinkRequestState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!isValidEmail(email)) return { error: "Enter a valid email address.", email };

  const captcha = formData.get("cf-turnstile-response");
  if (!(await verifyTurnstile(typeof captcha === "string" ? captcha : null))) {
    return { error: "Please complete the captcha and try again.", email };
  }

  const h = await headers();
  if (
    !allow(`link:ip:${clientIp(h)}`, 10, MAGIC_LINK_TTL_MS) ||
    !allow(`link:email:${email}`, 3, MAGIC_LINK_TTL_MS)
  ) {
    return { error: "Too many requests. Please wait a few minutes and try again.", email };
  }

  const account = await findTradeAccount(email);
  const secret = getTradeSecret();
  if (account && secret) {
    const origin = siteOrigin(h);
    // after() sends the email once the response has gone, so response time does not
    // reveal whether the address is approved.
    after(async () => {
      const token = await signToken({
        use: "magic",
        email: account.email,
        expiresIn: MAGIC_LINK_TTL,
        secret,
        jti: crypto.randomUUID(),
      });
      const link = `${origin}${TRADE_VERIFY_PATH}?token=${encodeURIComponent(token)}`;
      await sendTradeMail({
        to: account.email,
        subject: "Your NutriZen trade sign-in link",
        text: [
          account.business ? `Hi ${account.business},` : "Hi,",
          "",
          "Use this link to sign in to the NutriZen trade order portal:",
          "",
          link,
          "",
          "The link works once and expires in 15 minutes. If you did not ask for it, ignore this email: nobody can sign in without it.",
          "",
          "NutriZen",
        ].join("\n"),
      });
    });
  }

  return { sent: true, email };
}

// ---------------------------------------------------------------------------
// Step 2: the link opens a page with a button; the button posts here. Signing in
// on a plain GET would let email scanners that pre-open links use up the link.
// ---------------------------------------------------------------------------
export async function confirmTradeLoginAction(
  _prev: ConfirmState,
  formData: FormData
): Promise<ConfirmState> {
  const secret = getTradeSecret();
  const token = formData.get("token");
  const claims =
    secret && typeof token === "string" ? await verifyToken(token, "magic", secret) : null;
  const account = claims ? await findTradeAccount(claims.email) : null;

  if (!claims?.jti || !account || !consumeOnce(claims.jti, claims.exp * 1000)) {
    return { error: "This link has expired or has already been used. Request a new one." };
  }

  await createTradeSession(account.email);
  redirect("/trade");
}

export async function logoutTradeAction(): Promise<void> {
  await clearTradeSession();
  redirect(TRADE_LOGIN_PATH);
}

// ---------------------------------------------------------------------------
// Submit an order. The browser sends quantities and contact details only: every
// price, total and the shipping charge is recomputed here from the server's list.
// ---------------------------------------------------------------------------
export async function submitTradeOrderAction(
  _prev: OrderState,
  formData: FormData
): Promise<OrderState> {
  const account = await getTradeSession();
  if (!account) redirect(TRADE_LOGIN_PATH);

  const get = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : null;
  };

  let products: ReturnType<typeof productsForTier>;
  try {
    products = productsForTier(account.tier);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    return { status: "error", errors: ["Ordering is unavailable right now. Please email hello@nutrizen.co.za."] };
  }
  const { qty, errors: qtyErrors } = parseQuantities(products, get);
  const priced = priceOrder(products, qty);
  const details = readDetails(get);

  const errors = [...qtyErrors, ...validateOrder(account.tier, details, priced.lines.length)];
  if (errors.length > 0) return { status: "error", errors };

  if (!allow(`order:${account.email}`, 10, 60 * 60 * 1000)) {
    return {
      status: "error",
      errors: ["Too many orders sent in the last hour. Please email hello@nutrizen.co.za."],
    };
  }

  const reference = makeReference();
  const subject = orderSubject(account.tier, reference, details.business);
  const text = formatOrderText({ reference, account, details, ...priced });

  const to = process.env.TRADE_ORDER_EMAIL?.trim() || "hello@nutrizen.co.za";
  const sent = await sendTradeMail({ to, subject, text, replyTo: details.email });

  return sent ? { status: "sent", reference } : { status: "manual", reference, to, subject, text };
}
