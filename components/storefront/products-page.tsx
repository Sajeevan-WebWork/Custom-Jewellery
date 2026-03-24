"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Search, ShoppingBag } from "lucide-react";
import { useStorefrontCart } from "@/context/StorefrontCartContext";
import { formatCurrency } from "@/lib/dashboard";
import { createClient } from "@/lib/supabase";

const defaultCategories = ["All"];
const fallbackImage = "/images/hero-background.jpg";

type Category = {
  id: string;
  name: string;
};

type StorefrontProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  metal: string;
  created_at: string;
};

type ProductRow = {
  id: string;
  name: string;
  price: number;
  material: string | null;
  image_urls: string[] | null;
  created_at: string;
  stock: boolean | null;
  categories: { name: string } | null;
};

type RawProductRow = Omit<ProductRow, "categories"> & {
  categories: { name: string } | { name: string }[] | null;
};

export function StorefrontProductsPage({
  initialCategory = "All",
}: {
  initialCategory?: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const { addToCart } = useStorefrontCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || "All",
  );
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [selectedMetal, setSelectedMetal] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.details || data.error || "Failed to fetch categories",
          );
        }

        const backendCategories = Array.isArray(data)
          ? data
              .map((category: Category) => category.name?.trim())
              .filter((name): name is string => Boolean(name))
          : [];

        setCategories(["All", ...new Set(backendCategories)]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(defaultCategories);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory("All");
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const { data, error: fetchError } = await supabase
          .from("products")
          .select(
            "id, name, price, material, image_urls, created_at, stock, categories(name)",
          )
          .eq("stock", true)
          .order("created_at", { ascending: false });

        if (fetchError) {
          throw fetchError;
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
              image: product.image_urls?.[0] || fallbackImage,
              metal: product.material?.trim() || "Other",
              created_at: product.created_at,
            };
          },
        );

        setProducts(normalized);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load products";
        console.error("Error fetching products:", message);
        setProducts([]);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [supabase]);

  const metals = useMemo(() => {
    const backendMetals = products
      .map((product) => product.metal.trim())
      .filter(Boolean);

    return ["All", ...new Set(backendMetals)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const result = [...products].filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesMetal =
        selectedMetal === "All" || product.metal === selectedMetal;
      return matchesSearch && matchesCategory && matchesMetal;
    });

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, searchTerm, selectedCategory, selectedMetal, sortBy]);

  return (
    <div className="min-h-screen bg-bg-content pt-16">
      <div className="bg-bg-primary px-6 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-5xl font-serif uppercase tracking-[0.2em] text-white md:text-6xl"
        >
          Our Collection
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm uppercase tracking-widest text-accent-gold"
        >
          Discover refined luxury in every detail.
        </motion.p>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col gap-12 lg:flex-row">
          <aside
            className={`space-y-10 transition-all duration-500 lg:w-64 ${isFilterOpen ? "translate-x-0 opacity-100" : "hidden w-0 -translate-x-10 overflow-hidden opacity-0 lg:block"}`}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search jewels..."
                className="w-full border-b border-accent-gold/30 bg-transparent py-2 pl-8 text-text-dark outline-none transition-colors focus:border-accent-gold"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <Search
                className="absolute left-0 top-2 text-accent-gold"
                size={18}
              />
            </div>

            <div>
              <h4 className="mb-6 border-b border-text-dark/10 pb-2 text-xs font-bold uppercase tracking-widest text-text-dark">
                Categories
              </h4>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="group flex cursor-pointer items-center space-x-3"
                  >
                    <input
                      type="radio"
                      name="category"
                      className="hidden"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                    />
                    <span
                      className={`h-3 w-3 rounded-full border border-accent-gold transition-all ${selectedCategory === category ? "bg-accent-gold" : "group-hover:bg-accent-gold/20"}`}
                    />
                    <span
                      className={`text-sm uppercase tracking-wider transition-colors ${selectedCategory === category ? "font-bold text-accent-gold" : "text-text-dark/60"}`}
                    >
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div hidden>
              <h4 className="mb-6 border-b border-text-dark/10 pb-2 text-xs font-bold uppercase tracking-widest text-text-dark">
                Metal Type
              </h4>
              <div className="space-y-3">
                {metals.map((metal) => (
                  <label
                    key={metal}
                    className="group flex cursor-pointer items-center space-x-3"
                  >
                    <input
                      type="radio"
                      name="metal"
                      className="hidden"
                      checked={selectedMetal === metal}
                      onChange={() => setSelectedMetal(metal)}
                    />
                    <span
                      className={`h-3 w-3 rounded-full border border-accent-gold transition-all ${selectedMetal === metal ? "bg-accent-gold" : "group-hover:bg-accent-gold/20"}`}
                    />
                    <span
                      className={`text-sm uppercase tracking-wider transition-colors ${selectedMetal === metal ? "font-bold text-accent-gold" : "text-text-dark/60"}`}
                    >
                      {metal}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-grow">
            <div className="mb-10 flex items-center justify-between border-b border-text-dark/10 pb-6">
              <button
                onClick={() => setIsFilterOpen((open) => !open)}
                className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-text-dark transition-colors hover:text-accent-gold"
              >
                <Filter size={16} />
                <span>{isFilterOpen ? "Hide Filters" : "Show Filters"}</span>
              </button>

              <div className="flex items-center space-x-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-dark/40">
                  Sort By
                </span>
                <select
                  className="cursor-pointer bg-transparent text-xs font-bold uppercase tracking-widest text-text-dark outline-none"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="best">Best Seller</option>
                </select>
              </div>
            </div>

            {error ? (
              <div className="py-24 text-center">
                <h3 className="text-2xl italic text-red-500">{error}</h3>
              </div>
            ) : loading ? (
              <div className="flex justify-center py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-gold border-t-transparent" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="group"
                    >
                      <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-white shadow-sm">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 transition-all duration-500 group-hover:bg-black/5" />
                        <button
                          onClick={() => addToCart(product)}
                          className="absolute bottom-6 left-4 right-4 flex items-center justify-center space-x-2 bg-bg-primary px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-all duration-500 hover:bg-accent-gold hover:text-bg-primary md:bottom-4 md:translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                        >
                          <ShoppingBag size={14} />
                          <span>Add to Cart</span>
                        </button>
                      </div>

                      <div className="text-center">
                        <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-accent-bronze">
                          {product.category}
                        </span>
                        <h3 className="mb-2 text-lg tracking-wide text-text-dark transition-colors group-hover:text-accent-gold">
                          {product.name}
                        </h3>
                        <p className="font-medium text-accent-gold">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {!loading && !error && filteredProducts.length === 0 ? (
              <div className="py-24 text-center">
                <h3 className="text-2xl italic text-text-dark/40">
                  No pieces found matching your criteria.
                </h3>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedMetal("All");
                  }}
                  className="mt-6 border-b border-accent-gold pb-1 text-xs font-bold uppercase tracking-widest text-accent-gold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
