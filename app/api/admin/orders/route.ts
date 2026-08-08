import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/auth";

const schema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["pending", "confirmed", "shipped", "fulfilled", "cancelled"]),
});

// Statuses at/after which the sale is committed and stock should be reduced.
const APPLIES_INVENTORY = new Set(["confirmed", "shipped", "fulfilled"]);

export async function PATCH(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const shouldApply = APPLIES_INVENTORY.has(parsed.data.status);

  await prisma.$transaction(async (tx) => {
    // First time we move into a committed status: decrement inventory.
    if (shouldApply && !order.inventoryApplied) {
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }
    // Cancelling a previously-committed order: restore inventory.
    if (parsed.data.status === "cancelled" && order.inventoryApplied) {
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    const nextApplied =
      parsed.data.status === "cancelled"
        ? false
        : order.inventoryApplied || shouldApply;

    await tx.order.update({
      where: { id: order.id },
      data: { status: parsed.data.status, inventoryApplied: nextApplied },
    });
  });

  return NextResponse.json({ ok: true });
}
