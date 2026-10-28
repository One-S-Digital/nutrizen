// The trade price list is CONFIDENTIAL and is deliberately NOT stored in this repository.
// It is read from the TRADE_PRICES environment variable (JSON, set on the server only):
//   {"<product id>": {"rrp": 0, "wholesaler": 0, "reseller": 0, "resellerplus": 0}, ...}
// Import this only from server code (pages, server actions). A client component must
// never import it: the browser may only receive the signed-in tier's prices, via productsForTier().

import type { TradeProduct, TradeTier } from "./types";

const CATALOGUE = [
  { id: "adaptogen", name: "Adaptogen Complex 60 Capsules" },
  { id: "metabol", name: "Metabol 60 caps" },
  { id: "glutanac", name: "Glutanac 60 caps" },
  { id: "cellunex", name: "Cellunex 60 caps" },
  { id: "iron", name: "Iron Supplement 60 caps" },
  { id: "magox", name: "Mag Oxide 60 capsules" },
  { id: "magcx", name: "Mag Complex 60 caps" },
  { id: "d3", name: "Vitamin D3 4000iu 60 caps" },
  { id: "para", name: "Para Cleanse 60 caps" },
  { id: "vitacore", name: "VitaCore B complex 60 caps" },
  { id: "zinc", name: "Zinc & copper 60 capsules" },
] as const;

const PRICE_KEYS = ["rrp", "wholesaler", "reseller", "resellerplus"] as const;
type PriceRow = Record<(typeof PRICE_KEYS)[number], number>;

let cache: { raw: string; prices: Record<string, PriceRow> } | undefined;

// Throws (so nothing is ever priced from a guess) when the setting is missing or incomplete.
function loadPrices(): Record<string, PriceRow> {
  const raw = process.env.TRADE_PRICES?.trim();
  if (!raw) throw new Error("[trade] TRADE_PRICES is not set. See docs/trade-portal.md.");
  if (cache?.raw === raw) return cache.prices;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("[trade] TRADE_PRICES is not valid JSON. See docs/trade-portal.md.");
  }
  const table = (parsed && typeof parsed === "object" ? parsed : {}) as Record<string, Record<string, unknown>>;

  const prices: Record<string, PriceRow> = {};
  for (const { id } of CATALOGUE) {
    const row = table[id];
    const bad = PRICE_KEYS.find((k) => {
      const n = row?.[k];
      return typeof n !== "number" || !Number.isFinite(n) || n <= 0;
    });
    if (bad) throw new Error(`[trade] TRADE_PRICES has no valid "${bad}" price for "${id}". See docs/trade-portal.md.`);
    prices[id] = Object.fromEntries(PRICE_KEYS.map((k) => [k, row[k]])) as PriceRow;
  }
  cache = { raw, prices };
  return prices;
}

export function productsForTier(tier: TradeTier): TradeProduct[] {
  const prices = loadPrices();
  return CATALOGUE.map((p) => ({ id: p.id, name: p.name, rrp: prices[p.id].rrp, price: prices[p.id][tier] }));
}
