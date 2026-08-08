import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/auth";

const variantSchema = z.object({
  size: z.string().min(1),
  stock: z.number().int().min(0),
  sku: z.string().optional().nullable(),
});

const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().optional().nullable(),
});

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  story: z.string().optional().nullable(),
  fabric: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  care: z.string().optional().nullable(),
  collection: z.string().optional().nullable(),
  price: z.number().int().min(0),
  compareAt: z.number().int().min(0).optional().nullable(),
  categorySlug: z.string().min(1),
  featured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  status: z.enum(["active", "draft", "archived"]).optional(),
  variants: z.array(variantSchema).min(1),
  images: z.array(imageSchema).optional(),
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = base || "product";
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const found = await prisma.product.findUnique({ where: { slug } });
    if (!found || found.id === excludeId) return slug;
    slug = `${base}-${++i}`;
  }
}

export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = productSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid product." },
      { status: 400 }
    );
  }
  const d = parsed.data;
  const category = await prisma.category.findUnique({ where: { slug: d.categorySlug } });
  if (!category) return NextResponse.json({ error: "Unknown category." }, { status: 400 });

  const slug = await uniqueSlug(slugify(d.name));
  const product = await prisma.product.create({
    data: {
      name: d.name,
      slug,
      description: d.description,
      story: d.story || null,
      fabric: d.fabric || null,
      color: d.color || null,
      care: d.care || null,
      collection: d.collection || null,
      price: d.price,
      compareAt: d.compareAt || null,
      featured: d.featured ?? false,
      isNew: d.isNew ?? false,
      status: d.status ?? "active",
      categoryId: category.id,
      variants: { create: d.variants.map((v) => ({ size: v.size, stock: v.stock, sku: v.sku || null })) },
      images: {
        create: (d.images ?? []).map((img, i) => ({
          url: img.url,
          alt: img.alt || d.name,
          position: i,
        })),
      },
    },
  });
  return NextResponse.json({ ok: true, id: product.id });
}

export async function PATCH(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const id = body?.id as string | undefined;
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid product." },
      { status: 400 }
    );
  }
  const d = parsed.data;
  const category = await prisma.category.findUnique({ where: { slug: d.categorySlug } });
  if (!category) return NextResponse.json({ error: "Unknown category." }, { status: 400 });

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // Replace variants + images wholesale (simple + predictable for the admin UI).
  await prisma.$transaction([
    prisma.productVariant.deleteMany({ where: { productId: id } }),
    prisma.productImage.deleteMany({ where: { productId: id } }),
    prisma.product.update({
      where: { id },
      data: {
        name: d.name,
        description: d.description,
        story: d.story || null,
        fabric: d.fabric || null,
        color: d.color || null,
        care: d.care || null,
        collection: d.collection || null,
        price: d.price,
        compareAt: d.compareAt || null,
        featured: d.featured ?? false,
        isNew: d.isNew ?? false,
        status: d.status ?? "active",
        categoryId: category.id,
        variants: { create: d.variants.map((v) => ({ size: v.size, stock: v.stock, sku: v.sku || null })) },
        images: {
          create: (d.images ?? []).map((img, i) => ({
            url: img.url,
            alt: img.alt || d.name,
            position: i,
          })),
        },
      },
    }),
  ]);
  return NextResponse.json({ ok: true, id });
}

export async function DELETE(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
