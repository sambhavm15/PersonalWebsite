# Sambhav Mehta — Personal Website

A creative, gallery-forward portfolio built for `sambhavm.com`. Next.js (App
Router) · TypeScript · Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # next lint
```

## Where to edit content and images

- **All copy** lives in [`data/content.ts`](./data/content.ts). Hero, work
  entries, projects, skills, awards, gallery captions — edit them there
  without touching components.
- **Nav / footer links** — same file (`site`, `navLinks`, `socials`).
- **Fonts** — swap in `app/layout.tsx` (currently Fraunces + Inter via
  `next/font/google`).
- **Theme tokens** — palette, type scale, spacing, easings in
  [`tailwind.config.ts`](./tailwind.config.ts).
- **Global styles / reveal animation** — [`app/globals.css`](./app/globals.css).

## Assets you still need to add

Drop these files into `/public/` (create the folders if they don't exist).
Until you do, the site renders tasteful gray placeholders in the correct
aspect ratios, so nothing looks broken.

| Path | Used by | Notes |
| ---- | ------- | ----- |
| `/public/hero.jpg` | Home hero portrait | 4:5 portrait works best. |
| `/public/resume.pdf` | Nav + footer "Résumé ↗" link | Filename must be exactly `resume.pdf`. |
| `/public/gallery/01.jpg` … `/public/gallery/12.jpg` | About-page gallery | Any mix of orientations; the layout is masonry. Filenames must match `01.jpg`–`12.jpg`. |

To add more gallery images, extend `gallery` in `data/content.ts` and drop
matching files into `/public/gallery/`. To add captions, set the `caption`
field on any `GalleryImage`.

Optional Open Graph image: add `/public/og.jpg` and reference it in
`app/layout.tsx`'s `metadata.openGraph.images`.

## Deploy on Vercel

1. Push this branch to GitHub (already tracked as
   `claude/portfolio-website-setup-7ozeh2`) and open a PR into `main`.
2. Sign in at https://vercel.com with your GitHub account and click
   **Add New → Project**.
3. Import this repo. Vercel auto-detects Next.js — leave build settings at
   the defaults (`next build`, output `.next`).
4. Click **Deploy**. The first build takes ~1 minute; you'll get a
   `*.vercel.app` URL to preview.

### Connect the `sambhavm.com` domain

1. In the Vercel project, go to **Settings → Domains**.
2. Add `sambhavm.com` and `www.sambhavm.com`. Vercel picks one as the
   canonical and 308-redirects the other — either choice is fine.
3. In your registrar's DNS panel, add the records Vercel shows you:
   - `A` record on `@` → `76.76.21.21`
   - `CNAME` on `www` → `cname.vercel-dns.com`
   (Always use the exact values Vercel displays for your project.)
4. Wait for DNS propagation (usually minutes, up to a few hours). Vercel
   auto-provisions the TLS certificate — no manual step needed.
5. Set the **Production Branch** under **Settings → Git** to `main` (or
   whichever branch you want auto-deploying to `sambhavm.com`).

### Environment variables

None required — the site is fully static. Add any future env vars in
**Settings → Environment Variables**.

## Theme

- Palette: `#0E0E10` ink, `#F5F1E8` paper, `#FF4D3D` vermilion accent
  (used sparingly), `#8A8578` warm grey for metadata.
- Type: Fraunces (display serif) + Inter (grotesque body).
- Motion: subtle scroll-reveal fade/translate, rotating hero word, card
  hover lift. Fully disabled under `prefers-reduced-motion`.

## Accessibility

- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`), skip
  link, keyboard-navigable nav and gallery lightbox (Esc closes, arrows
  browse), visible focus rings, alt text on every image, respects
  `prefers-reduced-motion`.

## Project structure

```
app/
  layout.tsx         # fonts, metadata, nav + footer shell
  globals.css        # Tailwind layers, reveal + reduced-motion
  page.tsx           # Home
  work/page.tsx      # 01 / Work
  projects/page.tsx  # 02 / Projects & Leadership
  skills/page.tsx    # 03 / Toolkit
  about/page.tsx     # 04 / About + gallery
components/
  Nav.tsx, Footer.tsx, SectionHeader.tsx
  HeroImage.tsx, RotatingWord.tsx, SocialIcons.tsx
  Gallery.tsx        # masonry + keyboard lightbox
  RevealProvider.tsx # IntersectionObserver-based scroll-reveal
data/
  content.ts         # ← edit all copy here
public/
  favicon.svg        # (add hero.jpg, resume.pdf, gallery/*.jpg)
```
