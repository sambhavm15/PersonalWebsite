import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ArrowRight } from "@/components/icons";
import { getFeatured, getNewArrivals } from "@/lib/queries";
import { clothingCategories, collections } from "@/data/catalog";
import { reviews } from "@/data/reviews";

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([
    getFeatured(4),
    getNewArrivals(8),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-cream">
        <div className="container-editorial grid items-center gap-10 py-20 md:grid-cols-2 md:py-28">
          <div className="reveal">
            <p className="eyebrow">Est. in a weaving family · Indore, India</p>
            <h1 className="mt-4 font-display text-hero text-ink">
              Heritage weaves,
              <br />
              <span className="gold-text">worn for today.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-charcoal">
              Handcrafted kurtas, bandhgalas and sherwanis, in the finest fabrics
              and the latest silhouettes, to elevate your traditional wardrobe.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">
                Shop the Collection <ArrowRight />
              </Link>
              <Link href="/our-story" className="btn-gold">
                Our Story
              </Link>
            </div>
          </div>

          <div className="reveal relative aspect-[4/5] overflow-hidden rounded-2xl">
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-sand to-cream">
              <span className="font-display text-7xl text-gold-deep/60">S</span>
              <span className="mt-3 text-xs uppercase tracking-luxe text-charcoal/50">
                Sanskriti Clothing
              </span>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-gold/20" />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-sand bg-ivory py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs uppercase tracking-luxe text-gold-deep">
          <span>Handloom Craftsmanship</span>
          <span className="text-gold">✦</span>
          <span>Real Gold Zari</span>
          <span className="text-gold">✦</span>
          <span>Ready to Ship</span>
          <span className="text-gold">✦</span>
          <span>Worldwide Shipping</span>
        </div>
      </div>

      {/* SHOP BY CATEGORY */}
      <section className="container-editorial py-20">
        <div className="reveal mb-10 text-center">
          <p className="eyebrow">Find your piece</p>
          <h2 className="mt-2 font-display text-display text-ink">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {clothingCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className="reveal group flex aspect-[3/4] flex-col items-center justify-end overflow-hidden rounded-xl bg-gradient-to-b from-cream to-sand p-4 text-center card-hover"
            >
              <span className="font-display text-2xl text-gold-deep/50 transition group-hover:scale-110">
                {c.name.split(" ")[0][0]}
              </span>
              <span className="mt-auto text-sm font-medium text-ink">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="bg-ink py-24 text-ivory">
        <div className="container-editorial grid items-center gap-12 md:grid-cols-2">
          <div className="reveal">
            <p className="eyebrow text-gold-soft">Our Story</p>
            <h2 className="mt-3 font-display text-display">
              It began at a loom in Indore.
            </h2>
            <div className="mt-6 space-y-4 text-ivory/75">
              <p>
                I grew up in Indore, where my family ran a textile business and the
                sound of the loom was the rhythm of the house. I learned to weave
                young, and I fell for everything about cloth: the pull of a thread,
                the weight of good fabric, the way a single garment can carry a
                whole heritage.
              </p>
              <p>
                That connection to traditional wear never left me. So I began
                Sanskriti to bring those weaves to the people who love them, made
                the way my family always did: patiently, and by hand.
              </p>
            </div>
            <Link href="/our-story" className="mt-8 inline-flex items-center gap-2 text-gold-soft link-underline">
              Read the full story <ArrowRight />
            </Link>
          </div>
          <div className="reveal grid grid-cols-2 gap-4">
            {["Woven by hand", "Chosen with care", "Made to last", "Worn with pride"].map(
              (t, i) => (
                <div
                  key={t}
                  className="flex aspect-square flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center"
                >
                  <span className="font-display text-3xl text-gold-soft">0{i + 1}</span>
                  <span className="mt-2 text-sm text-ivory/70">{t}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* LATEST PIECES */}
      <section className="container-editorial py-20">
        <div className="reveal mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow">Fresh off the loom</p>
            <h2 className="mt-2 font-display text-display text-ink">Latest Pieces</h2>
          </div>
          <Link href="/shop" className="hidden items-center gap-2 text-gold-deep link-underline sm:inline-flex">
            View all <ArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {(newArrivals.length ? newArrivals : featured).map((p) => (
            <div key={p.id} className="reveal">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-cream py-20">
        <div className="container-editorial">
          <div className="reveal mb-10 text-center">
            <p className="eyebrow">Loved by our customers</p>
            <h2 className="mt-2 font-display text-display text-ink">
              Kind words, real weaves
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((r) => (
              <figure
                key={r.name}
                className="reveal rounded-2xl border border-sand bg-white p-7 shadow-sm"
              >
                <div className="mb-3 flex gap-1 text-gold">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
                <blockquote className="text-charcoal">“{r.text}”</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-medium text-ink">{r.name}</span>
                  <span className="text-stone"> · {r.date}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="container-editorial py-20">
        <div className="reveal mb-10 text-center">
          <p className="eyebrow">Curated edits</p>
          <h2 className="mt-2 font-display text-display text-ink">Explore Collections</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {collections.slice(0, 3).map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="reveal group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-sand to-cream p-6 card-hover"
            >
              <h3 className="font-display text-2xl text-ink">{c.name}</h3>
              <p className="mt-1 text-sm text-charcoal/70">{c.blurb}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-gold-deep">
                Explore <ArrowRight />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
