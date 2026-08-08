import Link from "next/link";
import ProductMedia from "./ProductMedia";
import WishlistButton from "./WishlistButton";
import { formatPrice } from "@/data/site";
import { inStock, type ProductCardData } from "@/lib/queries";

export default function ProductCard({
  product,
  saved = false,
}: {
  product: ProductCardData;
  saved?: boolean;
}) {
  const available = inStock(product);
  return (
    <div className="group card-hover">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-cream">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <ProductMedia
            src={product.images[0]?.url}
            alt={product.images[0]?.alt ?? product.name}
            name={product.name}
            className="transition duration-700 ease-editorial group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="rounded-full bg-ink/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-ivory">
              New
            </span>
          )}
          {product.compareAt && (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white">
              Sale
            </span>
          )}
          {!available && (
            <span className="rounded-full bg-stone px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white">
              Sold out
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3">
          <WishlistButton productId={product.id} initiallySaved={saved} />
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-[11px] uppercase tracking-[0.14em] text-stone">
          {product.category.name}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="block font-display text-lg leading-snug text-ink transition group-hover:text-gold-deep"
        >
          {product.name}
        </Link>
        <p className="flex items-center gap-2 text-sm">
          <span className="text-charcoal">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="text-stone line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
