"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductMedia from "./ProductMedia";
import { formatPrice } from "@/data/site";

export type CartLine = {
  id: string;
  slug: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  stock: number;
  image?: string | null;
};

export default function CartClient({
  initialItems,
  customer,
}: {
  initialItems: CartLine[];
  customer: { name: string; email: string };
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [busy, setBusy] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ orderNumber: number; whatsapp: string } | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  async function setQty(id: string, quantity: number) {
    setBusy(true);
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItemId: id, quantity }),
    });
    setBusy(false);
    if (res.ok) {
      setItems((prev) =>
        quantity === 0
          ? prev.filter((i) => i.id !== id)
          : prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      );
      window.dispatchEvent(new Event("sanskriti:refresh"));
      router.refresh();
    }
  }

  async function checkout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCheckingOut(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        note: form.get("note"),
      }),
    });
    setCheckingOut(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    setItems([]);
    setDone({ orderNumber: data.orderNumber, whatsapp: data.whatsapp });
    window.dispatchEvent(new Event("sanskriti:refresh"));
    // Open WhatsApp with the pre-filled order.
    window.open(data.whatsapp, "_blank");
    router.refresh();
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-sand bg-white p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl text-gold-deep">✓</div>
        <h2 className="font-display text-3xl text-ink">Order #{done.orderNumber} placed</h2>
        <p className="mt-3 text-charcoal">
          We have opened WhatsApp so you can confirm your order with us directly.
          If it did not open, tap the button below.
        </p>
        <a href={done.whatsapp} target="_blank" rel="noreferrer" className="btn-primary mt-6">
          Confirm on WhatsApp
        </a>
        <div className="mt-4">
          <Link href="/account/orders" className="text-sm text-gold-deep link-underline">
            View my orders
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-sand p-16 text-center">
        <p className="font-display text-2xl text-ink">Your cart is empty</p>
        <p className="mt-2 text-charcoal">Beautiful pieces are waiting.</p>
        <Link href="/shop" className="btn-primary mt-6">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      {/* Line items */}
      <ul className="divide-y divide-sand">
        {items.map((i) => (
          <li key={i.id} className="flex gap-4 py-5">
            <Link href={`/product/${i.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-cream">
              <ProductMedia src={i.image} name={i.name} sizes="96px" />
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-4">
                <div>
                  <Link href={`/product/${i.slug}`} className="font-display text-lg text-ink">
                    {i.name}
                  </Link>
                  <p className="text-sm text-stone">Size {i.size}</p>
                </div>
                <p className="text-charcoal">{formatPrice(i.price * i.quantity)}</p>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-sand">
                  <button className="px-3 py-1.5 disabled:opacity-30" disabled={busy} onClick={() => setQty(i.id, i.quantity - 1)} aria-label="Decrease">−</button>
                  <span className="w-8 text-center text-sm">{i.quantity}</span>
                  <button className="px-3 py-1.5 disabled:opacity-30" disabled={busy || i.quantity >= i.stock} onClick={() => setQty(i.id, i.quantity + 1)} aria-label="Increase">+</button>
                </div>
                <button className="text-sm text-stone hover:text-red-600" onClick={() => setQty(i.id, 0)}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Summary + checkout */}
      <aside className="h-fit rounded-2xl border border-sand bg-cream p-6">
        <h2 className="font-display text-xl text-ink">Order Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-charcoal">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-charcoal">
            <span>Shipping</span>
            <span className="text-gold-deep">Complimentary</span>
          </div>
          <div className="gold-rule my-2" />
          <div className="flex justify-between font-medium text-ink">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>

        <form onSubmit={checkout} className="mt-6 space-y-3">
          <p className="text-xs text-stone">
            Confirm your details. We will place the order and open WhatsApp so you
            can finalise with us directly.
          </p>
          <input name="name" required defaultValue={customer.name} placeholder="Full name" className="field" />
          <input name="email" type="email" required defaultValue={customer.email} placeholder="Email" className="field" />
          <input name="phone" placeholder="Phone (optional)" className="field" />
          <textarea name="note" rows={2} placeholder="Note (optional)" className="field" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={checkingOut} className="btn-primary w-full">
            {checkingOut ? "Placing order…" : "Place Order via WhatsApp"}
          </button>
        </form>
      </aside>
    </div>
  );
}
