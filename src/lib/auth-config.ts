// Shared constants and types for customer auth.
// Must NOT have "use server" — imported by both client and server modules.

export const CUSTOMER_TOKEN_COOKIE = "nutrizen_customer_token";

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};
