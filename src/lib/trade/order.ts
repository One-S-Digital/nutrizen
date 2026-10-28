// Order maths, validation and email text. Holds no price data, so client components
// may import it. Value imports of sibling files are avoided on purpose so the unit
// tests can load this file directly with `node --test`.

import type { OrderDetails, OrderLine, TradeAccount, TradeProduct, TradeTier } from "./types";

export const SHIPPING = 110;
export const MAX_QTY = 999;
export const PAYMENT_METHODS = ["EFT", "Card", "Other approved method"] as const;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const SHORT_MAX = 200;
const LONG_MAX = 1000;

const TIER_LABEL: Record<TradeTier, string> = {
  wholesaler: "Wholesaler",
  reseller: "Reseller",
  resellerplus: "Reseller +",
};

export const tierLabel = (tier: TradeTier) => TIER_LABEL[tier];
export const isResellerTier = (tier: TradeTier) => tier !== "wholesaler";

/** 1234.5 -> "R1 234,50" (South African format, no reliance on ICU). */
export function money(n: number): string {
  const [whole, cents] = n.toFixed(2).split(".");
  return "R" + whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "," + cents;
}

const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

/** Reads qty_<productId> fields. Fields for unknown products are ignored. */
export function parseQuantities(
  products: TradeProduct[],
  get: (key: string) => string | null
): { qty: Record<string, number>; errors: string[] } {
  const qty: Record<string, number> = {};
  const errors: string[] = [];
  for (const p of products) {
    const raw = (get(`qty_${p.id}`) ?? "").trim();
    if (raw === "") {
      qty[p.id] = 0;
      continue;
    }
    const n = /^\d{1,3}$/.test(raw) ? Number(raw) : NaN;
    if (!(n >= 0 && n <= MAX_QTY)) {
      errors.push(`Quantity for ${p.name} must be a whole number from 0 to ${MAX_QTY}.`);
      qty[p.id] = 0;
      continue;
    }
    qty[p.id] = n;
  }
  return { qty, errors };
}

export function priceOrder(products: TradeProduct[], qty: Record<string, number>) {
  const lines: OrderLine[] = products
    .filter((p) => (qty[p.id] ?? 0) > 0)
    .map((p) => ({
      name: p.name,
      qty: qty[p.id],
      unit: p.price,
      rrp: p.rrp,
      line: p.price * qty[p.id],
    }));
  const subtotal = lines.reduce((s, l) => s + l.line, 0);
  const shipping = lines.length > 0 ? SHIPPING : 0;
  return { lines, subtotal, shipping, total: subtotal + shipping };
}

export function readDetails(get: (key: string) => string | null): OrderDetails {
  const v = (key: string) => (get(key) ?? "").trim();
  return {
    business: v("business"),
    contact: v("contact"),
    email: v("email"),
    phone: v("phone"),
    recipient: v("recipient"),
    recipientPhone: v("recipientPhone"),
    address: v("address"),
    payment: v("payment"),
    notes: v("notes"),
    agreed: get("agree") === "on",
  };
}

export function validateOrder(tier: TradeTier, d: OrderDetails, lineCount: number): string[] {
  const e: string[] = [];
  if (lineCount === 0) e.push("Add at least one product.");
  if (!d.business) e.push("Enter your business name.");
  if (!d.contact) e.push("Enter a contact person.");
  if (!EMAIL_RE.test(d.email)) e.push("Enter a valid email address.");
  if (!d.phone) e.push("Enter a phone number.");
  if (isResellerTier(tier) && !d.recipient) e.push("Enter your customer's name.");
  if (!d.address) e.push("Enter the delivery address.");
  if (!(PAYMENT_METHODS as readonly string[]).includes(d.payment)) e.push("Select a payment method.");
  if (!d.agreed) e.push("Confirm the reseller agreement.");

  const shortFields = [d.business, d.contact, d.email, d.phone, d.recipient, d.recipientPhone, d.payment];
  if (shortFields.some((f) => f.length > SHORT_MAX) || d.address.length > LONG_MAX || d.notes.length > LONG_MAX) {
    e.push("One of the fields is too long. Please shorten it.");
  }
  return e;
}

/** NZ-YYMMDD-XXXX, dated in South African time. */
export function makeReference(now: Date = new Date(), suffix: string = randomSuffix()): string {
  const day = now
    .toLocaleDateString("en-CA", { timeZone: "Africa/Johannesburg" })
    .replace(/-/g, "")
    .slice(2);
  return `NZ-${day}-${suffix}`;
}

function randomSuffix(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function orderSubject(tier: TradeTier, reference: string, business: string): string {
  return oneLine(`Nutrizen ${tierLabel(tier)} order ${reference} - ${business}`);
}

export function formatOrderText(o: {
  reference: string;
  account: TradeAccount;
  details: OrderDetails;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
}): string {
  const { account, details: d } = o;
  const reseller = isResellerTier(account.tier);
  const L: string[] = [];
  L.push(`NUTRIZEN ${tierLabel(account.tier).toUpperCase()} ORDER ${o.reference}`);
  L.push("");
  L.push(`Business: ${oneLine(d.business)}`);
  L.push(`Contact: ${oneLine(d.contact)}`);
  L.push(`Email (use for tracking): ${oneLine(d.email)}`);
  L.push(`Phone: ${oneLine(d.phone)}`);
  L.push("");
  if (reseller) {
    L.push("DELIVER TO CUSTOMER");
    L.push(`Name: ${oneLine(d.recipient)}`);
    if (d.recipientPhone) L.push(`Phone: ${oneLine(d.recipientPhone)}`);
  } else {
    L.push("DELIVER TO");
  }
  L.push(`Address: ${d.address.split(/\r?\n+/).map((s) => s.trim()).filter(Boolean).join(", ")}`);
  L.push("");
  L.push(`ITEMS (${tierLabel(account.tier)} prices)`);
  o.lines.forEach((l) => L.push(`${l.qty} x ${l.name} @ ${money(l.unit)} = ${money(l.line)}`));
  L.push("");
  L.push(`Products: ${money(o.subtotal)}`);
  L.push(`Shipping (under 5kg): ${money(o.shipping)}`);
  L.push(`TOTAL: ${money(o.total)}`);
  L.push("");
  L.push(`Payment method: ${oneLine(d.payment)}`);
  if (d.notes) L.push(`Notes: ${oneLine(d.notes)}`);
  L.push("Reseller agreement confirmed: Yes");
  L.push("");
  L.push(`Signed-in account: ${account.email} (${tierLabel(account.tier)})`);
  return L.join("\n");
}
