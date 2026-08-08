"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "./icons";

export default function ShopControls() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/shop?${next.toString()}`);
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setParam("q", q.trim());
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={submitSearch} className="flex w-full items-center gap-2 rounded-full border border-sand bg-white px-4 py-2 sm:max-w-md">
        <SearchIcon className="h-4 w-4 text-stone" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the collection…"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-stone"
        />
        {q && (
          <button type="button" onClick={() => { setQ(""); setParam("q", ""); }} className="text-xs text-stone hover:text-ink">
            Clear
          </button>
        )}
      </form>

      <label className="flex items-center gap-2 text-sm text-charcoal">
        Sort
        <select
          value={params.get("sort") ?? "new"}
          onChange={(e) => setParam("sort", e.target.value)}
          className="rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-gold"
        >
          <option value="new">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </label>
    </div>
  );
}
