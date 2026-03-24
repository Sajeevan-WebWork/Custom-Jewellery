import { StorefrontProductDetailsPage } from "@/components/storefront/product-details-page";
import { StorefrontShell } from "@/components/storefront/storefront-shell";

export default async function ProductDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <StorefrontShell>
      <StorefrontProductDetailsPage productId={id} />
    </StorefrontShell>
  );
}
