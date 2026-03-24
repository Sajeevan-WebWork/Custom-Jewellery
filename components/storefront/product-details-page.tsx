"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useStorefrontCart } from "@/context/StorefrontCartContext";
import { formatCurrency } from "@/lib/dashboard";
import { createClient } from "@/lib/supabase";

const fallbackImage = "/images/hero-background.jpg";

type ProductDetails = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  material: string | null;
  image_urls: string[];
  stock: boolean;
  category: string;
};

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  material: string | null;
  image_urls: string[] | null;
  stock: boolean | null;
  categories: { name: string } | null;
};

type RawProductRow = Omit<ProductRow, "categories"> & {
  categories: { name: string } | { name: string }[] | null;
};

export function StorefrontProductDetailsPage({
  productId,
}: {
  productId: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const { addToCart } = useStorefrontCart();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [selectedImage, setSelectedImage] = useState(fallbackImage);
  const [relatedProducts, setRelatedProducts] = useState<ProductDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const { data, error: fetchError } = await supabase
          .from("products")
          .select(
            "id, name, description, price, material, image_urls, stock, categories(name)",
          )
          .eq("id", productId)
          .eq("stock", true)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        const row = data as unknown as RawProductRow;
        const categoryData = Array.isArray(row.categories)
          ? (row.categories[0] ?? null)
          : row.categories;

        const normalized = {
          id: row.id,
          name: row.name,
          description: row.description,
          price: Number(row.price ?? 0),
          material: row.material,
          image_urls:
            row.image_urls && row.image_urls.length
              ? row.image_urls
              : [fallbackImage],
          stock: Boolean(row.stock),
          category: categoryData?.name || "Unassigned",
        };

        setProduct(normalized);
        setSelectedImage(normalized.image_urls[0]);

        const relatedResponse = await supabase
          .from("products")
          .select(
            "id, name, description, price, material, image_urls, stock, categories(name)",
          )
          .eq("stock", true)
          .neq("id", productId)
          .order("created_at", { ascending: false })
          .limit(3);

        if (relatedResponse.error) {
          throw relatedResponse.error;
        }

        const normalizedRelated = (
          (relatedResponse.data ?? []) as unknown as RawProductRow[]
        )
          .map((item) => {
            const itemCategory = Array.isArray(item.categories)
              ? (item.categories[0] ?? null)
              : item.categories;

            return {
              id: item.id,
              name: item.name,
              description: item.description,
              price: Number(item.price ?? 0),
              material: item.material,
              image_urls:
                item.image_urls && item.image_urls.length
                  ? item.image_urls
                  : [fallbackImage],
              stock: Boolean(item.stock),
              category: itemCategory?.name || "Unassigned",
            };
          })
          .filter((item) => item.category === normalized.category)
          .slice(0, 3);

        setRelatedProducts(normalizedRelated);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load product details.";
        setError(message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-content pt-16">
        <div className="container mx-auto px-6 py-24">
          <div className="flex justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-gold border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen bg-bg-content pt-16">
        <div className="container mx-auto px-6 py-24 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-accent-bronze">
            Product Unavailable
          </p>
          <h1 className="mt-4 text-4xl text-text-dark">
            This piece could not be loaded.
          </h1>
          <p className="mt-4 text-text-dark/60">
            {error || "Please try another product."}
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 border border-accent-gold px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-gold transition hover:bg-accent-gold hover:text-bg-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-content pt-16">
      <section className="bg-bg-primary px-6 py-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.32em] text-accent-gold"
        >
          {product.category}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-4 text-4xl uppercase tracking-[0.14em] text-white md:text-6xl"
        >
          {product.name}
        </motion.h1>
      </section>

      <section className="container mx-auto px-6 py-16">
        <Link
          href="/products"
          className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-text-dark/60 transition hover:text-accent-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collection
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden bg-white shadow-sm">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {product.image_urls.length > 1 ? (
              <div className="grid grid-cols-4 gap-4">
                {product.image_urls.map((image) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`relative aspect-square overflow-hidden border transition ${
                      selectedImage === image
                        ? "border-accent-gold"
                        : "border-transparent hover:border-accent-gold/40"
                    }`}
                  >
                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="border-b border-text-dark/10 pb-8">
              <p className="text-xs uppercase tracking-[0.26em] text-accent-bronze">
                Signature Piece
              </p>
              <p className="mt-4 text-3xl text-accent-gold">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="space-y-6 py-8 text-text-dark/70">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-text-dark/40">
                    Category
                  </p>
                  <p className="mt-2 text-base text-text-dark">
                    {product.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-text-dark/40">
                    Material
                  </p>
                  <p className="mt-2 text-base text-text-dark">
                    {product.material || "Custom finish"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-text-dark/40">
                  Description
                </p>
                <p className="mt-3 max-w-xl leading-7 text-text-dark/70">
                  {product.description ||
                    "Crafted with a refined finish and elevated detailing for timeless occasions."}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-text-dark/10 pt-8 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    image: product.image_urls[0],
                  })
                }
                className="inline-flex items-center justify-center gap-2 bg-bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-accent-gold hover:text-bg-primary"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="inline-flex items-center justify-center border border-text-dark/10 px-8 py-4 text-xs font-bold uppercase tracking-[0.22em] text-text-dark transition hover:border-accent-gold hover:text-accent-gold"
              >
                More in {product.category}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="bg-bg-primary py-20">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-accent-gold">
                Similar Pieces
              </p>
              <h2 className="mt-4 text-4xl uppercase tracking-[0.16em] text-white">
                You May Also Love
              </h2>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group"
                >
                  <div className="relative mb-5 aspect-[4/5] overflow-hidden bg-bg-content">
                    <img
                      src={item.image_urls[0]}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-accent-bronze">
                      {item.category}
                    </span>
                    <h3 className="text-lg tracking-wide text-white transition-colors group-hover:text-accent-gold">
                      {item.name}
                    </h3>
                    <p className="mt-2 font-medium text-accent-gold">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
