import Link from "next/link";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import ShopControls from "@/components/ShopControls";
import { getProducts, getCategoryCounts, type ShopFilters } from "@/lib/queries";
import { clothingCategories, categoryBySlug } from "@/data/catalog";

export const dynamic = "force-dynamic";

type SP = { [k: string]: string | string[] | undefined };

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const filters: ShopFilters = {
    q: one(sp.q),
    category: one(sp.category),
    collection: one(sp.collection),
    ready: one(sp.ready) === "1",
    sort: (one(sp.sort) as ShopFilters["sort"]) ?? "new",
  };

  const [products, counts] = await Promise.all([
    getProducts(filters),
    getCategoryCounts(),
  ]);

  const activeCat = filters.category ? categoryBySlug(filters.category) : null;
  const title = activeCat
    ? activeCat.name
    : filters.ready
    ? "Ready to Ship"
    : filters.q
    ? `Results for “${filters.q}”`
    : "All Clothing";

  return (
    <div className="container-editorial py-12">
      <header className="mb-8">
        <p className="eyebrow">The Collection</p>
        <h1 className="mt-2 font-display text-display text-ink">{title}</h1>
        {activeCat && <p className="mt-2 max-w-xl text-charcoal">{activeCat.description}</p>}
      </header>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-stone">
              Categories
            </h2>
            <ul className="space-y-1.5">
              <FilterLink href="/shop" active={!filters.category && !filters.ready}>
                All Clothing
              </FilterLink>
              {clothingCategories.map((c) => (
                <FilterLink
                  key={c.slug}
                  href={`/shop?category=${c.slug}`}
                  active={filters.category === c.slug}
                >
                  {c.name}
                  {counts[c.slug] ? (
                    <span className="text-stone"> ({counts[c.slug]})</span>
                  ) : null}
                </FilterLink>
              ))}
            </ul>
          </div>
          <div className="gold-rule" />
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-stone">
              Availability
            </h2>
            <FilterLink href="/shop?ready=1" active={filters.ready}>
              Ready to Ship
            </FilterLink>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-6">
            <Suspense fallback={<div className="h-10" />}>
              <ShopControls />
            </Suspense>
          </div>
          <p className="mb-6 text-sm text-stone">{products.length} pieces</p>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-sand p-16 text-center">
              <p className="font-display text-2xl text-ink">Nothing here yet</p>
              <p className="mt-2 text-charcoal">
                Try a different search or browse{" "}
                <Link href="/shop" className="text-gold-deep link-underline">
                  all clothing
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`block rounded-lg px-3 py-1.5 text-sm transition ${
          active
            ? "bg-cream font-medium text-gold-deep"
            : "text-charcoal hover:bg-cream"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}
