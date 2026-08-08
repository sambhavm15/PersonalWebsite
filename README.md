# Sanskriti Clothing

A boutique storefront + private inventory studio for **Sanskriti Clothing** —
handcrafted kurtas, bandhgalas, sherwanis and more. Ivory-and-gold theme,
story-forward home page, full browsing engine, customer accounts, and an
internal admin dashboard for inventory, orders, and spreadsheet exports.

Next.js (App Router) · TypeScript · Tailwind CSS · Prisma · SQLite (dev) /
Postgres (prod).

---

## Quick start

```bash
npm install            # installs deps + generates the Prisma client
cp .env.example .env   # then edit the values (see below)
npm run db:push        # create the database tables
npm run db:seed        # load categories, sample products, and your admin login
npm run dev            # http://localhost:3000
```

### Environment variables (`.env`)

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | `file:./dev.db` for local SQLite. For production, a Postgres URL. |
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

## Adding real product photos

Each product takes a list of **image URLs** in the admin form (first image is the
cover). Paste links from your Facebook page, a CDN, or any public host. Until a
product has an image, the site shows a tasteful on-brand placeholder, so nothing
ever looks broken.

> For a fully managed image-upload experience in production, wire the admin
> "Add image URL" field to a blob store (Vercel Blob / Cloudinary / S3). The
> data model already stores images as URLs, so no schema change is needed.

---

## Deploying to production (Vercel + Postgres)

SQLite is perfect for local development but does not persist on serverless
hosts. For production:

1. Create a free Postgres database (Supabase or Neon).
2. In `prisma/schema.prisma`, change the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Set the Vercel env vars: `DATABASE_URL` (the Postgres URL), `AUTH_SECRET`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`.
4. Run once against the prod DB: `npx prisma db push` then `npm run db:seed`
   (or seed manually).
5. Deploy. The build runs `prisma generate && next build` automatically.

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
