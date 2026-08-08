import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { site, waLink, formatPrice } from "@/data/site";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  note: z.string().optional(),
});

// Creates a "pending" order and returns a pre-filled WhatsApp link so the
// customer can confirm directly with Sanskriti. Inventory is decremented by
// the admin when the order is confirmed (see /api/admin/orders).
export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Missing contact details." }, { status: 400 });

  const cart = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { variant: true, product: true },
  });
  if (cart.length === 0) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });

  // Validate stock before creating the order.
  for (const item of cart) {
    if (item.quantity > item.variant.stock) {
      return NextResponse.json(
        { error: `${item.product.name} (${item.variant.size}) only has ${item.variant.stock} left.` },
        { status: 400 }
      );
    }
  }

  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const last = await prisma.order.findFirst({ orderBy: { number: "desc" } });
  const number = (last?.number ?? 1000) + 1;

  const order = await prisma.order.create({
    data: {
      number,
      status: "pending",
      channel: "whatsapp",
      total,
      customerName: parsed.data.name.trim(),
      customerEmail: parsed.data.email.toLowerCase().trim(),
      customerPhone: parsed.data.phone?.trim() || null,
      note: parsed.data.note?.trim() || null,
      userId: user.id,
      items: {
        create: cart.map((i) => ({
          name: i.product.name,
          size: i.variant.size,
          quantity: i.quantity,
          unitPrice: i.product.price,
          productId: i.productId,
          variantId: i.variantId,
        })),
      },
    },
    include: { items: true },
  });

  // Clear cart now that it's captured as an order.
  await prisma.cartItem.deleteMany({ where: { userId: user.id } });

  const lines = order.items
    .map((i) => `• ${i.name} (${i.size}) x${i.quantity} — ${formatPrice(i.unitPrice * i.quantity)}`)
    .join("\n");
  const message =
    `Hi ${site.name}! I'd like to place order #${order.number}:\n\n${lines}\n\n` +
    `Total: ${formatPrice(order.total)}\n` +
    `Name: ${order.customerName}\n` +
    (order.customerPhone ? `Phone: ${order.customerPhone}\n` : "") +
    (order.note ? `Note: ${order.note}\n` : "");

  return NextResponse.json({
    ok: true,
    orderNumber: order.number,
    whatsapp: waLink(message),
  });
}
