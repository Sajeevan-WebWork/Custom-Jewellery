"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Eye, ShoppingBag } from "lucide-react";
import { useStorefrontCart } from "@/context/StorefrontCartContext";
import { formatCurrency } from "@/lib/dashboard";
import { createClient } from "@/lib/supabase";

type StorefrontProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
};

type ProductRow = {
  id: string;
  name: string;
  price: number;
  image_urls: string[] | null;
  categories: { name: string } | null;
};

type RawProductRow = Omit<ProductRow, "categories"> & {
  categories: { name: string } | { name: string }[] | null;
};

export function BestSellerSection() {
  const supabase = useMemo(() => createClient(), []);
  const { addToCart } = useStorefrontCart();
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, image_urls, categories(name)")
          .eq("stock", true)
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) {
          throw error;
        }

        const normalized = ((data ?? []) as unknown as RawProductRow[]).map(
          (product) => {
            const categoryData = Array.isArray(product.categories)
              ? (product.categories[0] ?? null)
              : product.categories;

            return {
              id: product.id,
              name: product.name,
              price: Number(product.price ?? 0),
              category: categoryData?.name || "Unassigned",
              image: product.image_urls?.[0] || "/images/hero-background.jpg",
            };
          },
        );

        setProducts(normalized);
      } catch (error) {
        console.error("Error fetching best seller products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [supabase]);

  return (
    <section className="bg-bg-primary py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-col items-end justify-between space-y-4 md:flex-row md:space-y-0">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mb-3 block text-xs font-bold uppercase tracking-[0.3em] text-accent-gold"
            >
              Exquisite Craftsmanship
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl uppercase tracking-widest text-white md:text-5xl"
            >
              Our Best Sellers
            </motion.h2>
          </div>
          <Link
            href="/products"
            className="border-b border-accent-gold/30 pb-1 text-sm uppercase tracking-widest text-accent-gold transition-all hover:border-accent-gold"
          >
            View All Collection
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-gold border-t-transparent" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-bg-content">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-full space-x-2 p-4 transition-transform duration-500 group-hover:translate-y-0">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex flex-grow items-center justify-center space-x-2 bg-bg-primary px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-accent-gold hover:text-bg-primary"
                    >
                      <ShoppingBag size={14} />
                      <span>Add to Cart</span>
                    </button>
                    <Link
                      href={`/products/${product.id}`}
                      className="bg-white/90 p-3 text-bg-primary transition-all hover:bg-white"
                    >
                      <Eye size={18} />
                    </Link>
                  </div>
                </div>

                <div className="text-center">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-accent-bronze">
                    {product.category}
                  </span>
                  <h3 className="mb-2 text-lg tracking-wide text-white transition-colors group-hover:text-accent-gold">
                    {product.name}
                  </h3>
                  <div className="mx-auto mb-2 h-[1px] w-8 bg-accent-gold/30" />
                  <p className="font-medium text-accent-gold">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
