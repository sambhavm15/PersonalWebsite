import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import BarChart from "@/components/admin/BarChart";
import { getDashboardStats } from "@/lib/admin-stats";
import { formatPrice } from "@/data/site";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard · Sanskriti Studio" };

export default async function AdminDashboard() {
  const s = await getDashboardStats();

  const kpis = [
    { label: "Products", value: String(s.totalProducts) },
    { label: "Units in stock", value: s.totalUnits.toLocaleString() },
    { label: "Inventory value", value: formatPrice(s.inventoryValue) },
    { label: "Revenue (confirmed)", value: formatPrice(s.revenue) },
  ];

  return (
    <AdminShell
      title="Dashboard"
      action={
        <>
          <a href="/api/admin/export" className="btn-gold py-2 text-xs">
            Export Inventory
          </a>
          <Link href="/admin/products/new" className="btn-primary py-2 text-xs">
            + New Product
          </Link>
        </>
      }
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-sand bg-white p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-stone">{k.label}</p>
            <p className="mt-2 font-display text-3xl text-ink">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <MiniStat label="Pending orders" value={s.pendingCount} href="/admin/orders" tone="amber" />
        <MiniStat label="Out of stock" value={s.outOfStock} href="/admin/products" tone="red" />
        <MiniStat label="Total orders" value={s.totalOrders} href="/admin/orders" tone="green" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Revenue by month */}
        <Panel title="Revenue · last 6 months">
          <BarChart data={s.revenueByMonth} formatValue={(v) => formatPrice(v)} />
        </Panel>

        {/* Stock by category */}
        <Panel title="Stock by category">
          <BarChart
            data={s.stockByCategory.map((c) => ({ label: c.name, value: c.units }))}
          />
        </Panel>

        {/* Best sellers */}
        <Panel title="Best sellers">
          {s.bestSellers.length === 0 ? (
            <Empty>No confirmed sales yet.</Empty>
          ) : (
            <BarChart
              data={s.bestSellers.map((b) => ({ label: b.name, value: b.units }))}
            />
          )}
        </Panel>

        {/* Low stock */}
        <Panel title="Low stock — restock soon">
          {s.lowStock.length === 0 ? (
            <Empty>Everything is well stocked.</Empty>
          ) : (
            <ul className="divide-y divide-sand">
              {s.lowStock.slice(0, 8).map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5">
                  <Link href={`/admin/products/${p.id}`} className="text-sm text-charcoal hover:text-gold-deep">
                    {p.name}
                  </Link>
                  <span className={`text-sm font-medium ${p.stock === 0 ? "text-red-600" : "text-amber-600"}`}>
                    {p.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </AdminShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-sand bg-white p-6">
      <h2 className="mb-4 font-display text-xl text-ink">{title}</h2>
      {children}
    </div>
  );
}

function MiniStat({
  label,
  value,
  href,
  tone,
}: {
  label: string;
  value: number;
  href: string;
  tone: "amber" | "red" | "green";
}) {
  const tones = {
    amber: "text-amber-600",
    red: "text-red-600",
    green: "text-green-600",
  };
  return (
    <Link href={href} className="rounded-2xl border border-sand bg-white p-5 card-hover">
      <p className="text-xs uppercase tracking-[0.14em] text-stone">{label}</p>
      <p className={`mt-1 font-display text-3xl ${tones[tone]}`}>{value}</p>
    </Link>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-sm text-stone">{children}</p>;
}
