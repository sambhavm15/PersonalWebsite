import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm, { type ProductFormValues } from "@/components/admin/ProductForm";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Product · Sanskriti Studio" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: { orderBy: { id: "asc" } },
      images: { orderBy: { position: "asc" } },
    },
  });
  if (!product) notFound();

  const initial: ProductFormValues = {
    id: product.id,
    name: product.name,
    categorySlug: product.category.slug,
    collection: product.collection ?? "",
    price: product.price,
    compareAt: product.compareAt ?? "",
    description: product.description,
    story: product.story ?? "",
    fabric: product.fabric ?? "",
    color: product.color ?? "",
    care: product.care ?? "",
    featured: product.featured,
    isNew: product.isNew,
    status: product.status as ProductFormValues["status"],
    variants: product.variants.map((v) => ({ size: v.size, stock: v.stock, sku: v.sku ?? undefined })),
    images: product.images.map((i) => ({ url: i.url, alt: i.alt ?? "" })),
  };

  return (
    <AdminShell title="Edit Product" action={<DeleteProductButton id={product.id} />}>
      <ProductForm initial={initial} />
    </AdminShell>
  );
}
