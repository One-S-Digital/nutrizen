// Who is approved for the trade portal. This file holds the pure logic (parsing,
// the Shopify fetch, the cache) so the unit tests can load it directly. Which source
// to use at runtime is decided in accounts-source.ts.

import type { TradeAccount, TradeTier } from "./types";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email) && email.length <= 254;
}

/** "Wholesaler", "Reseller", "Reseller Plus", "Reseller +" or "resellerplus" -> tier id; anything else -> null. */
export function normalizeTier(value: unknown): TradeTier | null {
  const key = typeof value === "string" ? value.toLowerCase().replace(/\+/g, "plus").replace(/[^a-z]/g, "") : "";
  return key === "wholesaler" || key === "reseller" || key === "resellerplus" ? key : null;
}

type Row = { label: string; email: unknown; business: unknown; tier: unknown };

/** Validates rows. Anything malformed is skipped, so a typo can only lock someone out, never let someone in. */
function toAccounts(rows: Row[]): TradeAccount[] {
  const accounts: TradeAccount[] = [];
  for (const row of rows) {
    const email = typeof row.email === "string" ? normalizeEmail(row.email) : "";
    const tier = normalizeTier(row.tier);
    if (!isValidEmail(email) || !tier) {
      console.error(`[trade] ${row.label} has an invalid email or tier and was skipped.`);
      continue;
    }
    if (accounts.some((a) => a.email === email)) {
      console.error(`[trade] ${row.label} repeats an email and was skipped.`);
      continue;
    }
    accounts.push({ email, business: typeof row.business === "string" ? row.business.trim() : "", tier });
  }
  return accounts;
}

/**
 * Local-testing source: the TRADE_ACCOUNTS env var, a JSON array of
 * { "email": "...", "business": "...", "tier": "wholesaler" | "reseller" | "resellerplus" }.
 */
export function parseAccounts(raw: string | undefined): TradeAccount[] {
  if (!raw?.trim()) return [];

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    console.error("[trade] TRADE_ACCOUNTS is not valid JSON. No trade accounts loaded.");
    return [];
  }
  if (!Array.isArray(data)) {
    console.error("[trade] TRADE_ACCOUNTS must be a JSON array. No trade accounts loaded.");
    return [];
  }

  return toAccounts(
    data.map((entry: unknown, i) => {
      const e = (entry ?? {}) as Record<string, unknown>;
      return { label: `TRADE_ACCOUNTS entry ${i + 1}`, email: e.email, business: e.business, tier: e.tier };
    })
  );
}

// ---------------------------------------------------------------------------
// Live source: "Trade Account" metaobject entries in Shopify (type "trade_account",
// fields email / business / tier), read through the Storefront API.
// ---------------------------------------------------------------------------

export type MetaobjectNode = {
  handle?: string;
  fields: { key: string; value: string | null }[];
};

export function accountsFromMetaobjects(nodes: MetaobjectNode[]): TradeAccount[] {
  return toAccounts(
    nodes.map((node, i) => {
      const f = Object.fromEntries(node.fields.map((x) => [x.key, x.value]));
      return {
        label: `Shopify trade account "${node.handle ?? i + 1}"`,
        email: f.email,
        business: f.business,
        tier: f.tier,
      };
    })
  );
}

const API_VERSION = "2026-01"; // same as src/lib/shopify-customer.ts
const MAX_PAGES = 8; // 8 x 250 entries
const QUERY = `query TradeAccounts($after: String) {
  metaobjects(type: "trade_account", first: 250, after: $after) {
    nodes { handle fields { key value } }
    pageInfo { hasNextPage endCursor }
  }
}`;

type ShopifyResponse = {
  data?: {
    metaobjects?: {
      nodes: MetaobjectNode[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  };
  errors?: { message?: string }[];
};

/**
 * Reads every Trade Account entry. THROWS on any failure (network, HTTP error, GraphQL
 * error, access denied, partial list) instead of returning an empty list: an empty list
 * would mean "nobody is approved" and must only ever come from Shopify actually saying so.
 */
export async function fetchShopifyTradeAccounts(opts: {
  domain: string;
  token: string;
  fetchImpl?: typeof fetch;
}): Promise<TradeAccount[]> {
  const doFetch = opts.fetchImpl ?? fetch;
  const endpoint = `https://${opts.domain.replace(/^https?:\/\//, "").replace(/\/$/, "")}/api/${API_VERSION}/graphql.json`;

  const nodes: MetaobjectNode[] = [];
  let after: string | null = null;

  for (let page = 0; page < MAX_PAGES; page++) {
    const res = await doFetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": opts.token,
      },
      body: JSON.stringify({ query: QUERY, variables: { after } }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Shopify answered HTTP ${res.status}`);

    const json = (await res.json()) as ShopifyResponse;
    if (json.errors?.length) throw new Error(`Shopify GraphQL error: ${json.errors[0]?.message ?? "unknown"}`);
    const list = json.data?.metaobjects;
    if (!list) throw new Error("Shopify returned no metaobjects data");

    nodes.push(...list.nodes);
    if (!list.pageInfo.hasNextPage) return accountsFromMetaobjects(nodes);
    after = list.pageInfo.endCursor;
  }
  throw new Error(`More than ${MAX_PAGES * 250} trade accounts. Raise MAX_PAGES.`);
}

/**
 * Caches a loader for `ttlMs`. If a refresh fails it keeps serving the last good list
 * (or an empty one if there never was one) and tries again after `retryMs`. Concurrent
 * callers share one refresh.
 */
export function createAccountsLoader(
  fetchAccounts: () => Promise<TradeAccount[]>,
  ttlMs: number,
  retryMs = 10_000,
  now: () => number = Date.now
): () => Promise<TradeAccount[]> {
  let current: { accounts: TradeAccount[]; validUntil: number } | null = null;
  let inflight: Promise<TradeAccount[]> | null = null;

  return function load() {
    if (current && now() < current.validUntil) return Promise.resolve(current.accounts);
    inflight ??= fetchAccounts()
      .then((accounts) => {
        current = { accounts, validUntil: now() + ttlMs };
        return accounts;
      })
      .catch((err: unknown) => {
        console.error("[trade] Could not load trade accounts from Shopify:", err instanceof Error ? err.message : err);
        current = { accounts: current?.accounts ?? [], validUntil: now() + retryMs };
        return current.accounts;
      })
      .finally(() => {
        inflight = null;
      });
    return inflight;
  };
}
