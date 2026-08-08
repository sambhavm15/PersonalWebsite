import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const addSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

const updateSchema = z.object({
  cartItemId: z.string().min(1),
  quantity: z.number().int().min(0).max(20),
});

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const parsed = addSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const variant = await prisma.productVariant.findUnique({
    where: { id: parsed.data.variantId },
  });
  if (!variant) return NextResponse.json({ error: "Item not found." }, { status: 404 });

  const existing = await prisma.cartItem.findUnique({
    where: { userId_variantId: { userId: user.id, variantId: variant.id } },
  });
  const desired = (existing?.quantity ?? 0) + parsed.data.quantity;
  if (desired > variant.stock) {
    return NextResponse.json(
      { error: `Only ${variant.stock} left in this size.` },
      { status: 400 }
    );
  }

  await prisma.cartItem.upsert({
    where: { userId_variantId: { userId: user.id, variantId: variant.id } },
    create: {
      userId: user.id,
      variantId: variant.id,
      productId: variant.productId,
      quantity: parsed.data.quantity,
    },
    update: { quantity: desired },
  });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const item = await prisma.cartItem.findUnique({
    where: { id: parsed.data.cartItemId },
    include: { variant: true },
  });
  if (!item || item.userId !== user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (parsed.data.quantity === 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
    return NextResponse.json({ ok: true, removed: true });
  }
  if (parsed.data.quantity > item.variant.stock) {
    return NextResponse.json(
      { error: `Only ${item.variant.stock} in stock.` },
      { status: 400 }
    );
  }
  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: parsed.data.quantity },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const { cartItemId } = await req.json().catch(() => ({}));
  if (!cartItemId) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  await prisma.cartItem.deleteMany({ where: { id: cartItemId, userId: user.id } });
  return NextResponse.json({ ok: true });
}
