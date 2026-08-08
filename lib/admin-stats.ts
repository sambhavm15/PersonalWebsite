import "server-only";
import { prisma } from "./prisma";

const LOW_STOCK = 3;
const COMMITTED = ["confirmed", "shipped", "fulfilled"];

export async function getDashboardStats() {
  const [products, variants, orders, categories] = await Promise.all([
    prisma.product.findMany({
      include: { variants: true, category: true, orderItems: true },
    }),
    prisma.productVariant.findMany(),
    prisma.order.findMany({ include: { items: true } }),
    prisma.category.findMany({ orderBy: { position: "asc" } }),
  ]);

  const totalProducts = products.length;
  const totalUnits = variants.reduce((s, v) => s + v.stock, 0);
  const inventoryValue = products.reduce(
    (s, p) => s + p.variants.reduce((a, v) => a + v.stock, 0) * p.price,
    0
  );

  const lowStock = products
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      stock: p.variants.reduce((a, v) => a + v.stock, 0),
    }))
    .filter((p) => p.stock <= LOW_STOCK)
    .sort((a, b) => a.stock - b.stock);

  const outOfStock = lowStock.filter((p) => p.stock === 0).length;

  // Orders
  const ordersByStatus: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    shipped: 0,
    fulfilled: 0,
    cancelled: 0,
  };
  for (const o of orders) ordersByStatus[o.status] = (ordersByStatus[o.status] ?? 0) + 1;

  const revenue = orders
    .filter((o) => COMMITTED.includes(o.status))
    .reduce((s, o) => s + o.total, 0);

  const pendingCount = ordersByStatus.pending ?? 0;

  // Units sold per product (committed orders only)
  const soldMap: Record<string, number> = {};
  for (const o of orders) {
    if (!COMMITTED.includes(o.status)) continue;
    for (const it of o.items) soldMap[it.name] = (soldMap[it.name] ?? 0) + it.quantity;
  }
  const bestSellers = Object.entries(soldMap)
    .map(([name, units]) => ({ name, units }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  // Stock by category
  const stockByCategory = categories.map((c) => {
    const units = products
      .filter((p) => p.categoryId === c.id)
      .reduce((s, p) => s + p.variants.reduce((a, v) => a + v.stock, 0), 0);
    return { name: c.name, units };
  });

  // Revenue by month (last 6 months, committed orders)
  const now = new Date();
  const months: { label: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("en-US", { month: "short" });
    const value = orders
      .filter((o) => {
        if (!COMMITTED.includes(o.status)) return false;
        return (
          o.createdAt.getFullYear() === d.getFullYear() &&
          o.createdAt.getMonth() === d.getMonth()
        );
      })
      .reduce((s, o) => s + o.total, 0);
    months.push({ label, value });
  }

  return {
    totalProducts,
    totalUnits,
    inventoryValue,
    lowStock,
    outOfStock,
    ordersByStatus,
    totalOrders: orders.length,
    revenue,
    pendingCount,
    bestSellers,
    stockByCategory,
    revenueByMonth: months,
  };
}
