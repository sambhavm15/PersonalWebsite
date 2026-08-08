import "server-only";
import { prisma } from "./prisma";
import type { Prisma } from "@prisma/client";

export const productCardSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  compareAt: true,
  color: true,
  isNew: true,
  featured: true,
  collection: true,
  category: { select: { name: true, slug: true } },
  images: { orderBy: { position: "asc" }, take: 2 },
  variants: { select: { stock: true } },
} satisfies Prisma.ProductSelect;

export type ProductCardData = Prisma.ProductGetPayload<{
  select: typeof productCardSelect;
}>;

export function inStock(p: { variants: { stock: number }[] }): boolean {
  return p.variants.some((v) => v.stock > 0);
}

export type ShopFilters = {
  q?: string;
  category?: string;
  collection?: string;
  ready?: boolean;
  isNew?: boolean;
  sort?: "new" | "price-asc" | "price-desc";
};

export async function getProducts(filters: ShopFilters = {}) {
  const where: Prisma.ProductWhereInput = { status: "active" };

  if (filters.category) where.category = { slug: filters.category };
  if (filters.collection) where.collection = filters.collection;
  if (filters.isNew) where.isNew = true;
  if (filters.q) {
    const q = filters.q;
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { fabric: { contains: q } },
      { color: { contains: q } },
      { category: { name: { contains: q } } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (filters.sort === "price-asc") orderBy = { price: "asc" };
  if (filters.sort === "price-desc") orderBy = { price: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    select: productCardSelect,
  });

  // "Ready to ship" = something in stock. Filtered in memory (SQLite can't
  // easily aggregate on the relation in the where clause).
  return filters.ready ? products.filter(inStock) : products;
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { id: "asc" } },
    },
  });
}

export async function getFeatured(take = 4) {
  return prisma.product.findMany({
    where: { status: "active", featured: true },
    orderBy: { createdAt: "desc" },
    take,
    select: productCardSelect,
  });
}

export async function getNewArrivals(take = 8) {
  return prisma.product.findMany({
    where: { status: "active", isNew: true },
    orderBy: { createdAt: "desc" },
    take,
    select: productCardSelect,
  });
}

export async function getCategoryCounts() {
  const grouped = await prisma.product.groupBy({
    by: ["categoryId"],
    where: { status: "active" },
    _count: { _all: true },
  });
  const map: Record<string, number> = {};
  const cats = await prisma.category.findMany();
  for (const g of grouped) {
    const cat = cats.find((c) => c.id === g.categoryId);
    if (cat) map[cat.slug] = g._count._all;
  }
  return map;
}
