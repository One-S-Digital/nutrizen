"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginCustomer, logoutCustomer, registerCustomer } from "@/lib/shopify-customer";

export const CUSTOMER_TOKEN_COOKIE = "nutrizen_customer_token";

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

// ---------------------------------------------------------------------------
// Set / clear token cookie helpers (server-only)
// ---------------------------------------------------------------------------
async function setTokenCookie(accessToken: string, expiresAt: string) {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(expiresAt),
    path: "/",
  });
}

async function clearTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_TOKEN_COOKIE);
}

export async function getCustomerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value ?? null;
}

// ---------------------------------------------------------------------------
// Login action
// ---------------------------------------------------------------------------
export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { token, errors } = await loginCustomer({ email, password });

  if (errors.length > 0 || !token) {
    return { error: errors[0]?.message ?? "Login failed. Please check your credentials." };
  }

  await setTokenCookie(token.accessToken, token.expiresAt);
  redirect("/pages/account");
}

// ---------------------------------------------------------------------------
// Register action
// ---------------------------------------------------------------------------
export async function registerAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const firstName = (formData.get("firstName") as string | null)?.trim() ?? "";
  const lastName = (formData.get("lastName") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  const fieldErrors: Record<string, string> = {};
  if (!firstName) fieldErrors.firstName = "First name is required.";
  if (!email) fieldErrors.email = "Email is required.";
  if (!password || password.length < 8) fieldErrors.password = "Password must be at least 8 characters.";

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const { customer, errors } = await registerCustomer({ firstName, lastName, email, password });

  if (errors.length > 0 || !customer) {
    // Map field-level Shopify errors
    const fe: Record<string, string> = {};
    for (const err of errors) {
      const field = err.field?.[err.field.length - 1];
      if (field) fe[field] = err.message;
      else return { error: err.message };
    }
    if (Object.keys(fe).length > 0) return { fieldErrors: fe };
    return { error: "Registration failed. Please try again." };
  }

  // Auto-login after successful registration
  const { token, errors: loginErrors } = await loginCustomer({ email, password });
  if (token && loginErrors.length === 0) {
    await setTokenCookie(token.accessToken, token.expiresAt);
  }

  redirect("/pages/account");
}

// ---------------------------------------------------------------------------
// Logout action
// ---------------------------------------------------------------------------
export async function logoutAction(): Promise<void> {
  const token = await getCustomerToken();
  if (token) {
    await logoutCustomer(token);
  }
  await clearTokenCookie();
  redirect("/pages/account/login");
}
