import { shouldUseShopifyMock } from "@/lib/shopify-mode";
import {
  createAccountsLoader,
  fetchShopifyTradeAccounts,
  normalizeEmail,
  parseAccounts,
} from "./accounts";
import type { TradeAccount } from "./types";

// A removed buyer loses access within this long.
const REFRESH_MS = 60_000;

const loadFromShopify = createAccountsLoader(
  () =>
    fetchShopifyTradeAccounts({
      domain: process.env.SHOPIFY_STORE_DOMAIN ?? "",
      token: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "",
    }),
  REFRESH_MS
);

let envCache: { raw: string | undefined; accounts: TradeAccount[] } | null = null;

function loadFromEnv(): TradeAccount[] {
  const raw = process.env.TRADE_ACCOUNTS;
  if (!envCache || envCache.raw !== raw) envCache = { raw, accounts: parseAccounts(raw) };
  return envCache.accounts;
}

/**
 * Live: the "Trade Account" entries in Shopify. Local development (mock Shopify mode)
 * or no Shopify credentials: the TRADE_ACCOUNTS env var, so the portal can be tried
 * without touching the store. When live Shopify is in use, TRADE_ACCOUNTS is ignored.
 */
export async function getTradeAccounts(): Promise<TradeAccount[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  if (shouldUseShopifyMock() || !domain || !token) return loadFromEnv();
  return loadFromShopify();
}

export async function findTradeAccount(email: string): Promise<TradeAccount | null> {
  const wanted = normalizeEmail(email);
  return (await getTradeAccounts()).find((a) => a.email === wanted) ?? null;
}
