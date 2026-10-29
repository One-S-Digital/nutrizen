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
/** True when the order ships to the reseller's customer rather than to the buyer. */
export const shipsToCustomer = (tier: TradeTier, d: Pick<OrderDetails, "deliverTo">) =>
  isResellerTier(tier) && d.deliverTo === "customer";

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
    deliverTo: get("deliverTo") === "self" ? "self" : "customer",
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
  if (shipsToCustomer(tier, d) && !d.recipient) e.push("Enter your customer's name.");
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
  const toCustomer = shipsToCustomer(account.tier, d);
  const L: string[] = [];
  L.push(`NUTRIZEN ${tierLabel(account.tier).toUpperCase()} ORDER ${o.reference}`);
  L.push("");
  L.push(`Business: ${oneLine(d.business)}`);
  L.push(`Contact: ${oneLine(d.contact)}`);
  L.push(`Email (use for tracking): ${oneLine(d.email)}`);
  L.push(`Phone: ${oneLine(d.phone)}`);
  L.push("");
  if (toCustomer) {
    L.push("DELIVER TO CUSTOMER");
    L.push(`Name: ${oneLine(d.recipient)}`);
    if (d.recipientPhone) L.push(`Phone: ${oneLine(d.recipientPhone)}`);
  } else {
    L.push(isResellerTier(account.tier) ? "DELIVER TO RESELLER (own address)" : "DELIVER TO");
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

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const escBr = (s: string) =>
  s.split(/\r?\n+/).map((x) => esc(x.trim())).filter(Boolean).join("<br>");

/** Styled HTML version of the order email (the plain-text one stays as the fallback). */
export function formatOrderHtml(o: Parameters<typeof formatOrderText>[0]): string {
  const { account, details: d } = o;
  const toCustomer = shipsToCustomer(account.tier, d);
  const FONT = "font-family:Helvetica,Arial,sans-serif;";
  const row = (label: string, value: string) =>
    `<tr><td style="${FONT}font-size:13px;color:#6b756f;padding:4px 12px 4px 0;vertical-align:top;white-space:nowrap;">${label}</td>` +
    `<td style="${FONT}font-size:14px;color:#1f2a24;padding:4px 0;vertical-align:top;">${value}</td></tr>`;
  const heading = (t: string) =>
    `<tr><td style="${FONT}font-size:12px;font-weight:bold;letter-spacing:1px;color:#4f6f3f;text-transform:uppercase;padding:24px 0 8px;border-bottom:1px solid #e4e0d6;">${t}</td></tr>`;
  const block = (rows: string) =>
    `<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>`;

  const cell = (v: string, align = "left", bold = false) =>
    `<td align="${align}" style="${FONT}font-size:14px;color:#1f2a24;padding:8px 0;border-bottom:1px solid #eeeae0;${bold ? "font-weight:bold;" : ""}">${v}</td>`;
  const items = o.lines
    .map((l) => `<tr>${cell(`${l.qty} &times;`)}${cell(esc(l.name))}${cell(money(l.unit), "right")}${cell(money(l.line), "right", true)}</tr>`)
    .join("");
  const total = (label: string, value: string, strong = false) =>
    `<tr><td colspan="3" align="right" style="${FONT}font-size:${strong ? 16 : 14}px;${strong ? "font-weight:bold;" : ""}padding:6px 12px 0 0;color:#1f2a24;">${label}</td>` +
    `<td align="right" style="${FONT}font-size:${strong ? 16 : 14}px;${strong ? "font-weight:bold;" : ""}padding:6px 0 0;color:#1f2a24;">${value}</td></tr>`;

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4f1ea;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:32px;">
        <tr><td style="${FONT}font-size:12px;font-weight:bold;letter-spacing:1px;color:#4f6f3f;text-transform:uppercase;">NutriZen ${esc(tierLabel(account.tier))} order</td></tr>
        <tr><td style="${FONT}font-size:24px;font-weight:bold;color:#1f2a24;padding:4px 0 4px;">${esc(o.reference)}</td></tr>
        <tr><td style="${FONT}font-size:14px;color:#6b756f;padding-bottom:8px;">${esc(oneLine(d.business))}</td></tr>
        ${heading("Customer")}
        ${block(
          row("Business", esc(oneLine(d.business))) +
            row("Contact", esc(oneLine(d.contact))) +
            row("Email", `${esc(oneLine(d.email))} <span style="color:#6b756f;">(use for tracking)</span>`) +
            row("Phone", esc(oneLine(d.phone)))
        )}
        ${heading(toCustomer ? "Deliver to customer" : isResellerTier(account.tier) ? "Deliver to reseller (own address)" : "Deliver to")}
        ${block(
          (toCustomer ? row("Name", esc(oneLine(d.recipient))) : "") +
            (toCustomer && d.recipientPhone ? row("Phone", esc(oneLine(d.recipientPhone))) : "") +
            row("Address", escBr(d.address))
        )}
        ${heading(`Items (${esc(tierLabel(account.tier))} prices)`)}
        ${block(items + total("Products", money(o.subtotal)) + total("Shipping (under 5kg)", money(o.shipping)) + total("Total", money(o.total), true))}
        ${heading("Payment")}
        ${block(
          row("Method", esc(oneLine(d.payment))) +
            (d.notes ? row("Notes", escBr(d.notes)) : "") +
            row("Agreement", "Reseller agreement confirmed")
        )}
        <tr><td style="${FONT}font-size:12px;color:#8a938d;padding-top:24px;">Signed-in account: ${esc(account.email)} (${esc(tierLabel(account.tier))})</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
