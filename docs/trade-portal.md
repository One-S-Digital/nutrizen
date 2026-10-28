# Trade order portal

Private order page for approved wholesalers and resellers at **`/trade`**. Nothing links to it from the public site: you share the address with the people you approve.

## How people get in

1. They open `/trade` and enter their email.
2. If that email is approved, we email them a sign-in link. (The page says the same thing either way, so it never reveals who is approved.)
3. The link opens a page with one button. Pressing it signs them in for 30 days.

There is no sign-up and no password. The link works once and expires after 15 minutes.

## Approving, changing and removing buyers

The approved list lives in Shopify, as **Trade Account** entries. No code change or redeploy is needed.

**Shopify Admin → Content → Metaobjects → Trade Account**

| Field | What to enter |
|---|---|
| Email | The address they sign in with. |
| Business | Shown in their sign-in email and pre-filled on their order. Optional. |
| Tier | **Wholesaler**, **Reseller** or **Reseller Plus**. Decides which price list they see. They cannot change it. |

- **Approve** someone: *Add entry*, fill the three fields, save. They can sign in within about a minute.
- **Change a tier**: edit the entry. It applies within about a minute.
- **Remove** someone: delete the entry. They lose access within about a minute, even if they are signed in on a phone right now.
- Tell new buyers to go to `https://nutrizen.co.za/trade` and enter the email you added.
- Two entries with the same email: the first one wins and the second is ignored.

If an entry has a bad email or tier it is skipped and Render's logs show `[trade] Shopify trade account "<handle>" has an invalid email or tier and was skipped.` Check the logs if someone says they cannot get in.

### One-time setup: the Trade Account definition

Shopify Admin → **Settings → Custom data → Metaobjects → Add definition**:

1. **Name**: `Trade Account`. Check that the type shown under the name is exactly `trade_account` (use *Edit* beside it if not).
2. Add three fields, all **Single line text**. The *key* of each must be exactly as shown (Shopify builds it from the name):
   - **Email** (key `email`): required.
   - **Business** (key `business`).
   - **Tier** (key `tier`): required. Under *Validation* choose preset choices and add exactly `Wholesaler`, `Reseller`, `Reseller Plus`.
3. Under **Access**, turn **Storefront** access on. Without it the site cannot read the list and nobody can sign in.
4. Save, then add your first entries.

The site reads the list with the same Storefront token it already uses for FAQ and review entries, so no new token or scope is needed.

**Privacy:** with Storefront access on, anyone who holds the Storefront token could read the buyers' emails and tiers (never the prices). The site only uses that token on the server.

**If Shopify is unreachable**, the portal keeps using the last list it loaded and retries every 10 seconds. If it has never loaded a list, nobody can sign in until it can.

## One-time setup: Render environment variables

| Variable | What to put |
|---|---|
| `TRADE_SESSION_SECRET` | A random string of 32+ characters, e.g. from `openssl rand -base64 32`. Changing it signs everyone out. |
| `SMTP_HOST` | `mail.spacemail.com` (your `nutrizen.co.za` email is hosted on Spacemail). |
| `SMTP_PORT` | `465` (the default, so you can leave it out). |
| `SMTP_USER` | The full address of the mailbox that sends the sign-in links and order emails, e.g. `hello@nutrizen.co.za`. |
| `SMTP_PASSWORD` | That mailbox's own password, as set in Spacemail. It is not stored anywhere in the code. |
| `TRADE_PRICES` | The private price list, as one line of JSON. See [Prices](#prices) below. |
| `TRADE_ORDER_EMAIL` | Optional. Where finished orders are emailed. Defaults to `hello@nutrizen.co.za`. |

`SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` are already set for the shop. The sign-in page also uses the same Cloudflare Turnstile keys as the contact form (`TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`).

If the `SMTP_*` settings are missing or wrong in production, nobody can receive a sign-in link and orders fall back to the "Email order" button. Render's logs show `[trade] Email failed: ...` with the reason (for example a 535 error means the user or password is wrong).

Any SMTP mailbox works. To send from a Gmail account instead, use `SMTP_HOST=smtp.gmail.com`, `SMTP_USER` = the Gmail address and `SMTP_PASSWORD` = a Google *app password* (Google account → Security → 2-Step Verification → App passwords), not the normal Gmail password.

Do **not** set `TRADE_ACCOUNTS` on Render. It is ignored whenever the live Shopify list is in use.

## Running it locally

Local development uses mock Shopify mode, so the approved list comes from `TRADE_ACCOUNTS` instead. Put this in `.env.local` (or `.env.development.local`):

```
TRADE_ACCOUNTS=[{"email":"you@example.com","business":"Test Co","tier":"reseller"}]
```

Also put your `TRADE_PRICES` line in that file (see [Prices](#prices)); without it the order page cannot load. `.env*` files are git-ignored, so nothing here reaches GitHub.

`tier` can be `wholesaler`, `reseller` or `resellerplus`. With no `SMTP_*` settings, the sign-in link and any order email are printed in the terminal running `npm run dev` instead of being sent. Copy the link from there.

To try against the real Shopify list locally, run with `SHOPIFY_USE_MOCK=false` and the two Shopify variables set.

## Prices

The trade prices are **not in the code or on GitHub**. They live in the `TRADE_PRICES` setting on Render, as one line of JSON with a row per product:

```
{"adaptogen":{"rrp":0,"wholesaler":0,"reseller":0,"resellerplus":0},"metabol":{ ... }, ...}
```

- Every product needs all four prices (`rrp` is the retail price shown beside the buyer's own price). The product ids are the ones in `src/lib/trade/products.ts`: `adaptogen`, `metabol`, `glutanac`, `cellunex`, `iron`, `magox`, `magcx`, `d3`, `para`, `vitacore`, `zinc`. The names in that file are public; only the numbers are private.
- **Change a price:** Render → your service → Environment → edit `TRADE_PRICES` → Save. Render restarts the site with the new prices.
- If `TRADE_PRICES` is missing or has a typo, the order page shows an error and orders are refused (nothing is priced from a guess). Render's logs say which product and price is wrong, for example `[trade] TRADE_PRICES has no valid "reseller" price for "iron"`.
- Prices are only ever read on the server, and each person only receives their own tier's prices. Every order is re-priced on the server, so prices and totals sent from the browser are ignored.

## Good to know

- Shipping is the flat R110 from the original portal; there is no weight logic.
- Sign-in throttling and "use once" tracking are held in memory. They reset on every deploy, which is fine for a single web service.
- Tests for the sign-in, approved-list, pricing and validation logic: `npm test`.
