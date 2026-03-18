import type { ReactNode } from "react";
import { StorefrontCartProvider } from "@/context/StorefrontCartContext";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { StorefrontFooter } from "@/components/storefront/footer";
import { StorefrontHeader } from "@/components/storefront/header";

export function StorefrontShell({ children }: { children: ReactNode }) {
  return (
    <StorefrontCartProvider>
      <div className="min-h-screen bg-bg-primary text-white">
        <StorefrontHeader />
        <CartDrawer />
        <main>{children}</main>
        <StorefrontFooter />
      </div>
    </StorefrontCartProvider>
  );
}
