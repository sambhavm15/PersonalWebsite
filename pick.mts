import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const v = await p.productVariant.findFirst({ where: { stock: { gte: 3 } }, include: { product: true } });
console.log(JSON.stringify({ variantId: v!.id, size: v!.size, stock: v!.stock, product: v!.product.name }));
await p.$disconnect();
