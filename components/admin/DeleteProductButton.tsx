"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function del() {
    if (!confirm("Delete this product permanently? This cannot be undone.")) return;
    setBusy(true);
    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBusy(false);
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    }
  }

  return (
    <button onClick={del} disabled={busy} className="rounded-full border border-red-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-50 disabled:opacity-50">
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
