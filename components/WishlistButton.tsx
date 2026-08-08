"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartIcon } from "./icons";

export default function WishlistButton({
  productId,
  initiallySaved = false,
  variant = "icon",
}: {
  productId: string;
  initiallySaved?: boolean;
  variant?: "icon" | "full";
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initiallySaved);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    const next = !saved;
    setSaved(next);
    const res = await fetch("/api/wishlist", {
      method: next ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    setBusy(false);
    if (res.status === 401) {
      router.push("/login?next=" + encodeURIComponent(location.pathname));
      setSaved(!next);
      return;
    }
    if (!res.ok) {
      setSaved(!next);
      return;
    }
    window.dispatchEvent(new Event("sanskriti:refresh"));
    router.refresh();
  }

  if (variant === "full") {
    return (
      <button onClick={toggle} disabled={busy} className="btn-gold w-full">
        <HeartIcon filled={saved} className="h-4 w-4" />
        {saved ? "Saved to Wishlist" : "Add to Wishlist"}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-charcoal shadow-sm backdrop-blur transition hover:text-gold-deep"
    >
      <HeartIcon filled={saved} className="h-4 w-4" />
    </button>
  );
}
