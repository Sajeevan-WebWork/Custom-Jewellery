"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Gem, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { extractStoragePath, formatCurrency } from "@/lib/dashboard";
import { Button, EmptyState, Input, PageHeader, Panel } from "@/components/dashboard/ui";

type ProductRow = {
  id: string;
  name: string;
  price: number;
  stock: boolean | null;
  image_urls: string[] | null;
  categories: { name: string } | null;
};

type RawProductRow = Omit<ProductRow, "categories"> & {
  categories: { name: string } | { name: string }[] | null;
};

export default function DashboardProductsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("products")
      .select("id, name, price, stock, image_urls, categories(name)")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      const normalized = ((data ?? []) as unknown as RawProductRow[]).map((product) => ({
        ...product,
        categories: Array.isArray(product.categories) ? product.categories[0] ?? null : product.categories,
      }));
      setProducts(normalized);
      setError("");
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(term) ||
        product.categories?.name?.toLowerCase().includes(term)
      );
    });
  }, [products, search]);

  const handleDelete = async (product: ProductRow) => {
    const confirmed = window.confirm(`Delete ${product.name}? This action cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(product.id);

    try {
      const paths = (product.image_urls ?? [])
        .map((image) => extractStoragePath(image))
        .filter((value): value is string => Boolean(value));

      if (paths.length) {
        const { error: storageError } = await supabase.storage.from("products").remove(paths);
        if (storageError) throw storageError;
      }

      const { error: deleteError } = await supabase.from("products").delete().eq("id", product.id);
      if (deleteError) throw deleteError;

      await loadProducts();
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "Unable to delete product.";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Products"
        description="Browse your catalogue, search by category, and keep stock data fresh."
        action={
          <Link href="/dashboard/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        }
      />

      <Panel className="p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            className="pl-11"
            placeholder="Search by product or category"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </Panel>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {loading ? (
        <Panel className="p-6 text-sm text-[var(--text-dim)]">Loading products…</Panel>
      ) : filtered.length ? (
        <Panel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)] text-left text-sm">
              <thead className="bg-[var(--surface)] text-[var(--text-muted)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Image</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((product) => (
                  <tr key={product.id} className="bg-[var(--surface-2)]/45">
                    <td className="px-6 py-4">
                      {product.image_urls?.[0] ? (
                        <img
                          src={product.image_urls[0]}
                          alt={product.name}
                          className="h-14 w-14 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                          <Gem className="h-5 w-5 text-[var(--gold)]" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[var(--text)]">{product.name}</td>
                    <td className="px-6 py-4 text-[var(--text-dim)]">{product.categories?.name || "Unassigned"}</td>
                    <td className="px-6 py-4 text-[var(--gold)]">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          product.stock ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"
                        }`}
                      >
                        {product.stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/products/${product.id}`}>
                          <Button variant="secondary" className="gap-2">
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="gap-2 text-rose-300 hover:text-rose-200"
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingId === product.id ? "Deleting…" : "Delete"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : (
        <EmptyState
          icon={Gem}
          title="No products yet"
          body="Start your catalogue with your first signature piece and it will appear here."
        />
      )}
    </div>
  );
}
