import "server-only";
import { prisma } from "./prisma";
import { productCardSelect } from "./queries";

export async function getCart(userId: string) {
  return prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      variant: true,
      product: {
        include: { images: { orderBy: { position: "asc" }, take: 1 } },
      },
    },
  });
}

export async function getWishlist(userId: string) {
  return prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { product: { select: productCardSelect } },
  });
}

export async function getOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function getCounts(userId: string) {
  const [cart, wishlist] = await Promise.all([
    prisma.cartItem.aggregate({ where: { userId }, _sum: { quantity: true } }),
    prisma.wishlistItem.count({ where: { userId } }),
  ]);
  return { cart: cart._sum.quantity ?? 0, wishlist };
}
