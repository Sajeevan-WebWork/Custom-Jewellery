import { PageHeader } from "@/components/dashboard/ui";
import { ProductForm } from "@/components/dashboard/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Add Product"
        description="Create a new product entry, upload images, and assign it to a category."
      />
      <ProductForm />
    </div>
  );
}

