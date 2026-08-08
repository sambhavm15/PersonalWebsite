import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const nav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
];

export default function AdminShell({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto flex max-w-editorial flex-col gap-0 lg:flex-row">
        {/* Sidebar */}
        <aside className="shrink-0 border-b border-sand bg-ink px-6 py-6 text-ivory lg:min-h-screen lg:w-60 lg:border-b-0 lg:border-r lg:border-white/10">
          <Link href="/admin" className="block">
            <span className="font-display text-2xl">Sanskriti</span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-gold-soft">
              Studio
            </span>
          </Link>
          <nav className="mt-8 flex gap-2 lg:flex-col">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-2 text-sm text-ivory/75 transition hover:bg-white/5 hover:text-ivory"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 hidden lg:block">
            <Link href="/" className="text-xs text-ivory/50 hover:text-ivory">
              ← Back to store
            </Link>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 px-6 py-8 lg:px-10">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-display text-3xl text-ink">{title}</h1>
            <div className="flex items-center gap-3">
              {action}
              <LogoutButton className="btn-gold py-2 text-xs" />
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
