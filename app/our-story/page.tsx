import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export const metadata = {
  title: "Our Story · Sanskriti Clothing",
  description:
    "From a textile family in Indore to a brand built on heritage weaves.",
};

export default function OurStoryPage() {
  return (
    <div>
      <section className="bg-cream py-20">
        <div className="container-editorial max-w-3xl text-center">
          <p className="eyebrow">Our Story</p>
          <h1 className="mt-3 font-display text-hero text-ink">
            Woven into who we are
          </h1>
        </div>
      </section>

      <article className="container-editorial max-w-2xl space-y-10 py-16 text-lg leading-relaxed text-charcoal">
        <div id="indore" className="space-y-4">
          <h2 className="font-display text-2xl text-ink">A childhood in Indore</h2>
          <p>
            I grew up in Indore, in a home where cloth was never just cloth. My
            family ran a textile business, and my earliest memories are of bolts of
            fabric stacked to the ceiling, the clack of the loom in the next room,
            and elders who could tell a good weave by touch alone. Fabric was our
            livelihood, but it was also our language.
          </p>
          <p>
            I started weaving young. What began as curiosity became something I
            couldn&apos;t put down. I wanted to know why one thread sat differently
            than another, how a border was built, why certain drapes felt alive. The
            more I learned, the more certain I became that I had a connection with
            traditional wear that I was meant to follow.
          </p>
        </div>

        <div id="craft" className="space-y-4">
          <h2 className="font-display text-2xl text-ink">Choosing the loom</h2>
          <p>
            When it came time to make my own way, the choice made itself. I started
            Sanskriti to bring the craft I grew up with to people who love it as much
            as I do. We began with kurtas, the piece I know best, and built outward
            from there, each new style held to the same standard my family taught me:
            the fabric must be honest, the finishing must be clean, and the garment
            must feel like it was made for you.
          </p>
          <p>
            Every piece is chosen for quality first. I look for the fabrics that
            breathe and last, the weaves that carry real heritage, and the silhouettes
            that feel current rather than costume. The goal is simple: traditional
            clothing you actually want to wear, made beautifully enough to become the
            piece you reach for again and again.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-2xl text-ink">What Sanskriti stands for</h2>
          <p>
            Sanskriti means culture, and that is the promise. We carry the best
            quality and the latest, most considered pieces so that your traditional
            wardrobe feels elevated, personal, and unmistakably yours. When you buy
            from us, you are not just buying a garment. You are carrying forward a
            story that started at a loom in Indore.
          </p>
        </div>

        <div className="rounded-2xl border border-sand bg-cream p-8 text-center">
          <p className="font-display text-2xl text-ink">Come find your piece.</p>
          <Link href="/shop" className="btn-primary mt-5">
            Explore the Collection <ArrowRight />
          </Link>
        </div>
      </article>
    </div>
  );
}
