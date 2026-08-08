import AdminShell from "@/components/admin/AdminShell";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/data/site";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders · Sanskriti Studio" };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { number: "desc" },
    include: { items: true },
  });

  return (
    <AdminShell
      title="Orders"
      action={
        <a href="/api/admin/export?type=orders" className="btn-gold py-2 text-xs">
          Export CSV
        </a>
      }
    >
      <div className="mb-4 rounded-xl border border-sand bg-white p-4 text-sm text-charcoal">
        Moving an order to <b>Confirmed</b>, <b>Shipped</b> or <b>Fulfilled</b>{" "}
        automatically reduces stock. Marking it <b>Cancelled</b> restores it.
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sand p-16 text-center text-charcoal">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-sand bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sand pb-4">
                <div>
                  <p className="font-display text-xl text-ink">Order #{o.number}</p>
                  <p className="text-sm text-stone">
                    {o.createdAt.toLocaleString()} · via {o.channel}
                  </p>
                  <p className="mt-2 text-sm text-charcoal">
                    {o.customerName} · {o.customerEmail}
                    {o.customerPhone ? ` · ${o.customerPhone}` : ""}
                  </p>
                  {o.note && <p className="mt-1 text-sm italic text-stone">“{o.note}”</p>}
                </div>
                <div className="text-right">
                  <p className="mb-2 font-display text-2xl text-ink">{formatPrice(o.total)}</p>
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                  {o.inventoryApplied && (
                    <p className="mt-1 text-[11px] text-green-700">Stock applied</p>
                  )}
                </div>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm">
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
    </AdminShell>
  );
}
