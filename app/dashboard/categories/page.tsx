"use client";

import type { FormEvent, ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Tags, Trash2, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { slugify } from "@/lib/dashboard";
import {
  Button,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Panel,
  Select,
  Textarea,
} from "@/components/dashboard/ui";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

type ProductLink = {
  category_id: string | null;
};

type UploadState = {
  file: File;
  progress: number;
};

export default function DashboardCategoriesPage() {
  const supabase = useMemo(() => createClient(), []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productLinks, setProductLinks] = useState<ProductLink[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUpload, setImageUpload] = useState<UploadState | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrlInput, setEditImageUrlInput] = useState("");
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
  const [editImageUpload, setEditImageUpload] = useState<UploadState | null>(
    null,
  );
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    const [
      { data: categoryData, error: categoryError },
      { data: productsData, error: productsError },
    ] = await Promise.all([
      supabase
        .from("categories")
        .select("id, name, slug, description, image_url")
        .order("created_at", { ascending: false }),
      supabase.from("products").select("category_id"),
    ]);

    if (categoryError || productsError) {
      setError(
        categoryError?.message ||
          productsError?.message ||
          "Unable to load categories.",
      );
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

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUpload({ file, progress: 0 });
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const onEditImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setEditImageUpload({ file, progress: 0 });
    const reader = new FileReader();
    reader.onload = (e) => setEditImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const uploadImage = async (
    file: File,
    categoryName: string,
  ): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${slugify(categoryName)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("categories")
      .upload(path, file, {
        upsert: false,
      });

    if (uploadError) throw uploadError;

    return supabase.storage.from("categories").getPublicUrl(path).data
      .publicUrl;
  };

  const clearImageUpload = () => {
    setImageUpload(null);
    setImagePreview(null);
  };

  const clearEditImageUpload = () => {
    setEditImageUpload(null);
    setEditImagePreview(null);
  };

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

    try {
      let imageUrl: string | null = null;

      if (imageUpload) {
        imageUrl = await uploadImage(imageUpload.file, name);
      } else if (imageUrlInput.trim()) {
        imageUrl = imageUrlInput.trim();
      }

      const { error: createError } = await supabase.from("categories").insert({
        name: name.trim(),
        slug: slugify(name),
        description: description.trim() || null,
        image_url: imageUrl,
      });

      if (createError) {
        setError(createError.message);
        setSaving(false);
        return;
      }

      setName("");
      setDescription("");
      setImageUrlInput("");
      clearImageUpload();
      setSaving(false);
      await loadCategories();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload image";
      setError(message);
      setSaving(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(category.description || "");
    setEditImageUrlInput(category.image_url || "");
    setEditImageUrl(category.image_url);
  };

  const saveEdit = async (id: string) => {
    try {
      let finalImageUrl = editImageUrl;

      if (editImageUpload) {
        finalImageUrl = await uploadImage(editImageUpload.file, editName);
      } else {
        finalImageUrl = editImageUrlInput.trim() || null;
      }

      const { error: updateError } = await supabase
        .from("categories")
        .update({
          name: editName.trim(),
          slug: slugify(editName),
          description: editDescription.trim() || null,
          image_url: finalImageUrl,
        })
        .eq("id", id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setEditingId(null);
      clearEditImageUpload();
      await loadCategories();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update category";
      setError(message);
    }
  };

  const removeCategory = async (category: Category) => {
    if ((counts[category.id] ?? 0) > 0) {
      setError(
        "This category is linked to products. Reassign those products before deleting it.",
      );
      return;
    }

    if (!window.confirm(`Delete ${category.name}?`)) return;

    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);
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
        <form className="space-y-5" onSubmit={createCategory}>
          <div className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
            <Field label="Name">
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Bridal"
                required
              />
            </Field>
            <Field label="Description">
              <Textarea
                className="min-h-0"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Curated pieces for bridal celebrations."
              />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Thumbnail URL">
              <Input
                type="url"
                value={imageUrlInput}
                onChange={(event) => setImageUrlInput(event.target.value)}
                placeholder="https://example.com/category-thumbnail.jpg"
              />
            </Field>
            <Field label="Thumbnail Upload">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="category-image-input"
                  accept="image/*"
                  onChange={onImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-2 flex-1"
                  onClick={() =>
                    document.getElementById("category-image-input")?.click()
                  }
                  disabled={imageUpload ? true : false}
                >
                  <ImageIcon className="h-4 w-4" />
                  {imageUpload ? "Uploading…" : "Choose Image"}
                </Button>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-rose-300"
                    onClick={clearImageUpload}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm text-[var(--text-dim)]">
                Thumbnail priority: uploaded image, then thumbnail URL. If both
                are empty, the storefront uses a linked product image as the
                category thumbnail automatically.
              </p>
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full"
                disabled={saving || !name.trim()}
              >
                {saving ? "Adding…" : "Add Category"}
              </Button>
            </div>
          </div>

          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-20 w-20 object-cover rounded"
              />
            </div>
          )}

          <p className="text-sm text-[var(--text-dim)]">
            Slug preview: {slugify(name || "new-category")}
          </p>
        </form>
      </Panel>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {loading ? (
        <Panel className="p-6 text-sm text-[var(--text-dim)]">
          Loading categories…
        </Panel>
      ) : categories.length ? (
        <Panel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)] text-left text-sm">
              <thead className="bg-[var(--surface)] text-[var(--text-muted)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Image</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Products</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="bg-[var(--surface-2)]/45 align-top"
                  >
                    <td className="px-6 py-4">
                      {editingId === category.id ? (
                        <div className="space-y-2">
                          <Input
                            type="url"
                            value={editImageUrlInput}
                            onChange={(event) =>
                              setEditImageUrlInput(event.target.value)
                            }
                            placeholder="https://example.com/category-thumbnail.jpg"
                          />
                          {editImagePreview || editImageUrl ? (
                            <div className="relative">
                              <img
                                src={
                                  editImagePreview ||
                                  editImageUrlInput ||
                                  editImageUrl ||
                                  ""
                                }
                                alt="Category"
                                className="h-20 w-20 object-cover rounded"
                              />
                              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 rounded cursor-pointer transition-opacity">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={onEditImageChange}
                                  className="hidden"
                                />
                                <span className="text-white text-xs">
                                  Change
                                </span>
                              </label>
                            </div>
                          ) : (
                            <label className="block">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={onEditImageChange}
                                className="hidden"
                              />
                              <div className="h-20 w-20 rounded border-2 border-dashed border-[var(--border)] flex items-center justify-center cursor-pointer hover:bg-[var(--surface)]">
                                <ImageIcon className="h-6 w-6 text-[var(--text-muted)]" />
                              </div>
                            </label>
                          )}
                          {(editImagePreview || editImageUrl) && (
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-rose-300 w-full"
                              onClick={() => {
                                setEditImageUrlInput("");
                                setEditImageUrl(null);
                                clearEditImageUpload();
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </Button>
                          )}
                        </div>
                      ) : (
                        <>
                          {category.image_url ? (
                            <img
                              src={category.image_url}
                              alt={category.name}
                              className="h-20 w-20 object-cover rounded"
                            />
                          ) : (
                            <div className="h-20 w-20 rounded bg-[var(--surface)] flex items-center justify-center text-[var(--text-muted)]">
                              <ImageIcon className="h-6 w-6" />
                            </div>
                          )}
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === category.id ? (
                        <Input
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                        />
                      ) : (
                        <span className="text-[var(--text)]">
                          {category.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-dim)]">
                      {editingId === category.id
                        ? slugify(editName)
                        : category.slug}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === category.id ? (
                        <Textarea
                          className="min-h-24"
                          value={editDescription}
                          onChange={(event) =>
                            setEditDescription(event.target.value)
                          }
                        />
                      ) : (
                        <span className="text-[var(--text-dim)]">
                          {category.description || "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[var(--gold)]">
                      {counts[category.id] ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {editingId === category.id ? (
                          <>
                            <Button onClick={() => saveEdit(category.id)}>
                              Save
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setEditingId(null);
                                clearEditImageUpload();
                                setEditImageUrl(null);
                                setEditImageUrlInput("");
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="secondary"
                              className="gap-2"
                              onClick={() => startEdit(category)}
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              className="gap-2 text-rose-300"
                              onClick={() => removeCategory(category)}
                            >
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
        <EmptyState
          icon={Tags}
          title="No categories yet"
          body="Create your first category to organise the dashboard catalogue."
        />
      )}
    </div>
  );
}
