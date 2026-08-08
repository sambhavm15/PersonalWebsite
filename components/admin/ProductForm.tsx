"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clothingCategories, collections, sizesByType } from "@/data/catalog";

type VariantRow = { size: string; stock: number; sku?: string };
type ImageRow = { url: string; alt?: string };

export type ProductFormValues = {
  id?: string;
  name: string;
  categorySlug: string;
  collection: string;
  price: number;
  compareAt: number | "";
  description: string;
  story: string;
  fabric: string;
  color: string;
  care: string;
  featured: boolean;
  isNew: boolean;
  status: "active" | "draft" | "archived";
  variants: VariantRow[];
  images: ImageRow[];
};

const empty: ProductFormValues = {
  name: "",
  categorySlug: clothingCategories[0].slug,
  collection: "",
  price: 0,
  compareAt: "",
  description: "",
  story: "",
  fabric: "",
  color: "",
  care: "",
  featured: false,
  isNew: true,
  status: "active",
  variants: sizesByType[clothingCategories[0].sizeType].map((size) => ({ size, stock: 0 })),
  images: [],
};

export default function ProductForm({ initial }: { initial?: ProductFormValues }) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [v, setV] = useState<ProductFormValues>(initial ?? empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
  }

  function onCategoryChange(slug: string) {
    const cat = clothingCategories.find((c) => c.slug === slug)!;
    // Reset the size rows to match the new category's size type, keeping any
    // stock the admin already typed for matching sizes.
    const defaults = sizesByType[cat.sizeType].map((size) => {
      const existing = v.variants.find((x) => x.size === size);
      return { size, stock: existing?.stock ?? 0, sku: existing?.sku };
    });
    setV((prev) => ({ ...prev, categorySlug: slug, variants: defaults }));
  }

  function setVariantStock(size: string, stock: number) {
    setV((prev) => ({
      ...prev,
      variants: prev.variants.map((x) => (x.size === size ? { ...x, stock } : x)),
    }));
  }

  function addImage() {
    setV((prev) => ({ ...prev, images: [...prev.images, { url: "", alt: "" }] }));
  }
  function setImage(i: number, patch: Partial<ImageRow>) {
    setV((prev) => ({
      ...prev,
      images: prev.images.map((img, idx) => (idx === i ? { ...img, ...patch } : img)),
    }));
  }
  function removeImage(i: number) {
    setV((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!v.name.trim()) return setError("Name is required.");
    if (!v.description.trim()) return setError("Description is required.");
    if (v.price <= 0) return setError("Price must be greater than zero.");
    const variants = v.variants.filter((x) => x.size);
    if (variants.length === 0) return setError("Add at least one size.");

    setBusy(true);
    const payload = {
      id: v.id,
      name: v.name.trim(),
      categorySlug: v.categorySlug,
      collection: v.collection || null,
      price: Number(v.price),
      compareAt: v.compareAt === "" ? null : Number(v.compareAt),
      description: v.description.trim(),
      story: v.story.trim() || null,
      fabric: v.fabric.trim() || null,
      color: v.color.trim() || null,
      care: v.care.trim() || null,
      featured: v.featured,
      isNew: v.isNew,
      status: v.status,
      variants: variants.map((x) => ({ size: x.size, stock: Number(x.stock) || 0, sku: x.sku || null })),
      images: v.images.filter((img) => img.url.trim()).map((img) => ({ url: img.url.trim(), alt: img.alt?.trim() || null })),
    };

    const res = await fetch("/api/admin/products", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Could not save product.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
      {/* Left: main details */}
      <div className="space-y-5 lg:col-span-2">
        <Card title="Details">
          <Field label="Name">
            <input className="field" value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Ivory Chikankari Kurta" />
          </Field>
          <Field label="Description">
            <textarea className="field" rows={4} value={v.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
          <Field label="Story (optional editorial note)">
            <input className="field" value={v.story} onChange={(e) => set("story", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fabric">
              <input className="field" value={v.fabric} onChange={(e) => set("fabric", e.target.value)} />
            </Field>
            <Field label="Colour">
              <input className="field" value={v.color} onChange={(e) => set("color", e.target.value)} />
            </Field>
          </div>
          <Field label="Care instructions">
            <input className="field" value={v.care} onChange={(e) => set("care", e.target.value)} />
          </Field>
        </Card>

        <Card title="Sizes & Inventory">
          <p className="mb-3 text-sm text-stone">
            Stock per size. Sizes follow the selected category.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {v.variants.map((row) => (
              <label key={row.size} className="flex items-center gap-2 rounded-lg border border-sand bg-cream px-3 py-2">
                <span className="w-10 text-sm font-medium text-ink">{row.size}</span>
                <input
                  type="number"
                  min={0}
                  value={row.stock}
                  onChange={(e) => setVariantStock(row.size, Number(e.target.value))}
                  className="w-full rounded border border-sand bg-white px-2 py-1 text-sm outline-none focus:border-gold"
                />
              </label>
            ))}
          </div>
        </Card>

        <Card title="Images">
          <p className="mb-3 text-sm text-stone">
            Paste image URLs (from Facebook, a CDN, or any public link). The first
            image is the cover. Leave empty to use a branded placeholder.
          </p>
          <div className="space-y-3">
            {v.images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <input className="field" placeholder="https://…/image.jpg" value={img.url} onChange={(e) => setImage(i, { url: e.target.value })} />
                <input className="field max-w-[40%]" placeholder="Alt text" value={img.alt ?? ""} onChange={(e) => setImage(i, { alt: e.target.value })} />
                <button type="button" onClick={() => removeImage(i)} className="shrink-0 rounded-lg border border-sand px-3 text-sm text-stone hover:text-red-600">
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={addImage} className="btn-gold py-2 text-xs">
              + Add image URL
            </button>
          </div>
        </Card>
      </div>

      {/* Right: organise + price */}
      <div className="space-y-5">
        <Card title="Pricing">
          <Field label={`Price (USD)`}>
            <input type="number" min={0} className="field" value={v.price} onChange={(e) => set("price", Number(e.target.value))} />
          </Field>
          <Field label="Compare-at price (optional)">
            <input type="number" min={0} className="field" value={v.compareAt} onChange={(e) => set("compareAt", e.target.value === "" ? "" : Number(e.target.value))} />
          </Field>
        </Card>

        <Card title="Organise">
          <Field label="Category">
            <select className="field" value={v.categorySlug} onChange={(e) => onCategoryChange(e.target.value)}>
              {clothingCategories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Collection (optional)">
            <select className="field" value={v.collection} onChange={(e) => set("collection", e.target.value)}>
              <option value="">None</option>
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select className="field" value={v.status} onChange={(e) => set("status", e.target.value as ProductFormValues["status"])}>
              <option value="active">Active (visible)</option>
              <option value="draft">Draft (hidden)</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <div className="space-y-2 pt-2">
            <Toggle label="Featured" checked={v.featured} onChange={(c) => set("featured", c)} />
            <Toggle label="Mark as New" checked={v.isNew} onChange={(c) => set("isNew", c)} />
          </div>
        </Card>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-sand bg-white p-6">
      <h2 className="mb-4 font-display text-xl text-ink">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="label">{label}</span>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (c: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm text-charcoal">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-gold" : "bg-sand"}`}
        aria-pressed={checked}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}
