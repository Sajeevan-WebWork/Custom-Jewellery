import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Custom Jewellery",
  description: "Luxury jewellery storefront with a Supabase-powered admin dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-[family-name:var(--font-body)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
