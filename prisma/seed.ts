import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  clothingCategories,
  sizesByType,
  type ClothingCategory,
} from "../data/catalog";

const prisma = new PrismaClient();

type SeedProduct = {
  name: string;
  categorySlug: string;
  description: string;
  story?: string;
  fabric?: string;
  color?: string;
  care?: string;
  price: number;
  compareAt?: number;
  collection?: string;
  featured?: boolean;
  isNew?: boolean;
  // per-size stock; if omitted, sensible defaults are generated
  stock?: Record<string, number>;
};

const products: SeedProduct[] = [
  {
    name: "Ivory Chikankari Kurta",
    categorySlug: "kurtas-and-shirts",
    description:
      "A cloud-soft cotton kurta hand-embroidered in Lucknowi chikankari. The shadow-white thread catches light without ever shouting.",
    story: "Our most-loved everyday piece, three seasons running.",
    fabric: "Pure cotton",
    color: "Ivory",
    care: "Dry clean or gentle hand wash cold.",
    price: 148,
    collection: "modern-classics",
    featured: true,
    isNew: true,
  },
  {
    name: "Ecru Linen Band-Collar Shirt",
    categorySlug: "kurtas-and-shirts",
    description:
      "A relaxed band-collar shirt in breathable European linen. Wears equally well with denim or a churidar.",
    fabric: "Linen",
    color: "Ecru",
    care: "Machine wash cold, line dry.",
    price: 124,
    collection: "modern-classics",
    isNew: true,
  },
  {
    name: "Gold Zari Benaras Kurta",
    categorySlug: "kurtas-and-shirts",
    description:
      "Silk kurta woven in Benaras with real gold zari borders. A quiet showpiece for the wedding season.",
    story: "Woven over eleven days on a single Benarasi loom.",
    fabric: "Katan silk with gold zari",
    color: "Champagne gold",
    care: "Dry clean only.",
    price: 389,
    compareAt: 440,
    collection: "benaras",
    featured: true,
  },
  {
    name: "Midnight Bandhgala",
    categorySlug: "bandhgalas",
    description:
      "A sharply tailored bandhgala in midnight wool-blend, with self-covered buttons and a structured shoulder.",
    fabric: "Wool blend",
    color: "Midnight navy",
    care: "Dry clean only.",
    price: 465,
    collection: "modern-classics",
    featured: true,
  },
  {
    name: "Ivory Raw-Silk Bandhgala",
    categorySlug: "bandhgalas",
    description:
      "The ceremonial bandhgala, cut from textured raw silk with a tonal gold lapel pin.",
    fabric: "Raw silk",
    color: "Ivory",
    care: "Dry clean only.",
    price: 498,
    collection: "love-all-fw26",
    isNew: true,
  },
  {
    name: "Handloom Nehru Jacket — Sand",
    categorySlug: "nehru-jackets",
    description:
      "A handloom cotton Nehru jacket in warm sand, finished with coconut-shell buttons. The layering piece the wardrobe was missing.",
    fabric: "Handloom cotton",
    color: "Sand",
    care: "Dry clean recommended.",
    price: 168,
    collection: "modern-classics",
    isNew: true,
  },
  {
    name: "Brocade Nehru Jacket — Antique Gold",
    categorySlug: "nehru-jackets",
    description:
      "A festive Nehru jacket in antique-gold brocade, built to lift the simplest kurta into something ceremonial.",
    fabric: "Silk brocade",
    color: "Antique gold",
    care: "Dry clean only.",
    price: 214,
    compareAt: 245,
    collection: "benaras",
    featured: true,
  },
  {
    name: "Pichhwai-Print Jacket Set",
    categorySlug: "jacket-set",
    description:
      "A coordinated kurta with a jacket printed in miniature Pichhwai lotus motifs. Sold as a ready-to-wear set.",
    story: "Adapted from a nineteenth-century Nathdwara Pichhwai.",
    fabric: "Cotton silk",
    color: "Ivory & indigo",
    care: "Dry clean only.",
    price: 328,
    collection: "pichhwai",
    featured: true,
    isNew: true,
  },
  {
    name: "Ivory & Gold Jacket Set",
    categorySlug: "jacket-set",
    description:
      "An ivory kurta paired with a gold-threaded jacket — the effortless answer to every invitation.",
    fabric: "Cotton silk",
    color: "Ivory & gold",
    care: "Dry clean only.",
    price: 356,
    collection: "love-all-fw26",
  },
  {
    name: "Classic Ivory Sherwani",
    categorySlug: "sherwanis",
    description:
      "A full-length ivory sherwani with tonal thread-work and a matching stole. Made to be remembered.",
    story: "Our atelier's signature groom's piece.",
    fabric: "Silk blend",
    color: "Ivory",
    care: "Dry clean only.",
    price: 845,
    collection: "love-all-fw26",
    featured: true,
  },
  {
    name: "Rewild Botanical Sherwani",
    categorySlug: "sherwanis",
    description:
      "A statement sherwani embroidered with untamed botanical vines from the Rewild 2026 collection.",
    fabric: "Silk",
    color: "Deep emerald",
    care: "Dry clean only.",
    price: 920,
    collection: "rewild-2026",
    isNew: true,
  },
  {
    name: "Ivory Cotton Churidar",
    categorySlug: "bottoms",
    description:
      "The essential churidar in stretch cotton, cut to gather cleanly at the ankle.",
    fabric: "Stretch cotton",
    color: "Ivory",
    care: "Machine wash cold.",
    price: 68,
    collection: "modern-classics",
  },
  {
    name: "Tailored Silk Pyjama",
    categorySlug: "bottoms",
    description:
      "A straight-cut pyjama in dupioni silk, the quiet counterpart to a festive kurta.",
    fabric: "Dupioni silk",
    color: "Champagne",
    care: "Dry clean only.",
    price: 92,
    collection: "love-all-fw26",
  },
  {
    name: "Sage Green Handloom Kurta",
    categorySlug: "kurtas-and-shirts",
    description:
      "A breathable handloom kurta in soft sage, with a wood-button placket and side slits.",
    fabric: "Handloom cotton",
    color: "Sage",
    care: "Machine wash cold, line dry.",
    price: 132,
    collection: "rewild-2026",
    isNew: true,
  },
  {
    name: "Charcoal Silk Bandhgala",
    categorySlug: "bandhgalas",
    description:
      "A modern charcoal bandhgala in mulberry silk, cut slim through the body.",
    fabric: "Mulberry silk",
    color: "Charcoal",
    care: "Dry clean only.",
    price: 512,
    collection: "modern-classics",
  },
  {
    name: "Benaras Silk Nehru Jacket — Ivory",
    categorySlug: "nehru-jackets",
    description:
      "An ivory Benarasi jacket with silver zari buti, understated enough for daylight, rich enough for the evening.",
    fabric: "Benarasi silk",
    color: "Ivory & silver",
    care: "Dry clean only.",
    price: 232,
    collection: "benaras",
    isNew: true,
  },
];

function stockFor(cat: ClothingCategory, override?: Record<string, number>) {
  const sizes = sizesByType[cat.sizeType];
  return sizes.map((size) => ({
    size,
    stock: override?.[size] ?? Math.floor(Math.random() * 6) + 2,
  }));
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Seeding Sanskriti Clothing…");

  // Clean slate (order matters for FK constraints)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Categories
  const catBySlug: Record<string, string> = {};
  for (let i = 0; i < clothingCategories.length; i++) {
    const c = clothingCategories[i];
    const created = await prisma.category.create({
      data: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        kind: "clothing",
        position: i,
      },
    });
    catBySlug[c.slug] = created.id;
  }

  // Products
  for (const p of products) {
    const cat = clothingCategories.find((c) => c.slug === p.categorySlug)!;
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slugify(p.name),
        description: p.description,
        story: p.story,
        fabric: p.fabric,
        color: p.color,
        care: p.care,
        price: p.price,
        compareAt: p.compareAt,
        collection: p.collection,
        featured: p.featured ?? false,
        isNew: p.isNew ?? false,
        status: "active",
        categoryId: catBySlug[p.categorySlug],
        variants: { create: stockFor(cat, p.stock) },
      },
    });
  }

  // Admin account
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@example.com")
    .toLowerCase()
    .trim();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "sanskriti-admin";
  await prisma.user.create({
    data: {
      email: adminEmail,
      name: process.env.ADMIN_NAME ?? "Sanskriti Admin",
      role: "admin",
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  // A demo customer so the account area has something to show
  await prisma.user.create({
    data: {
      email: "customer@example.com",
      name: "Demo Customer",
      role: "customer",
      passwordHash: await bcrypt.hash("password123", 10),
    },
  });

  const counts = {
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    variants: await prisma.productVariant.count(),
  };
  console.log("Seed complete:", counts);
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
