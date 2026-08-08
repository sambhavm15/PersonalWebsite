// Static catalog taxonomy — drives the mega-menu nav and collection pages.
// The actual products live in the database; this describes how they're grouped.

export type ClothingCategory = {
  name: string;
  slug: string;
  description: string;
  sizeType: "alpha" | "numeric";
};

// Clothing types — each product belongs to exactly one of these (its `category`).
export const clothingCategories: ClothingCategory[] = [
  {
    name: "Kurtas & Shirts",
    slug: "kurtas-and-shirts",
    description: "Everyday elegance — hand-finished kurtas and shirts.",
    sizeType: "alpha",
  },
  {
    name: "Bandhgalas",
    slug: "bandhgalas",
    description: "Structured, ceremonial, quietly commanding.",
    sizeType: "numeric",
  },
  {
    name: "Nehru Jackets",
    slug: "nehru-jackets",
    description: "The layering piece that finishes every look.",
    sizeType: "numeric",
  },
  {
    name: "Jacket Set",
    slug: "jacket-set",
    description: "Coordinated jacket-and-kurta sets, ready to wear.",
    sizeType: "alpha",
  },
  {
    name: "Sherwanis",
    slug: "sherwanis",
    description: "For the days that matter most.",
    sizeType: "numeric",
  },
  {
    name: "Bottoms",
    slug: "bottoms",
    description: "Churidars, pyjamas and trousers, cut to drape.",
    sizeType: "alpha",
  },
];

export type Collection = {
  name: string;
  slug: string;
  blurb: string;
};

// Marketing collections — surfaced in the Collections nav column + collection pages.
export const collections: Collection[] = [
  {
    name: "Love All FW26",
    slug: "love-all-fw26",
    blurb: "The Fall/Winter 2026 flagship — heritage silhouettes, reimagined.",
  },
  {
    name: "Modern Classics",
    slug: "modern-classics",
    blurb: "The core wardrobe. Pieces that never leave the rotation.",
  },
  {
    name: "Benaras Collection",
    slug: "benaras",
    blurb: "Woven on the looms of Benaras, in real gold and silver zari.",
  },
  {
    name: "Pichhwai Collection",
    slug: "pichhwai",
    blurb: "Miniature Pichhwai art, translated into thread.",
  },
  {
    name: "Rewild 2026",
    slug: "rewild-2026",
    blurb: "Botanical motifs and untamed color, for the season ahead.",
  },
];

// The three columns of the New Arrivals nav.
export const newArrivalsLinks = [
  { name: "Love All FW26", href: "/collections/love-all-fw26" },
  { name: "Ready to Ship", href: "/shop?ready=1" },
  { name: "Modern Classics", href: "/collections/modern-classics" },
];

export const sizesByType: Record<ClothingCategory["sizeType"], string[]> = {
  alpha: ["XS", "S", "M", "L", "XL", "XXL"],
  numeric: ["36", "38", "40", "42", "44", "46"],
};

export function categoryBySlug(slug: string) {
  return clothingCategories.find((c) => c.slug === slug);
}

export function collectionBySlug(slug: string) {
  return collections.find((c) => c.slug === slug);
}
