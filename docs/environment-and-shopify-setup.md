# Environment variables and Shopify setup

This document describes everything required to run the Nutrizen Next.js storefront against a live Shopify store, including environment variables, Shopify Admin configuration, and metafields used by the app.

---

## 1. Environment variables

Create a `.env.local` file in the project root (do not commit secrets). See `.env.example` for a minimal template.

| Variable | Required | Description |
|----------|----------|-------------|
| `SHOPIFY_STORE_DOMAIN` | Yes, for live API | Your shop’s hostname **only**, e.g. `your-store.myshopify.com`. Do **not** include `https://` or a trailing slash. |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Yes, for live API | The **Storefront API** access token (public, scoped to what you allow in Shopify). Used as `X-Shopify-Storefront-Access-Token` on GraphQL requests. |
| `SHOPIFY_USE_MOCK` | No | Overrides catalog source. See [Mock vs live catalog](#3-mock-vs-live-catalog) below. |

### Automatically set (do not add manually in most cases)

| Variable | Where | Purpose |
|----------|--------|---------|
| `NODE_ENV` | Node / Next.js | `development` when running `next dev`. |
| `VERCEL_ENV` | Vercel | `production`, `preview`, or `development`. Used with mock-mode logic on Vercel. |

### Deployment (Vercel / Render / etc.)

1. Add `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` in the host’s **environment** settings for **production** (and optionally preview if you want preview deployments to hit the real store).
2. If preview builds should use the **live** store, set `SHOPIFY_USE_MOCK=false` on the preview environment and provide the two Shopify variables there as well.

---

## 2. Shopify store setup

### 2.1 Create a Storefront API access token

1. In **Shopify Admin**, open **Settings → Apps and sales channels → Develop apps** (or **Apps → Develop apps**).
2. **Create an app** (or use an existing custom app).
3. Under **Configuration**, open **Storefront API** integration.
4. Enable the scopes your storefront needs. At minimum, typical headless storefronts use scopes such as:
   - **unauthenticated read** access for products, collections, cart (if you add Cart API later), and checkout resources as required by your features.
5. **Install** the app on the store.
6. Copy the **Storefront API access token** and set it as `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.

Keep the token secret in server-side env vars only. It is not a secret in the same way as an Admin API key, but you should still not expose it in client bundles unnecessarily; this project calls Shopify from **server** code (`shopifyFetch` in `src/lib/shopify.ts`).

### 2.2 API version

The app calls the Storefront API at:

`https://<SHOPIFY_STORE_DOMAIN>/api/2024-01/graphql.json`

If you upgrade Shopify’s API version, update the version segment in `src/lib/shopify.ts` and re-test queries.

### 2.3 Headless / sales channels

Ensure products and collections you want on the site are **published** to the **Online Store** or the **Headless** channel your Storefront API token is allowed to read (per Shopify’s channel visibility rules).

### 2.4 Next.js image domains

Remote product images from Shopify CDN are allowed in `next.config.ts` via:

- `cdn.shopify.com`

If you add other image hosts, extend `images.remotePatterns` there.

---

## 3. Mock vs live catalog

Logic lives in `src/lib/shopify-mode.ts`.

| Situation | Default behavior |
|-----------|------------------|
| `next dev` (local) | Uses **mock** catalog (`src/lib/shopify-mock.ts`) so you can develop without credentials. |
| Vercel **Preview** (`VERCEL_ENV=preview`) | Uses **mock** catalog unless overridden. |
| `next start` / production with env vars | Uses **live** Storefront API when `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` are set and mock is not forced. |

### Overrides

| Value | Effect |
|-------|--------|
| `SHOPIFY_USE_MOCK=true` or `1` | Always use mock catalog. |
| `SHOPIFY_USE_MOCK=false` or `0` | Use live Storefront API when credentials exist (useful for local `next dev` or preview with a real store). |

If live mode is selected but credentials are missing or invalid, Storefront requests fail and catalog data may be empty.

---

## 4. Metafields (custom data)

The product query in `src/lib/shopify.ts` reads **product** metafields under namespace **`custom`**. Create these in **Settings → Custom data → Products** (or equivalent) and enable **Storefront API** access for each definition.

| Namespace | Key | Type (recommended) | Used for |
|-----------|-----|-------------------|----------|
| `custom` | `bundle_products` | List of product references | **Bundle & save** section: linked products, pricing, add bundle to cart. |
| `custom` | `frequently_bought_together` | List of product references | **Frequently bought together** section: selectable companions and combined add-to-cart. |

### Storefront visibility

For each metafield definition, turn on **Storefront** access so the Storefront API returns `metafield { references { ... } }`. Without this, the metafield may be `null` and the UI sections stay hidden.

### Referenced products

Each referenced product must be published and have at least one **variant** (the app uses the **first** variant for price and cart line identity).

---

## 4b. Product page — editorial sections (info strip & timeline)

The product template (`/products/[handle]`) can render two blocks below the hero:

1. **Three-column info strip** — Reviews, Ingredients, Directions & usage (each column hides if that content is missing).
2. **“How you’ll feel” timeline** — Stepper + detail card (hidden if no milestones).

All content is loaded from **product metafields** and **metaobject** entries referenced by those metafields. Enable **Storefront API** on every definition below.

### Product metafields (`namespace`: `custom`)

| Key | Type | Purpose |
|-----|------|---------|
| `featured_review_text` | Single line text (or multi-line) | Customer quote for the **Reviews** card. |
| `featured_review_author` | Single line text | Name shown under the quote (required together with quote for the card to show). |
| `featured_review_since` | Single line text | Optional label, e.g. “2023” → displayed as “Customer since {value}”. |
| `directions_summary` | Multi-line text | Short copy in the **Directions & usage** card. |
| `directions_full` | Multi-line text | Long copy revealed with **Read more** (optional; can be used with or without summary). |
| `ingredients_detailed` | **List of metaobject references** | Ordered ingredient “pills” — see metaobject definition below. |
| `timeline_items` | **List of metaobject references** | Journey steps — see metaobject definition below. |

### Metaobject type: ingredient row (for `ingredients_detailed`)

Create a **Metaobject definition** (for example handle `ingredient_row` — the handle must match what you attach in Shopify to the list reference). Add fields:

| Field key | Type |
|-----------|------|
| `ingredient_name` | Single line text (required) — common name on the pill. |
| `botanical_name` | Single line text (optional) — smaller italic line under the name. |

Aliases supported by the storefront parser: `common_name` / `name` for `ingredient_name`, and `botanical` / `scientific_name` for the secondary line.

On the storefront, ingredients render as **stacked cards** with a green dot; the first **three** rows show by default, then a full-width **Show all {n} ingredients** pill toggles the rest (when there are more than three).

### Metaobject type: timeline milestone (for `timeline_items`)

Create a **Metaobject definition** (for example handle `product_milestone`). Add fields:

| Field key | Type | Purpose |
|-----------|------|---------|
| `step_number` | Integer | Sort order / number shown in the circle (1, 2, 3…). |
| `step_label` | Single line text | Short label: “Week 1”, “Month 1”, etc. |
| `card_title` | Single line text | Headline in the detail card. |
| `card_description` | Multi-line text | Body paragraph. |
| `benefits` | Multi-line text | **One benefit per line** — each line becomes a checkmark chip. |
| `usage_tip` | Single line text | Optional “Tip — …” callout in the card footer. |

Aliases: `heading` for `card_title`; `description` / `body` for `card_description`; `tip` for `usage_tip`.

After creating definitions, add entries in **Content → Metaobjects**, then select those entries on each product’s `ingredients_detailed` and `timeline_items` metafields.

### Previewing in mock mode (no Shopify credentials)

When the app uses the **mock catalog** (local `next dev` or Vercel Preview with mock mode), open:

**`/products/vitacore`**

That mock product includes sample **featured review**, **ingredient pills**, **directions** (summary + full text), **timeline** (four steps), plus bundle and frequently-bought-together rows so you can review layout end-to-end.

---

## 5. Quick checklist

- [ ] `SHOPIFY_STORE_DOMAIN` set (domain only, no protocol).
- [ ] `SHOPIFY_STOREFRONT_ACCESS_TOKEN` set from a custom app with Storefront API enabled.
- [ ] Products/collections published to the channel the API can read.
- [ ] Optional: `custom.bundle_products` and `custom.frequently_bought_together` defined with **Storefront** access.
- [ ] Optional: Editorial metafields and metaobjects from [§4b](#4b-product-page--editorial-sections-info-strip--timeline) for the info strip and timeline.
- [ ] Production env vars configured on the hosting provider.
- [ ] Optional: `SHOPIFY_USE_MOCK=false` in development/preview if you want to test against a real store.

---

## 6. Related files

| File | Role |
|------|------|
| `.env.example` | Template for local env vars. |
| `src/lib/shopify.ts` | Storefront GraphQL client, queries, `shopifyFetch`. |
| `src/lib/shopify-mode.ts` | Mock vs live decision. |
| `src/lib/shopify-mock.ts` | Local/preview mock catalog (includes full PDP editorial demo on `vitacore`). |
| `src/lib/shopify-pdp-meta.ts` | Parsers for ingredient and timeline metaobjects. |
| `src/components/product/ProductInfoStrip.tsx` | Reviews / ingredients / directions UI. |
| `src/components/product/WellnessTimelineSection.tsx` | “How you’ll feel” timeline UI. |
| `next.config.ts` | Image remote patterns for Shopify CDN. |

For questions about Storefront API scopes and metafield types, use [Shopify’s Storefront API documentation](https://shopify.dev/docs/api/storefront) and your store’s **Custom data** screens.
