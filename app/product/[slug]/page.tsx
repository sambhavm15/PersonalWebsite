import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductMedia from "@/components/ProductMedia";
import AddToCart from "@/components/AddToCart";
import WishlistButton from "@/components/WishlistButton";
import ProductCard from "@/components/ProductCard";
import { getProductBySlug, getProducts } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { site, waLink, formatPrice } from "@/data/site";
import { WhatsAppIcon } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found · Sanskriti" };
  return {
    title: `${product.name} · Sanskriti Clothing`,
    description: product.description.slice(0, 150),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status === "archived") notFound();

  const session = await getSession();
  let saved = false;
  if (session) {
    const w = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: session.id, productId: product.id } },
    });
    saved = !!w;
  }

  const related = (
    await getProducts({ category: product.category.slug, sort: "new" })
  )
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const inquiry = waLink(
    `Hi Sanskriti! I'm interested in the ${product.name} (${formatPrice(
      product.price
    )}). Is it available?`
  );

  return (
    <div className="container-editorial py-10">
      <nav className="mb-6 text-xs text-stone">
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-ink">
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream">
            <ProductMedia
              src={product.images[0]?.url}
              alt={product.images[0]?.alt ?? product.name}
              name={product.name}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1, 5).map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg bg-cream">
                  <ProductMedia src={img.url} alt={img.alt} name={product.name} sizes="25vw" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="eyebrow">{product.category.name}</p>
          <h1 className="mt-2 font-display text-4xl text-ink">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl text-charcoal">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-lg text-stone line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>

          {product.story && (
            <p className="mt-4 border-l-2 border-gold pl-4 text-sm italic text-charcoal/80">
              {product.story}
            </p>
          )}

          <p className="mt-5 text-charcoal">{product.description}</p>

          <div className="mt-8">
            <AddToCart
              variants={product.variants.map((v) => ({
                id: v.id,
                size: v.size,
                stock: v.stock,
              }))}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <WishlistButton productId={product.id} initiallySaved={saved} variant="full" />
            <a href={inquiry} target="_blank" rel="noreferrer" className="btn-gold w-full">
              <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
            </a>
          </div>

          {/* Attributes */}
          <dl className="mt-10 divide-y divide-sand border-y border-sand text-sm">
            {product.fabric && <Row label="Fabric" value={product.fabric} />}
            {product.color && <Row label="Colour" value={product.color} />}
            {product.care && <Row label="Care" value={product.care} />}
            <Row
              label="Shipping"
              value="Complimentary worldwide shipping. Ships in 3–5 days."
            />
          </dl>

          <p className="mt-6 text-xs text-stone">
            Questions about sizing or fabric? Message us on{" "}
            <a href={inquiry} target="_blank" rel="noreferrer" className="text-gold-deep link-underline">
              WhatsApp {site.whatsappDisplay}
            </a>
            .
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-2xl text-ink">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-3">
      <dt className="w-28 shrink-0 font-medium uppercase tracking-[0.1em] text-stone">
        {label}
      </dt>
      <dd className="text-charcoal">{value}</dd>
    </div>
  );
}
