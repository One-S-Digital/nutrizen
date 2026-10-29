// Run with: npm test   (Node's built-in test runner; Node 24 loads the .ts files directly)
import test from "node:test";
import assert from "node:assert/strict";
import { SignJWT } from "jose";
import {
  accountsFromMetaobjects,
  createAccountsLoader,
  fetchShopifyTradeAccounts,
  normalizeTier,
  parseAccounts,
} from "./accounts.ts";
import { signToken, verifyToken } from "./tokens.ts";
import { allow, consumeOnce } from "./guards.ts";
import { signInEmail } from "./signin-email.ts";
import { productsForTier } from "./products.ts";
import {
  MAX_QTY,
  SHIPPING,
  formatOrderHtml,
  formatOrderText,
  makeReference,
  money,
  parseQuantities,
  priceOrder,
  readDetails,
  validateOrder,
} from "./order.ts";

const SECRET = "test-secret-test-secret-test-secret-123456";

// ---------------------------------------------------------------- accounts
test("parseAccounts keeps valid entries and lowercases emails", () => {
  const out = parseAccounts(
    JSON.stringify([
      { email: " Jane@Shop.CO.za ", business: "Jane's Health", tier: "reseller" },
      { email: "bulk@store.co.za", tier: "wholesaler" },
    ])
  );
  assert.deepEqual(out, [
    { email: "jane@shop.co.za", business: "Jane's Health", tier: "reseller" },
    { email: "bulk@store.co.za", business: "", tier: "wholesaler" },
  ]);
});

test("parseAccounts fails closed on bad input", () => {
  assert.deepEqual(parseAccounts(undefined), []);
  assert.deepEqual(parseAccounts(""), []);
  assert.deepEqual(parseAccounts("not json"), []);
  assert.deepEqual(parseAccounts('{"email":"a@b.co","tier":"reseller"}'), []);
});

test("parseAccounts skips unknown tiers, bad emails and duplicates", () => {
  const out = parseAccounts(
    JSON.stringify([
      { email: "a@b.co", tier: "vip" },
      { email: "nope", tier: "reseller" },
      { email: "ok@b.co", tier: "resellerplus" },
      { email: "OK@b.co", tier: "wholesaler" },
      null,
    ])
  );
  assert.deepEqual(out, [{ email: "ok@b.co", business: "", tier: "resellerplus" }]);
});

// ---------------------------------------------------- shopify trade accounts
test("normalizeTier accepts the Shopify dropdown labels and the plain ids", () => {
  assert.equal(normalizeTier("Wholesaler"), "wholesaler");
  assert.equal(normalizeTier("Reseller"), "reseller");
  assert.equal(normalizeTier("Reseller Plus"), "resellerplus");
  assert.equal(normalizeTier("Reseller +"), "resellerplus"); // must never be read as plain "reseller"
  assert.equal(normalizeTier("resellerplus"), "resellerplus");
  assert.equal(normalizeTier("  RESELLER "), "reseller");
  assert.equal(normalizeTier("vip"), null);
  assert.equal(normalizeTier(""), null);
  assert.equal(normalizeTier(undefined), null);
});

const entry = (handle, fields) => ({ handle, fields: Object.entries(fields).map(([key, value]) => ({ key, value })) });

test("accountsFromMetaobjects maps entries and skips bad ones", () => {
  const out = accountsFromMetaobjects([
    entry("jane", { email: " Jane@Shop.co.za ", business: " Jane's Health ", tier: "Reseller Plus" }),
    entry("no-tier", { email: "a@b.co", business: "x", tier: null }),
    entry("bad-email", { email: "nope", tier: "Reseller" }),
    entry("dupe", { email: "JANE@shop.co.za", tier: "Wholesaler" }),
    entry("bulk", { email: "bulk@store.co.za", tier: "Wholesaler" }),
  ]);
  assert.deepEqual(out, [
    { email: "jane@shop.co.za", business: "Jane's Health", tier: "resellerplus" },
    { email: "bulk@store.co.za", business: "", tier: "wholesaler" },
  ]);
});

// Stub for fetch(): each call returns the next prepared reply.
function stubFetch(replies) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    const r = replies.shift();
    if (r instanceof Error) throw r;
    return new Response(JSON.stringify(r.json ?? {}), { status: r.status ?? 200 });
  };
  return { fn, calls };
}
const page = (nodes, next = null) => ({
  json: { data: { metaobjects: { nodes, pageInfo: { hasNextPage: next !== null, endCursor: next } } } },
});

test("fetchShopifyTradeAccounts calls the Storefront API with the token and maps the result", async () => {
  const { fn, calls } = stubFetch([page([entry("jane", { email: "jane@shop.co.za", business: "Jane", tier: "Reseller" })])]);
  const out = await fetchShopifyTradeAccounts({ domain: "https://nutrizen.myshopify.com/", token: "tok-123", fetchImpl: fn });
  assert.deepEqual(out, [{ email: "jane@shop.co.za", business: "Jane", tier: "reseller" }]);
  assert.equal(calls[0].url, "https://nutrizen.myshopify.com/api/2026-01/graphql.json");
  assert.equal(calls[0].init.headers["X-Shopify-Storefront-Access-Token"], "tok-123");
  assert.match(calls[0].body.query, /type: "trade_account"/);
});

test("fetchShopifyTradeAccounts follows pagination", async () => {
  const { fn, calls } = stubFetch([
    page([entry("a", { email: "a@b.co", tier: "Reseller" })], "cursor-1"),
    page([entry("b", { email: "b@b.co", tier: "Wholesaler" })]),
  ]);
  const out = await fetchShopifyTradeAccounts({ domain: "s.myshopify.com", token: "t", fetchImpl: fn });
  assert.deepEqual(out.map((a) => a.email), ["a@b.co", "b@b.co"]);
  assert.equal(calls[0].body.variables.after, null);
  assert.equal(calls[1].body.variables.after, "cursor-1");
});

test("an empty list from Shopify is a valid answer: nobody approved", async () => {
  const { fn } = stubFetch([page([])]);
  assert.deepEqual(await fetchShopifyTradeAccounts({ domain: "s.myshopify.com", token: "t", fetchImpl: fn }), []);
});

test("fetchShopifyTradeAccounts throws on every kind of failure, never returning an empty list", async () => {
  const run = (reply) =>
    fetchShopifyTradeAccounts({ domain: "s.myshopify.com", token: "t", fetchImpl: stubFetch([reply]).fn });
  await assert.rejects(run({ status: 500 }), /HTTP 500/);
  await assert.rejects(run({ status: 401 }), /HTTP 401/);
  await assert.rejects(run({ json: { errors: [{ message: "Access denied for metaobjects field." }] } }), /Access denied/);
  await assert.rejects(run({ json: { data: {} } }), /no metaobjects data/);
  await assert.rejects(run(new Error("socket hang up")), /socket hang up/);
});

test("fetchShopifyTradeAccounts refuses an endless list instead of truncating it", async () => {
  const replies = Array.from({ length: 20 }, () => page([], "more"));
  await assert.rejects(
    fetchShopifyTradeAccounts({ domain: "s.myshopify.com", token: "t", fetchImpl: stubFetch(replies).fn }),
    /More than/
  );
});

const jane = { email: "jane@shop.co.za", business: "Jane", tier: "reseller" };

test("the accounts loader caches for the TTL, then refreshes", async () => {
  let now = 0;
  let fetches = 0;
  const load = createAccountsLoader(async () => (fetches++, [jane]), 60_000, 10_000, () => now);
  await load();
  now = 59_000;
  await load();
  assert.equal(fetches, 1);
  now = 60_001;
  await load();
  assert.equal(fetches, 2);
});

test("removing an account takes effect on the next refresh", async () => {
  let now = 0;
  let list = [jane];
  const load = createAccountsLoader(async () => list, 60_000, 10_000, () => now);
  assert.equal((await load()).length, 1);
  list = [];
  now = 61_000;
  assert.equal((await load()).length, 0);
});

test("when a refresh fails the loader keeps the last good list and retries soon", async () => {
  let now = 0;
  let fail = false;
  let fetches = 0;
  const load = createAccountsLoader(
    async () => {
      fetches++;
      if (fail) throw new Error("shopify down");
      return [jane];
    },
    60_000,
    10_000,
    () => now
  );
  await load();
  fail = true;
  now = 61_000;
  assert.deepEqual(await load(), [jane]); // stale but still the last good list
  assert.equal(fetches, 2);
  now = 65_000;
  await load();
  assert.equal(fetches, 2); // backing off: not hammering Shopify
  now = 71_500;
  fail = false;
  await load();
  assert.equal(fetches, 3); // retried after the back-off
});

test("with no good list yet, a failed load means nobody is approved", async () => {
  const load = createAccountsLoader(async () => { throw new Error("shopify down"); }, 60_000, 10_000, () => 0);
  assert.deepEqual(await load(), []);
});

test("simultaneous callers share one refresh", async () => {
  let fetches = 0;
  const load = createAccountsLoader(async () => (fetches++, [jane]), 60_000, 10_000, () => 0);
  await Promise.all([load(), load(), load()]);
  assert.equal(fetches, 1);
});

// ------------------------------------------------------------------ tokens
test("a signed token verifies and carries the email and id", async () => {
  const token = await signToken({ use: "magic", email: "a@b.co", expiresIn: "15m", secret: SECRET, jti: "id-1" });
  const claims = await verifyToken(token, "magic", SECRET);
  assert.equal(claims?.email, "a@b.co");
  assert.equal(claims?.jti, "id-1");
});

test("a token is rejected with the wrong secret, wrong use, or tampering", async () => {
  const token = await signToken({ use: "magic", email: "a@b.co", expiresIn: "15m", secret: SECRET });
  assert.equal(await verifyToken(token, "magic", SECRET + "x"), null);
  assert.equal(await verifyToken(token, "session", SECRET), null); // a sign-in link is not a session
  const tampered = token.slice(0, -2) + (token.endsWith("AA") ? "BB" : "AA");
  assert.equal(await verifyToken(tampered, "magic", SECRET), null);
  assert.equal(await verifyToken("garbage", "magic", SECRET), null);
});

test("an expired token is rejected", async () => {
  const expired = await new SignJWT({ use: "session" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("a@b.co")
    .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
    .sign(new TextEncoder().encode(SECRET));
  assert.equal(await verifyToken(expired, "session", SECRET), null);
});

test("an unsigned (alg none) token is rejected", async () => {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "none" })}.${b64({ use: "session", sub: "a@b.co", exp: 9999999999 })}.`;
  assert.equal(await verifyToken(unsigned, "session", SECRET), null);
});

// ------------------------------------------------------------------ guards
test("allow() permits `limit` calls per window, then blocks, then resets", () => {
  const t0 = 1_000_000;
  assert.equal(allow("k1", 2, 1000, t0), true);
  assert.equal(allow("k1", 2, 1000, t0 + 1), true);
  assert.equal(allow("k1", 2, 1000, t0 + 2), false);
  assert.equal(allow("k1", 2, 1000, t0 + 1001), true);
  assert.equal(allow("k2", 2, 1000, t0), true); // other keys are independent
});

test("consumeOnce() allows an id once until it expires", () => {
  const t0 = 2_000_000;
  assert.equal(consumeOnce("link-a", t0 + 500, t0), true);
  assert.equal(consumeOnce("link-a", t0 + 500, t0 + 100), false);
  assert.equal(consumeOnce("link-a", t0 + 5000, t0 + 600), true);
});

// ---------------------------------------------------------------- products
// The real price list is not in the repository: it comes from the TRADE_PRICES setting.
// These are made-up numbers, one distinct row (metabol) so line totals can be told apart.
const PRODUCT_IDS = ["adaptogen", "metabol", "glutanac", "cellunex", "iron", "magox", "magcx", "d3", "para", "vitacore", "zinc"];
const TEST_PRICES = Object.fromEntries(
  PRODUCT_IDS.map((id) => [
    id,
    id === "metabol"
      ? { rrp: 150, wholesaler: 100, reseller: 125, resellerplus: 110 }
      : { rrp: 300, wholesaler: 200, reseller: 250, resellerplus: 220 },
  ])
);
process.env.TRADE_PRICES = JSON.stringify(TEST_PRICES);

test("price list fails closed when TRADE_PRICES is missing, broken or incomplete", () => {
  const good = process.env.TRADE_PRICES;
  const withPrices = (value) => {
    if (value === undefined) delete process.env.TRADE_PRICES;
    else process.env.TRADE_PRICES = value;
    return () => productsForTier("wholesaler");
  };
  try {
    assert.throws(withPrices(undefined), /TRADE_PRICES is not set/);
    assert.throws(withPrices("{not json"), /not valid JSON/);
    assert.throws(withPrices("[]"), /no valid "rrp" price for "adaptogen"/);
    const missingTier = { ...TEST_PRICES, zinc: { rrp: 300, wholesaler: 200, reseller: 250 } };
    assert.throws(withPrices(JSON.stringify(missingTier)), /no valid "resellerplus" price for "zinc"/);
    const zero = { ...TEST_PRICES, iron: { ...TEST_PRICES.iron, reseller: 0 } };
    assert.throws(withPrices(JSON.stringify(zero)), /no valid "reseller" price for "iron"/);
    const text = { ...TEST_PRICES, d3: { ...TEST_PRICES.d3, rrp: "300" } };
    assert.throws(withPrices(JSON.stringify(text)), /no valid "rrp" price for "d3"/);
    assert.equal(withPrices(good)().length, 11); // recovers as soon as it is fixed
  } finally {
    process.env.TRADE_PRICES = good;
  }
});

test("price list: 11 products, one price each, and the tiers stay in order", () => {
  for (const tier of ["wholesaler", "reseller", "resellerplus"]) {
    const list = productsForTier(tier);
    assert.equal(list.length, 11);
    for (const p of list) assert.deepEqual(Object.keys(p).sort(), ["id", "name", "price", "rrp"]);
  }
  const w = productsForTier("wholesaler");
  const r = productsForTier("reseller");
  const plus = productsForTier("resellerplus");
  w.forEach((p, i) => {
    assert.ok(p.price < plus[i].price && plus[i].price < r[i].price && r[i].price < p.rrp, p.id);
  });
});

// ------------------------------------------------------------------- order
test("money() uses South African formatting", () => {
  assert.equal(money(280), "R280,00");
  assert.equal(money(1234.5), "R1 234,50");
  assert.equal(money(1234567), "R1 234 567,00");
});

test("parseQuantities accepts whole numbers 0..999 and reports bad ones", () => {
  const products = productsForTier("reseller");
  const fields = { qty_adaptogen: "3", qty_metabol: "", qty_glutanac: "-1", qty_cellunex: "1000", qty_iron: "1.5", qty_magox: "abc", qty_zinc: String(MAX_QTY), qty_ghost: "50" };
  const { qty, errors } = parseQuantities(products, (k) => fields[k] ?? null);
  assert.equal(qty.adaptogen, 3);
  assert.equal(qty.metabol, 0);
  assert.equal(qty.zinc, MAX_QTY);
  assert.equal(errors.length, 4);
  assert.equal("ghost" in qty, false); // unknown products are ignored
});

test("priceOrder uses the server's price, adds shipping only when there are items", () => {
  const products = productsForTier("wholesaler");
  const empty = priceOrder(products, {});
  assert.deepEqual([empty.subtotal, empty.shipping, empty.total, empty.lines.length], [0, 0, 0, 0]);

  const order = priceOrder(products, { adaptogen: 2, metabol: 1 }); // 2 x 200 + 1 x 100
  assert.equal(order.subtotal, 500);
  assert.equal(order.shipping, SHIPPING);
  assert.equal(order.total, 500 + SHIPPING);
  assert.deepEqual(order.lines.map((l) => l.unit), [200, 100]);
});

const goodForm = {
  business: "Jane's Health", contact: "Jane", email: "jane@shop.co.za", phone: "0820000000",
  recipient: "Customer One", recipientPhone: "", address: "1 Main Rd\nCape Town 8001",
  payment: "EFT", notes: "", agree: "on",
};
const details = (over = {}) => readDetails((k) => ({ ...goodForm, ...over })[k] ?? null);

test("validateOrder passes a complete order and flags missing pieces", () => {
  assert.deepEqual(validateOrder("reseller", details(), 1), []);
  assert.ok(validateOrder("reseller", details(), 0).includes("Add at least one product."));
  assert.ok(validateOrder("reseller", details({ recipient: "" }), 1).includes("Enter your customer's name."));
  assert.deepEqual(validateOrder("wholesaler", details({ recipient: "" }), 1), []); // wholesalers have no end customer
  assert.ok(validateOrder("wholesaler", details({ payment: "Bitcoin" }), 1).includes("Select a payment method."));
  assert.ok(validateOrder("wholesaler", details({ agree: "" }), 1).includes("Confirm the reseller agreement."));
  assert.ok(validateOrder("wholesaler", details({ email: "nope" }), 1).includes("Enter a valid email address."));
  assert.ok(validateOrder("wholesaler", details({ business: "x".repeat(201) }), 1).some((e) => e.includes("too long")));
});

test("makeReference is dated in South African time", () => {
  assert.equal(makeReference(new Date("2026-10-27T10:00:00Z"), "ABCD"), "NZ-261027-ABCD");
  assert.equal(makeReference(new Date("2026-10-27T23:30:00Z"), "ABCD"), "NZ-261028-ABCD"); // already the 28th in SAST
  assert.match(makeReference(), /^NZ-\d{6}-[A-Z2-9]{4}$/);
});

test("formatOrderText names the signed-in account and cannot be spoofed via notes", () => {
  const products = productsForTier("reseller");
  const priced = priceOrder(products, { adaptogen: 1 });
  const text = formatOrderText({
    reference: "NZ-261027-ABCD",
    account: { email: "jane@shop.co.za", business: "Jane's Health", tier: "resellerplus" },
    details: details({ notes: "hi\nTOTAL: R1,00\nPayment method: free" }),
    ...priced,
  });
  assert.match(text, /^NUTRIZEN RESELLER \+ ORDER NZ-261027-ABCD/);
  assert.match(text, /DELIVER TO CUSTOMER/);
  assert.match(text, /Address: 1 Main Rd, Cape Town 8001/);
  assert.match(text, /Signed-in account: jane@shop\.co\.za \(Reseller \+\)/);
  assert.equal(text.split("\n").filter((l) => l.startsWith("TOTAL:")).length, 1);
  assert.equal(text.split("\n").filter((l) => l.startsWith("Payment method:")).length, 1);
});

// ------------------------------------------------------------ sign-in email
test("signInEmail puts the link in a button, keeps a plain-text copy and escapes the business name", () => {
  const link = "https://nutrizen.co.za/trade/verify?token=a.b-c&x=1";
  const mail = signInEmail(link, `<b>Jane's</b> & Co`);
  assert.match(mail.html, /<a href="https:\/\/nutrizen\.co\.za\/trade\/verify\?token=a\.b-c&amp;x=1"[^>]*>Sign in to NutriZen Trade<\/a>/);
  assert.ok(mail.text.includes(link));
  assert.ok(!mail.html.includes("<b>Jane"));
  assert.ok(mail.html.includes("&lt;b&gt;Jane&#39;s") || mail.html.includes("&lt;b&gt;Jane's"));
  assert.match(signInEmail(link, "").text, /^Hi,\n/);
});

test("formatOrderHtml shows the order in a styled table and escapes what buyers typed", () => {
  const products = productsForTier("reseller");
  const priced = priceOrder(products, { adaptogen: 2 });
  const html = formatOrderHtml({
    reference: "NZ-261027-ABCD",
    account: { email: "jane@shop.co.za", business: "Jane's Health", tier: "reseller" },
    details: details({ business: "<script>x</script> & Co", notes: "line one\nline two" }),
    ...priced,
  });
  assert.match(html, /NZ-261027-ABCD/);
  assert.match(html, /2 &times;/);
  assert.ok(html.includes(money(priced.total)));
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&lt;script&gt;x&lt;/script&gt; &amp; Co"));
  assert.ok(html.includes("line one<br>line two"));
  assert.ok(html.includes("Deliver to customer"));
});

test("resellers can ship to themselves: no customer name needed, and the emails say so", () => {
  const toSelf = readDetails((k) => ({ ...goodForm, recipient: "", deliverTo: "self" })[k] ?? null);
  assert.equal(toSelf.deliverTo, "self");
  assert.deepEqual(validateOrder("reseller", toSelf, 1), []);
  assert.deepEqual(validateOrder("resellerplus", toSelf, 1), []);
  // default stays "customer", which still needs a name
  assert.equal(details().deliverTo, "customer");
  assert.ok(validateOrder("reseller", details({ recipient: "" }), 1).includes("Enter your customer's name."));

  const priced = priceOrder(productsForTier("reseller"), { adaptogen: 1 });
  const order = { reference: "NZ-261027-ABCD", account: { email: "jane@shop.co.za", business: "J", tier: "reseller" }, ...priced };
  const selfText = formatOrderText({ ...order, details: toSelf });
  assert.match(selfText, /DELIVER TO RESELLER \(own address\)/);
  assert.ok(!selfText.includes("DELIVER TO CUSTOMER"));
  assert.ok(formatOrderHtml({ ...order, details: toSelf }).includes("Deliver to reseller (own address)"));
  // wholesalers are unchanged
  assert.match(formatOrderText({ ...order, account: { ...order.account, tier: "wholesaler" }, details: toSelf }), /\nDELIVER TO\n/);
});
