import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/data/site";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products · Sanskriti Studio" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, variants: true },
  });

  return (
    <AdminShell
      title="Products & Inventory"
      action={
        <>
          <a href="/api/admin/export" className="btn-gold py-2 text-xs">Export CSV</a>
          <Link href="/admin/products/new" className="btn-primary py-2 text-xs">+ New Product</Link>
        </>
      }
    >
      <p className="mb-4 text-sm text-stone">{products.length} products</p>

      <div className="overflow-x-auto rounded-2xl border border-sand bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-sand bg-cream/60 text-xs uppercase tracking-[0.1em] text-stone">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand">
            {products.map((p) => {
              const stock = p.variants.reduce((s, v) => s + v.stock, 0);
              return (
                <tr key={p.id} className="hover:bg-cream/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p.id}`} className="font-medium text-ink hover:text-gold-deep">
                      {p.name}
                    </Link>
                    <div className="mt-0.5 flex gap-1">
                      {p.featured && <Tag>Featured</Tag>}
                      {p.isNew && <Tag>New</Tag>}
                      {p.collection && <Tag>{p.collection}</Tag>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-charcoal">{p.category.name}</td>
                  <td className="px-4 py-3 text-charcoal">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={stock === 0 ? "text-red-600" : stock <= 3 ? "text-amber-600" : "text-charcoal"}>
                      {stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${
                      p.status === "active" ? "bg-green-100 text-green-800" :
                      p.status === "draft" ? "bg-amber-100 text-amber-800" :
                      "bg-sand text-charcoal"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="text-gold-deep hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-cream px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-stone">
      {children}
    </span>
  );
}
