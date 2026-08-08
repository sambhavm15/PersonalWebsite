import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Downloads a spreadsheet (CSV, opens in Excel/Sheets) of the full inventory,
// one row per size. ?type=orders exports the order log instead.
export async function GET(req: Request) {
  const admin = await getAdmin();
  if (!admin) return new Response("Unauthorized", { status: 401 });

  const type = new URL(req.url).searchParams.get("type") ?? "inventory";
  const stamp = new Date().toISOString().slice(0, 10);

  if (type === "orders") {
    const orders = await prisma.order.findMany({
      orderBy: { number: "desc" },
      include: { items: true },
    });
    const header = [
      "Order #", "Date", "Status", "Customer", "Email", "Phone", "Item", "Size", "Qty", "Unit Price", "Line Total", "Order Total",
    ];
    const rows: string[] = [header.map(csvCell).join(",")];
    for (const o of orders) {
      for (const it of o.items) {
        rows.push(
          [
            o.number,
            o.createdAt.toISOString().slice(0, 10),
            o.status,
            o.customerName,
            o.customerEmail,
            o.customerPhone ?? "",
            it.name,
            it.size,
            it.quantity,
            it.unitPrice,
            it.unitPrice * it.quantity,
            o.total,
          ]
            .map(csvCell)
            .join(",")
        );
      }
    }
    return new Response(rows.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="sanskriti-orders-${stamp}.csv"`,
      },
    });
  }

  const products = await prisma.product.findMany({
    include: { category: true, variants: { orderBy: { id: "asc" } } },
    orderBy: { name: "asc" },
  });
  const header = [
    "Product", "Category", "Collection", "Size", "SKU", "Stock", "Price", "Compare At", "Status", "Featured", "New", "Stock Value",
  ];
  const rows: string[] = [header.map(csvCell).join(",")];
  for (const p of products) {
    for (const v of p.variants) {
      rows.push(
        [
          p.name,
          p.category.name,
          p.collection ?? "",
          v.size,
          v.sku ?? "",
          v.stock,
          p.price,
          p.compareAt ?? "",
          p.status,
          p.featured ? "yes" : "no",
          p.isNew ? "yes" : "no",
          v.stock * p.price,
        ]
          .map(csvCell)
          .join(",")
      );
    }
  }
  return new Response(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sanskriti-inventory-${stamp}.csv"`,
    },
  });
}
