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
- **Nav links** — same file (`site`, `navLinks`, `socials`).
- **"Currently" strip** — `hero.currentlyItems` in `data/content.ts` (rotates
  every ~2.5s; keep phrasing parallel).
- **Internship case studies** — all three interactive one-pagers (MongoDB, GI
  Partners, Alumni Ventures) live in
  [`data/caseStudies.ts`](./data/caseStudies.ts) as typed data. Edit stats,
  pain points, sprints, KPIs, tradeoffs there — the components render whatever
  you put in.
- **Fonts** — swap in `app/layout.tsx` (currently Fraunces + Inter via
  `next/font/google`).
- **Theme tokens** — palette, type scale, spacing, easings in
  [`tailwind.config.ts`](./tailwind.config.ts).
- **Global styles / reveal animation** — [`app/globals.css`](./app/globals.css).

## Assets you still need to add

Drop these files into `/public/`. Until you do, the site renders tasteful gray
placeholders in the correct aspect ratios, so nothing looks broken.

| Path | Used by | Notes |
| ---- | ------- | ----- |
| `/public/hero.jpg` | Home hero portrait | 4:5 portrait works best. |
| `/public/resume.pdf` | Nav "Résumé ↗" link | Filename must be exactly `resume.pdf`. |
| `/public/gallery/*.jpg` | **Photography** page | Listed in the `gallery` array in `data/content.ts`. |
| `/public/art/*.jpg` | **Art** page | Listed in the `art` array in `data/content.ts`. |

To add **more** images, extend the `gallery` or `art` arrays in
`data/content.ts` and drop matching files into the folder. To add captions,
set the `caption` field on any entry.

Optional Open Graph image: add `/public/og.jpg` and reference it in
`app/layout.tsx`'s `metadata.openGraph.images`.

## Adding photos & art — WITHOUT going through this chat

Images belong in the git repo, not in a chat window. Uploading them to a
conversation doesn't put them on the site and just burns context. The right
flow, all on your Mac:

```bash
cd ~/PersonalWebsite
git checkout claude/portfolio-website-setup-7ozeh2
git pull                          # get the latest code

# add your files (Finder drag-and-drop into these folders also works):
#   public/gallery/01.jpg … 12.jpg   (photography)
#   public/art/01.jpg … 12.jpg       (drawings)
#   public/hero.jpg, public/resume.pdf

npm run dev                       # preview at localhost:3000, tweak as needed

git add public
git commit -m "Add photos, art, hero, and resume"
git push
```

That's it — once deployed on Vercel, every push rebuilds the live site with
your images. No file-size or count limits from the chat, and nothing to
re-upload here. Tips: keep each image roughly < 1–2 MB (Next.js optimizes them
at build), and you can batch-rename in Finder (select all → right-click →
Rename) to get the `01.jpg … 12.jpg` sequence quickly.

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
- Motion: scroll-reveal fade/translate, rotating hero word, rotating
  "Currently" strip, animated stat counters, card hover lift. Fully disabled
  under `prefers-reduced-motion`.

## Accessibility

- Semantic landmarks (`<header>`, `<nav>`, `<main>`), skip link,
  keyboard-navigable nav, case-study accordions/steppers, and gallery lightbox
  (Esc closes, arrows browse), visible focus rings, alt text on every image,
  respects `prefers-reduced-motion`.

## Pages

- **Home** — hero with rotating descriptor + rotating "Currently" strip.
- **Work** — one long scroll: three interactive case studies (MongoDB, GI
  Partners, Alumni Ventures) rebuilt from the one-pagers, plus a compact
  Admit AI entry. Each has animated stat counters, tap-to-expand pain points,
  an interactive sprint stepper, and a Goal-vs-Result KPI panel (GI Partners
  also has an interactive RAG pipeline diagram).
- **Projects** — Diamond Consulting, Blue Origin, awards.
- **Skills** — grouped toolkit grid.
- **Photography** — masonry grid of photos + keyboard lightbox.
- **Art** — drawings and paintings, captioned with title and medium.
- **About** — the story, plus links to Photography and Art.

## Project structure

```
app/
  layout.tsx         # fonts, metadata, nav shell (no footer)
  globals.css        # Tailwind layers, reveal + reduced-motion
  page.tsx           # Home
  work/page.tsx      # 01 / Work — long-scroll case studies
  projects/page.tsx  # 02 / Projects & Leadership
  skills/page.tsx    # 03 / Toolkit
  photography/page.tsx # 04 / Photography
  art/page.tsx       # 05 / Art
  about/page.tsx     # 06 / About
  (/gallery redirects to /photography — see next.config.mjs)
components/
  Nav.tsx, SectionHeader.tsx, HeroImage.tsx
  RotatingWord.tsx, CurrentlyStrip.tsx, SocialIcons.tsx
  Gallery.tsx                    # masonry grid + keyboard lightbox
  RevealProvider.tsx             # IntersectionObserver scroll-reveal
  case-study/
    CaseStudy.tsx    # composes the interactive one-pager sections
    useCountUp.ts    # animated, reduced-motion-aware counters
data/
  content.ts         # ← edit site copy, nav, gallery/art lists here
  caseStudies.ts     # ← edit the three internship case studies here
public/
  favicon.svg        # (add hero.jpg, resume.pdf, gallery/*, art/*)
```
