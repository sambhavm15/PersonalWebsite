import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCounts } from "@/lib/user-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ user: null, cart: 0, wishlist: 0 });
  }
  const counts = await getCounts(user.id);
  return NextResponse.json({
    user: { name: user.name, email: user.email, role: user.role },
    cart: counts.cart,
    wishlist: counts.wishlist,
  });
}
