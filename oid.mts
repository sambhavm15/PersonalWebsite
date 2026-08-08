import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const o = await p.order.findFirst({ orderBy: { number: "desc" } });
console.log(o!.id);
await p.$disconnect();
