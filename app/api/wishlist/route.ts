import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({ productId: z.string().min(1) });

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  await prisma.wishlistItem.upsert({
    where: {
      userId_productId: { userId: user.id, productId: parsed.data.productId },
    },
    create: { userId: user.id, productId: parsed.data.productId },
    update: {},
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  await prisma.wishlistItem.deleteMany({
    where: { userId: user.id, productId: parsed.data.productId },
  });
  return NextResponse.json({ ok: true });
}
