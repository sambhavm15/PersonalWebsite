import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const v = await p.productVariant.findUnique({ where: { id: "cmsk0lmnh00087dr1vik91u5d" } });
const o = await p.order.findFirst({ orderBy: { number: "desc" } });
console.log(`stock=${v!.stock} lastOrder=#${o!.number} status=${o!.status} inventoryApplied=${o!.inventoryApplied}`);
await p.$disconnect();
