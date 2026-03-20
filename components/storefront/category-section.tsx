"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
  count: number;
  image?: string;
  image_url?: string;
  link: string;
};

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.details || data.error || "Failed to fetch categories",
          );
        }

        setCategories(data);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("Error fetching categories:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="padding-block bg-bg-content py-24">
      <div className="container mx-auto my-6 px-6">
        <div className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-3 block text-xs font-bold uppercase tracking-[0.3em] text-accent-bronze"
          >
            Curated Selection
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl text-text-dark md:text-5xl"
          >
            Shop by Category
          </motion.h2>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-gold border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="text-center text-gray-500">
            No categories available
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={cat.link}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-sm"
                >
                  <Image
                    src={
                      cat.image_url ||
                      cat.image ||
                      "/images/hero-background.jpg"
                    }
                    alt={cat.name}
                    fill
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/20" />
                  <div className="absolute bottom-10 left-10">
                    <span className="mb-2 block translate-y-4 text-xs uppercase tracking-widest text-white/70 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {cat.count} Piece{cat.count !== 1 ? "s" : ""}
                    </span>
                    <h3 className="text-2xl tracking-wide text-white transition-colors duration-500 group-hover:text-accent-gold">
                      {cat.name}
                    </h3>
                  </div>
                  <div className="absolute inset-0 border-0 border-accent-gold/30 transition-all duration-500 group-hover:border-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
