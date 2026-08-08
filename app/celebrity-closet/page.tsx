import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeatured } from "@/lib/queries";
import { ArrowRight } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Celebrity Closet · Sanskriti Clothing",
  description: "The pieces our best-dressed customers keep coming back to.",
};

export default async function CelebrityClosetPage() {
  const picks = await getFeatured(8);
  return (
    <div>
      <section className="bg-ink py-20 text-ivory">
        <div className="container-editorial max-w-2xl text-center">
          <p className="eyebrow text-gold-soft">Celebrity Closet</p>
          <h1 className="mt-3 font-display text-hero">Worn on the big days</h1>
          <p className="mt-4 text-ivory/70">
            A curated edit of the standout pieces our customers reach for when the
            occasion matters most. Spotted something you love? Message us and we
            will help you make it yours.
          </p>
        </div>
      </section>

      <div className="container-editorial py-14">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {picks.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/shop" className="btn-gold">
            Browse everything <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
