"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Tags, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { slugify } from "@/lib/dashboard";
import { Button, EmptyState, Field, Input, PageHeader, Panel, Textarea } from "@/components/dashboard/ui";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type ProductLink = {
  category_id: string | null;
};

export default function DashboardCategoriesPage() {
  const supabase = useMemo(() => createClient(), []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productLinks, setProductLinks] = useState<ProductLink[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    const [{ data: categoryData, error: categoryError }, { data: productsData, error: productsError }] = await Promise.all([
      supabase.from("categories").select("id, name, slug, description").order("created_at", { ascending: false }),
      supabase.from("products").select("category_id"),
    ]);

    if (categoryError || productsError) {
      setError(categoryError?.message || productsError?.message || "Unable to load categories.");
    } else {
      setCategories((categoryData as Category[]) ?? []);
      setProductLinks((productsData as ProductLink[]) ?? []);
      setError("");
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const counts = useMemo(() => {
    return productLinks.reduce<Record<string, number>>((acc, item) => {
      if (!item.category_id) return acc;
      acc[item.category_id] = (acc[item.category_id] ?? 0) + 1;
      return acc;
    }, {});
  }, [productLinks]);

  const createCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const { error: createError } = await supabase.from("categories").insert({
      name: name.trim(),
      slug: slugify(name),
      description: description.trim() || null,
    });

    if (createError) {
      setError(createError.message);
      setSaving(false);
      return;
    }

    setName("");
    setDescription("");
    setSaving(false);
    await loadCategories();
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(category.description || "");
  };

  const saveEdit = async (id: string) => {
    const { error: updateError } = await supabase
      .from("categories")
      .update({
        name: editName.trim(),
        slug: slugify(editName),
        description: editDescription.trim() || null,
      })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setEditingId(null);
    await loadCategories();
  };

  const removeCategory = async (category: Category) => {
    if ((counts[category.id] ?? 0) > 0) {
      setError("This category is linked to products. Reassign those products before deleting it.");
      return;
    }

    if (!window.confirm(`Delete ${category.name}?`)) return;

    const { error: deleteError } = await supabase.from("categories").delete().eq("id", category.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    await loadCategories();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Categories"
        description="Manage category structure, descriptions, and product associations from one place."
      />

      <Panel className="p-6">
        <form className="grid gap-5 md:grid-cols-[1fr_1.2fr_auto]" onSubmit={createCategory}>
          <Field label="Name">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Bridal" required />
          </Field>
          <Field label="Description">
            <Textarea
              className="min-h-0"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Curated pieces for bridal celebrations."
            />
          </Field>
          <div className="flex items-end">
            <Button type="submit" className="w-full" disabled={saving || !name.trim()}>
              {saving ? "Adding…" : "Add Category"}
            </Button>
          </div>
        </form>
        <p className="mt-3 text-sm text-[var(--text-dim)]">Slug preview: {slugify(name || "new-category")}</p>
      </Panel>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {loading ? (
        <Panel className="p-6 text-sm text-[var(--text-dim)]">Loading categories…</Panel>
      ) : categories.length ? (
        <Panel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)] text-left text-sm">
              <thead className="bg-[var(--surface)] text-[var(--text-muted)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Products</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {categories.map((category) => (
                  <tr key={category.id} className="bg-[var(--surface-2)]/45 align-top">
                    <td className="px-6 py-4">
                      {editingId === category.id ? (
                        <Input value={editName} onChange={(event) => setEditName(event.target.value)} />
                      ) : (
                        <span className="text-[var(--text)]">{category.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-dim)]">
                      {editingId === category.id ? slugify(editName) : category.slug}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === category.id ? (
                        <Textarea
                          className="min-h-24"
                          value={editDescription}
                          onChange={(event) => setEditDescription(event.target.value)}
                        />
                      ) : (
                        <span className="text-[var(--text-dim)]">{category.description || "—"}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[var(--gold)]">{counts[category.id] ?? 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {editingId === category.id ? (
                          <>
                            <Button onClick={() => saveEdit(category.id)}>Save</Button>
                            <Button variant="secondary" onClick={() => setEditingId(null)}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="secondary" className="gap-2" onClick={() => startEdit(category)}>
                              <Pencil className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button variant="ghost" className="gap-2 text-rose-300" onClick={() => removeCategory(category)}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : (
        <EmptyState icon={Tags} title="No categories yet" body="Create your first category to organise the dashboard catalogue." />
      )}
    </div>
  );
}
