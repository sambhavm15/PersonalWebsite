import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getCounts, getOrders } from "@/lib/user-data";
import LogoutButton from "@/components/LogoutButton";
import { ArrowRight } from "@/components/icons";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Account · Sanskriti Clothing" };

export default async function AccountPage() {
  const session = (await getSession())!; // guaranteed by middleware
  const [counts, orders] = await Promise.all([
    getCounts(session.id),
    getOrders(session.id),
  ]);

  const tiles = [
    { label: "Orders", value: orders.length, href: "/account/orders" },
    { label: "In Cart", value: counts.cart, href: "/cart" },
    { label: "Wishlist", value: counts.wishlist, href: "/wishlist" },
  ];

  return (
    <div className="container-editorial py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">My Account</p>
          <h1 className="mt-2 font-display text-display text-ink">
            Hello, {session.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-charcoal">{session.email}</p>
        </div>
        <div className="flex gap-3">
          {session.role === "admin" && (
            <Link href="/admin" className="btn-primary">Admin Dashboard</Link>
          )}
          <LogoutButton />
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="rounded-2xl border border-sand bg-white p-6 card-hover"
          >
            <p className="text-sm uppercase tracking-[0.14em] text-stone">{t.label}</p>
            <p className="mt-2 font-display text-4xl text-ink">{t.value}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-gold-deep">
              View <ArrowRight />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-display text-2xl text-ink">Recent Orders</h2>
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sand p-10 text-center text-charcoal">
            You have not placed any orders yet.{" "}
            <Link href="/shop" className="text-gold-deep link-underline">Start shopping</Link>.
          </div>
        ) : (
          <ul className="divide-y divide-sand rounded-2xl border border-sand bg-white">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-ink">Order #{o.number}</p>
                  <p className="text-sm text-stone">
                    {o.createdAt.toLocaleDateString()} · {o.items.length} item(s)
                  </p>
                </div>
                <StatusPill status={o.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
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
