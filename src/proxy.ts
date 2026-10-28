import { type NextRequest, NextResponse } from "next/server";
import { TRADE_LOGIN_PATH, TRADE_SESSION_COOKIE, TRADE_VERIFY_PATH } from "@/lib/trade/constants";

// Keep in sync with CUSTOMER_TOKEN_COOKIE in src/lib/actions/auth.ts
const CUSTOMER_TOKEN_COOKIE = "nutrizen_customer_token";

/**
 * Lightweight proxy for route protection. Cookie-presence checks only: the real
 * checks run next to the data (getTradeSession / getCustomerToken).
 * - /trade (and sub-routes, except login and verify) → redirect to trade login if no session cookie
 * - /pages/account (and sub-routes, except /login) → redirect to login if no token
 * - /pages/account/login → redirect to account if already authenticated
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/trade" || pathname.startsWith("/trade/")) {
    const isPublicTradePage = pathname === TRADE_LOGIN_PATH || pathname === TRADE_VERIFY_PATH;
    if (!isPublicTradePage && !request.cookies.has(TRADE_SESSION_COOKIE)) {
      return NextResponse.redirect(new URL(TRADE_LOGIN_PATH, request.url));
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value;

  const isLoginPage = pathname === "/pages/account/login";
  const isAccountPage = pathname.startsWith("/pages/account") && !isLoginPage;

  if (isAccountPage && !token) {
    return NextResponse.redirect(new URL("/pages/account/login", request.url));
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/pages/account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pages/account", "/pages/account/:path*", "/trade", "/trade/:path*"],
};
