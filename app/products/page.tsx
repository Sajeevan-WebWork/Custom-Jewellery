import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { StorefrontProductsPage } from "@/components/storefront/products-page";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;

  return (
    <StorefrontShell>
      <StorefrontProductsPage initialCategory={params.category || "All"} />
    </StorefrontShell>
  );
}
