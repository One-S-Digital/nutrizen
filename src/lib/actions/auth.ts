"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginCustomer, logoutCustomer, registerCustomer } from "@/lib/shopify-customer";
import { CUSTOMER_TOKEN_COOKIE, type AuthState } from "@/lib/auth-config";

// ---------------------------------------------------------------------------
// Set / clear token cookie helpers (server-only)
// ---------------------------------------------------------------------------
async function setTokenCookie(accessToken: string, expiresAt: string) {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: true, // Always require HTTPS; use `mkcert` or similar for local dev
    sameSite: "strict",
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
// Validation helpers
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): string | null {
  if (!email) return "Email is required.";
  if (email.length > 254) return "Email address is too long.";
  if (!EMAIL_RE.test(email)) return "Please enter a valid email address.";
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > 128) return "Password is too long.";
  return null;
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

  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);
  if (emailErr || passErr) {
    return { fieldErrors: { ...(emailErr && { email: emailErr }), ...(passErr && { password: passErr }) } };
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
  else if (firstName.length > 50) fieldErrors.firstName = "First name is too long.";
  if (lastName.length > 50) fieldErrors.lastName = "Last name is too long.";
  const emailErr = validateEmail(email);
  if (emailErr) fieldErrors.email = emailErr;
  const passErr = validatePassword(password);
  if (passErr) fieldErrors.password = passErr;

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const { customer, errors } = await registerCustomer({ firstName, lastName, email, password });

  if (errors.length > 0 || !customer) {
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
