"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { clothingCategories, collections, sizesByType } from "@/data/catalog";

// Shrink a photo to a sensible web size before upload — keeps files small,
// the storefront fast, and stays well under upload limits.
async function resizeImage(file: File, maxDim = 1600, quality = 0.85): Promise<Blob> {
  if (!file.type.startsWith("image/")) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  const blob: Blob | null = await new Promise((res) =>
    canvas.toBlob(res, "image/jpeg", quality)
  );
  return blob ?? file;
}

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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setUploadError(null);
    setUploading(true);
    try {
      for (const file of list) {
        const resized = await resizeImage(file);
        const fd = new FormData();
        // keep a .jpg name since we re-encode to jpeg
        const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
        fd.append("file", new File([resized], name, { type: "image/jpeg" }));
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setUploadError(data.error ?? "Upload failed.");
          continue;
        }
        setV((prev) => ({
          ...prev,
          images: [...prev.images, { url: data.url, alt: "" }],
        }));
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
            Drag photos in or click to choose from your computer. The first image
            is the cover. Photos are resized automatically. Leave empty to use a
            branded placeholder.
          </p>

          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
              dragOver ? "border-gold bg-gold/5" : "border-sand bg-cream/40 hover:border-gold"
            }`}
          >
            <svg viewBox="0 0 24 24" className="mb-2 h-8 w-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4m0 0L8 8m4-4 4 4" />
              <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
            <p className="text-sm font-medium text-charcoal">
              {uploading ? "Uploading…" : "Drop photos here or click to upload"}
            </p>
            <p className="mt-1 text-xs text-stone">JPG, PNG or WEBP — you can select several at once</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}

          {/* Thumbnails */}
          {v.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {v.images.map((img, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-sand bg-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt ?? ""} className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-ink/80 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-ivory">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Remove image"
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-sm text-stone shadow transition hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* URL fallback */}
          <details className="mt-4">
            <summary className="cursor-pointer text-xs text-stone hover:text-charcoal">
              Or paste an image URL instead
            </summary>
            <div className="mt-3 space-y-3">
              {v.images.map((img, i) => (
                <div key={i} className="flex gap-2">
                  <input className="field" placeholder="https://…/image.jpg" value={img.url} onChange={(e) => setImage(i, { url: e.target.value })} />
                  <button type="button" onClick={() => removeImage(i)} className="shrink-0 rounded-lg border border-sand px-3 text-sm text-stone hover:text-red-600">
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" onClick={addImage} className="btn-gold py-2 text-xs">
                + Add image URL
              </button>
            </div>
          </details>
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
