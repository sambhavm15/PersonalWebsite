import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "New Product · Sanskriti Studio" };

export default function NewProductPage() {
  return (
    <AdminShell title="New Product">
      <ProductForm />
    </AdminShell>
  );
}
