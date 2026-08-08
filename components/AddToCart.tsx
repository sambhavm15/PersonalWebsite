"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Variant = { id: string; size: string; stock: number };

export default function AddToCart({ variants }: { variants: Variant[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(
    variants.find((v) => v.stock > 0)?.id ?? null
  );
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const current = variants.find((v) => v.id === selected);
  const maxQty = current?.stock ?? 0;

  async function add() {
    if (!selected || busy) return;
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: selected, quantity: qty }),
    });
    setBusy(false);
    if (res.status === 401) {
      router.push("/login?next=" + encodeURIComponent(location.pathname));
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error ?? "Could not add to cart.");
      return;
    }
    setMsg("Added to your cart.");
    window.dispatchEvent(new Event("sanskriti:refresh"));
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="label">Select Size</p>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => {
            const disabled = v.stock <= 0;
            const active = v.id === selected;
            return (
              <button
                key={v.id}
                disabled={disabled}
                onClick={() => {
                  setSelected(v.id);
                  setQty(1);
                }}
                className={[
                  "min-w-12 rounded-lg border px-3 py-2 text-sm transition",
                  active
                    ? "border-gold bg-gold text-white"
                    : "border-sand bg-white text-charcoal hover:border-gold",
                  disabled && "cursor-not-allowed line-through opacity-40",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {v.size}
              </button>
            );
          })}
        </div>
        {current && (
          <p className="mt-2 text-xs text-stone">
            {maxQty > 0 ? `${maxQty} in stock` : "Out of stock"}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-lg border border-sand">
          <button
            className="px-3 py-2 text-lg text-charcoal disabled:opacity-30"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button
            className="px-3 py-2 text-lg text-charcoal disabled:opacity-30"
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            disabled={qty >= maxQty}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button onClick={add} disabled={!selected || maxQty <= 0 || busy} className="btn-primary flex-1">
          {maxQty <= 0 ? "Sold Out" : busy ? "Adding…" : "Add to Cart"}
        </button>
      </div>

      {msg && <p className="text-sm text-gold-deep">{msg}</p>}
    </div>
  );
}
