import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getSession } from "@/lib/auth";
import { getWishlist } from "@/lib/user-data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Wishlist · Sanskriti Clothing" };

export default async function WishlistPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="container-editorial py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-sand p-12 text-center">
          <p className="font-display text-2xl text-ink">Save your favourites</p>
          <p className="mt-2 text-charcoal">
            Log in to build your wishlist and pick up where you left off.
          </p>
          <Link href="/login?next=/wishlist" className="btn-primary mt-6">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  const wishlist = await getWishlist(session.id);

  return (
    <div className="container-editorial py-12">
      <h1 className="mb-8 font-display text-display text-ink">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sand p-16 text-center">
          <p className="font-display text-2xl text-ink">No saved pieces yet</p>
          <p className="mt-2 text-charcoal">Tap the heart on any piece to save it here.</p>
          <Link href="/shop" className="btn-primary mt-6">Explore the collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((w) => (
            <ProductCard key={w.id} product={w.product} saved />
          ))}
        </div>
      )}
    </div>
  );
}
