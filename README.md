# Sanskriti Clothing

A boutique storefront + private inventory studio for **Sanskriti Clothing** —
handcrafted kurtas, bandhgalas, sherwanis and more. Ivory-and-gold theme,
story-forward home page, full browsing engine, customer accounts, and an
internal admin dashboard for inventory, orders, and spreadsheet exports.

Next.js (App Router) · TypeScript · Tailwind CSS · Prisma · Postgres.

---

## Quick start

You need a Postgres database (free: [Neon](https://neon.tech) or
[Supabase](https://supabase.com)). Create one, then:

```bash
npm install            # installs deps + generates the Prisma client
cp .env.example .env   # then paste your DB URLs + set the values below
npm run db:push        # create the database tables
npm run db:seed        # load categories, sample products, and your admin login
npm run dev            # http://localhost:3000
```

### Environment variables (`.env`)

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Postgres app connection string (pooled is fine). |
| `DIRECT_URL` | Direct (non-pooled) connection, used for migrations. If you only have one URL, set this to the same value. |
| `AUTH_SECRET` | Long random string for signing login cookies. `openssl rand -base64 32`. |
| `ADMIN_EMAIL` | The email for **your** admin login (the only account that can reach `/admin`). |
| `ADMIN_PASSWORD` | Your admin password. Seeded on `npm run db:seed`. |
| `ADMIN_NAME` | Display name in the studio. |

> After changing `ADMIN_EMAIL`/`ADMIN_PASSWORD`, run `npm run db:seed` again to
> apply them (this rebuilds the sample catalog too).

---

## The two halves of the site

### 1. Consumer storefront (what shoppers see)

- **Home** (`/`) — the story, latest pieces, real customer reviews, category
  and collection entry points, floating WhatsApp + Facebook buttons.
- **Shop** (`/shop`) — the full browsing engine: search bar, category sidebar,
  "Ready to Ship" filter, and sorting. Deep-links like `/shop?category=sherwanis`.
- **Product** (`/product/[slug]`) — gallery, size + quantity selector, add to
  cart, add to wishlist, and an "Ask on WhatsApp" button.
- **Collections** (`/collections/[slug]`) — Love All FW26, Benaras, Pichhwai, etc.
- **Our Story** (`/our-story`), **Contact** (`/contact`), **Celebrity Closet**.
- **Account** — log in / sign up, **Cart**, **Wishlist**, and **Order history**.
- **Checkout** places an order and opens **WhatsApp** pre-filled with the order,
  so customers confirm with you directly (no card processor required).

### 2. Internal studio (just for you — `/admin`)

Protected by your admin login. Visit `/admin/login`.

- **Dashboard** — KPIs (products, units in stock, inventory value, revenue),
  pending-order and out-of-stock alerts, revenue-by-month, stock-by-category,
  best-sellers, and a low-stock restock list.
- **Products** — add / edit / delete kurtas with description, story, fabric,
  colour, care, pricing, per-size stock, images, collection, and flags
  (Featured / New / Draft).
- **Orders** — see every order; changing status to **Confirmed / Shipped /
  Fulfilled** automatically **reduces inventory**, and **Cancelled** restores it.
- **Export** — one-click **CSV** download of full inventory (per size, with
  stock value) or the order log. Opens in Excel / Google Sheets.

**Default seeded logins**

- Admin: the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`.
- Demo customer: `customer@example.com` / `password123`.

---

## Adding product photos

The admin product form has a **drag-and-drop uploader** — drag photos in (or
click to choose), and they're resized and stored automatically. The first image
is the cover. You can also paste an image URL instead (under "Or paste an image
URL"). Until a product has an image, the site shows a tasteful on-brand
placeholder, so nothing ever looks broken.

Uploads use **Vercel Blob**. To enable them:

1. In your Vercel project → **Storage** → **Create Database** → **Blob** → create
   the store and connect it to the project.
2. Vercel automatically adds a `BLOB_READ_WRITE_TOKEN` env var. Redeploy.
3. For local development, copy that token into your `.env`.

Without the token the site still runs — the uploader just shows a message and you
can paste image URLs instead.

---

## Deploying to production (Vercel + Neon)

The app is already Postgres-ready. Full walkthrough:

1. **Create the database.** Sign up at [neon.tech](https://neon.tech) → create a
   project. Copy both connection strings from the dashboard: the **pooled** one
   (has `-pooler` in the host) and the **direct** one.
2. **Set up the tables locally, once.** In your local `.env`, set
   `DATABASE_URL` = pooled string and `DIRECT_URL` = direct string, then run:
   ```bash
   npm run db:push     # creates the tables
   npm run db:seed     # loads categories, sample products, and your admin login
   ```
3. **Import to Vercel.** At [vercel.com](https://vercel.com) → Add New → Project
   → import `sanskriti-clothing`. Vercel auto-detects Next.js.
4. **Add the env vars** in Vercel (Settings → Environment Variables):
   `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
   `ADMIN_NAME` — the same values as your local `.env`.
5. **Deploy.** The build runs `prisma generate && next build` automatically. No
   page touches the database at build time, so the deploy succeeds even before
   the first request.
6. (Optional) Add your custom domain under Settings → Domains.

### Store settings

Brand contact details (WhatsApp number, Facebook URL, email, currency) live in
[`data/site.ts`](./data/site.ts). Categories and collections that drive the
navigation live in [`data/catalog.ts`](./data/catalog.ts).

---

## Scripts

```bash
npm run dev        # dev server
npm run build      # prisma generate + production build
npm run start      # serve the production build
npm run db:push    # sync schema to the database
npm run db:seed    # seed categories, products, admin
npm run db:reset   # wipe + reseed (destructive)
npm run db:studio  # visual database browser
```

## Project structure

```
app/
  page.tsx                 Home (story, reviews, latest, collections)
  shop/                    Browsing engine (search + filters + sort)
  product/[slug]/          Product detail
  collections/[slug]/      Collection pages
  our-story, contact, celebrity-closet
  login, signup            Customer auth
  cart, wishlist, account  Customer area (account/orders too)
  admin/                   Studio: dashboard, products, orders (protected)
  api/                     auth, cart, wishlist, checkout, admin/*
components/                Nav, Footer, ProductCard, AddToCart, admin/*
data/                      site.ts, catalog.ts, reviews.ts
lib/                       prisma, auth, queries, admin-stats
prisma/                    schema.prisma, seed.ts
middleware.ts              Guards /admin and /account
```
