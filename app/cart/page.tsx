import { redirect } from "next/navigation";
import CartClient, { type CartLine } from "@/components/CartClient";
import { getSession } from "@/lib/auth";
import { getCart } from "@/lib/user-data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Cart · Sanskriti Clothing" };

export default async function CartPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/cart");

  const cart = await getCart(session.id);
  const items: CartLine[] = cart.map((c) => ({
    id: c.id,
    slug: c.product.slug,
    name: c.product.name,
    size: c.variant.size,
    price: c.product.price,
    quantity: c.quantity,
    stock: c.variant.stock,
    image: c.product.images[0]?.url ?? null,
  }));

  return (
    <div className="container-editorial py-12">
      <h1 className="mb-8 font-display text-display text-ink">Your Cart</h1>
      <CartClient
        initialItems={items}
        customer={{ name: session.name, email: session.email }}
      />
    </div>
  );
}
