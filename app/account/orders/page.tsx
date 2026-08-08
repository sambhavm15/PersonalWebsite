import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getOrders } from "@/lib/user-data";
import { formatPrice } from "@/data/site";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Orders · Sanskriti Clothing" };

export default async function OrdersPage() {
  const session = (await getSession())!;
  const orders = await getOrders(session.id);

  return (
    <div className="container-editorial py-12">
      <p className="eyebrow">My Account</p>
      <h1 className="mt-2 font-display text-display text-ink">My Orders</h1>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-sand p-16 text-center">
          <p className="font-display text-2xl text-ink">No orders yet</p>
          <p className="mt-2 text-charcoal">When you place an order it will appear here.</p>
          <Link href="/shop" className="btn-primary mt-6">Start shopping</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-sand bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand pb-4">
                <div>
                  <p className="font-display text-xl text-ink">Order #{o.number}</p>
                  <p className="text-sm text-stone">
                    Placed {o.createdAt.toLocaleDateString()} · {o.channel}
                  </p>
                </div>
                <div className="text-right">
                  <StatusPill status={o.status} />
                  <p className="mt-1 text-charcoal">{formatPrice(o.total)}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {o.items.map((it) => (
                  <li key={it.id} className="flex justify-between text-charcoal">
                    <span>
                      {it.name} <span className="text-stone">· {it.size} · x{it.quantity}</span>
                    </span>
                    <span>{formatPrice(it.unitPrice * it.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    fulfilled: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${map[status] ?? "bg-sand text-charcoal"}`}>
      {status}
    </span>
  );
}
