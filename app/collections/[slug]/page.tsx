import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/queries";
import { collectionBySlug } from "@/data/catalog";

// Rendered on demand so the build never needs the database.
export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = collectionBySlug(slug);
  if (!collection) notFound();

  const products = await getProducts({ collection: slug, sort: "new" });

  return (
    <div>
      <section className="bg-ink py-20 text-ivory">
        <div className="container-editorial text-center">
          <p className="eyebrow text-gold-soft">Collection</p>
          <h1 className="mt-3 font-display text-hero">{collection.name}</h1>
          <p className="mx-auto mt-4 max-w-xl text-ivory/70">{collection.blurb}</p>
        </div>
      </section>

      <div className="container-editorial py-14">
        <p className="mb-6 text-sm text-stone">{products.length} pieces</p>
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sand p-16 text-center">
            <p className="font-display text-2xl text-ink">Coming soon</p>
            <p className="mt-2 text-charcoal">
              Pieces from this collection are being woven now. Check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
