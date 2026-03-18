import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { BestSellerSection } from "@/components/storefront/best-seller-section";
import { CategorySection } from "@/components/storefront/category-section";
import { HeroSection } from "@/components/storefront/hero";
import { NewCollectionSection } from "@/components/storefront/new-collection-section";
import { StorySection } from "@/components/storefront/story-section";

export default function HomePage() {
  return (
    <StorefrontShell>
      <HeroSection />
      <CategorySection />
      <BestSellerSection />
      <NewCollectionSection />
      <StorySection />
    </StorefrontShell>
  );
}
