import { type NextRequest, NextResponse } from "next/server";

// Keep in sync with CUSTOMER_TOKEN_COOKIE in src/lib/actions/auth.ts
const CUSTOMER_TOKEN_COOKIE = "nutrizen_customer_token";

/**
 * Lightweight middleware for customer account route protection.
 * - /pages/account (and sub-routes, except /login) → redirect to login if no token
 * - /pages/account/login → redirect to account if already authenticated
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
  matcher: ["/pages/account", "/pages/account/:path*"],
};
