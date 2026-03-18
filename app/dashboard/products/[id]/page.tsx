import { PageHeader } from "@/components/dashboard/ui";
import { ProductForm } from "@/components/dashboard/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit Product"
        description="Update product details, refresh imagery, and adjust availability."
      />
      <ProductForm productId={id} />
    </div>
  );
}

