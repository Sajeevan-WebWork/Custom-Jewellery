"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { slugify } from "@/lib/dashboard";
import { Button, Field, Input, Panel, Select, Textarea, Toggle } from "@/components/dashboard/ui";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  material: string | null;
  stock: boolean | null;
  image_urls: string[] | null;
};

type UploadState = {
  file: File;
  progress: number;
};

const initialState = {
  name: "",
  description: "",
  price: "",
  material: "",
  category_id: "",
  stock: true,
};

export function ProductForm({ productId }: { productId?: string }) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(initialState);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [loading, setLoading] = useState(Boolean(productId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      const [{ data: categoryData, error: categoryError }, productResponse] = await Promise.all([
        supabase.from("categories").select("id, name").order("name"),
        productId
          ? supabase
              .from("products")
              .select("id, name, description, price, category_id, material, stock, image_urls")
              .eq("id", productId)
              .single()
          : Promise.resolve({ data: null, error: null }),
      ]);

      if (categoryError) {
        setError(categoryError.message);
      }

      setCategories(categoryData ?? []);

      if (productResponse?.error) {
        setError(productResponse.error.message);
      }

      if (productResponse?.data) {
        const product = productResponse.data as Product;
        setForm({
          name: product.name ?? "",
          description: product.description ?? "",
          price: String(product.price ?? ""),
          material: product.material ?? "",
          category_id: product.category_id ?? "",
          stock: Boolean(product.stock),
        });
        setExistingImages(product.image_urls ?? []);
      }

      setLoading(false);
    };

    loadData();
  }, [productId, supabase]);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setUploads((current) => [...current, ...files.map((file) => ({ file, progress: 0 }))]);
    event.target.value = "";
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Product name is required.";
    if (!form.price || Number(form.price) <= 0) nextErrors.price = "Enter a valid price.";
    if (imageUrlInput.trim()) {
      try {
        new URL(imageUrlInput.trim());
      } catch {
        nextErrors.image_urls = "Enter a valid image URL.";
      }
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const addImageUrl = () => {
    const trimmedUrl = imageUrlInput.trim();
    if (!trimmedUrl) return;

    try {
      new URL(trimmedUrl);
    } catch {
      setFieldErrors((current) => ({
        ...current,
        image_urls: "Enter a valid image URL.",
      }));
      return;
    }

    if (existingImages.includes(trimmedUrl)) {
      setImageUrlInput("");
      return;
    }

    setExistingImages((current) => [...current, trimmedUrl]);
    setImageUrlInput("");
    setFieldErrors((current) => {
      const next = { ...current };
      delete next.image_urls;
      return next;
    });
  };

  const uploadFile = async (file: File, index: number) => {
    setUploads((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, progress: 20 } : item))
    );

    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${slugify(form.name || file.name)}-${index}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("products").upload(path, file, {
      upsert: false,
    });

    if (uploadError) throw uploadError;

    setUploads((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, progress: 100 } : item))
    );

    return supabase.storage.from("products").getPublicUrl(path).data.publicUrl;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!validate()) return;

    setSaving(true);

    try {
      const uploadedUrls: string[] = [];

      for (let index = 0; index < uploads.length; index += 1) {
        const publicUrl = await uploadFile(uploads[index].file, index);
        uploadedUrls.push(publicUrl);
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
        material: form.material.trim() || null,
        category_id: form.category_id || null,
        stock: form.stock,
        image_urls: [...existingImages, ...uploadedUrls],
        updated_at: new Date().toISOString(),
      };

      const query = productId
        ? supabase.from("products").update(payload).eq("id", productId)
        : supabase.from("products").insert(payload);

      const { error: saveError } = await query;
      if (saveError) throw saveError;

      router.push("/dashboard/products");
      router.refresh();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to save product.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Panel className="p-8">
        <p className="text-sm text-[var(--text-dim)]">Loading product details…</p>
      </Panel>
    );
  }

  return (
    <Panel className="p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Product Name" error={fieldErrors.name}>
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Temple Heritage Necklace"
            />
          </Field>
          <Field label="Price in ₹" error={fieldErrors.price}>
            <Input
              type="number"
              min="0"
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
              placeholder="68000"
            />
          </Field>
          <Field label="Material">
            <Input
              value={form.material}
              onChange={(event) => setForm((current) => ({ ...current, material: event.target.value }))}
              placeholder="18K Gold"
            />
          </Field>
          <Field label="Category">
            <Select
              value={form.category_id}
              onChange={(event) => setForm((current) => ({ ...current, category_id: event.target.value }))}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Description">
          <Textarea
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Describe the design, stones, and finish."
          />
        </Field>

        <div className="flex items-center justify-between rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-[var(--text)]">In Stock</p>
            <p className="text-sm text-[var(--text-dim)]">Toggle product availability for the storefront.</p>
          </div>
          <Toggle checked={form.stock} onChange={(stock) => setForm((current) => ({ ...current, stock }))} />
        </div>

        <div className="space-y-4 rounded-[1.5rem] border border-dashed border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Image Upload</p>
              <p className="text-sm text-[var(--text-dim)]">Upload multiple product images to the Supabase storage bucket.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] transition hover:border-[var(--gold)]">
              <Upload className="h-4 w-4 text-[var(--gold)]" />
              Add Images
              <input type="file" multiple accept="image/*" className="hidden" onChange={onFileChange} />
            </label>
          </div>

          <Field label="Image URL" error={fieldErrors.image_urls}>
            <div className="flex flex-col gap-3 md:flex-row">
              <Input
                type="url"
                value={imageUrlInput}
                onChange={(event) => setImageUrlInput(event.target.value)}
                placeholder="https://example.com/product-image.jpg"
              />
              <Button
                type="button"
                variant="secondary"
                className="md:shrink-0"
                onClick={addImageUrl}
              >
                Add URL
              </Button>
            </div>
          </Field>

          {(existingImages.length || uploads.length) > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {existingImages.map((image) => (
                <div key={image} className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-2)] p-3">
                  <img src={image} alt="Product preview" className="h-40 w-full rounded-xl object-cover" />
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-3 w-full justify-center gap-2"
                    onClick={() => setExistingImages((current) => current.filter((item) => item !== image))}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ))}

              {uploads.map((upload, index) => (
                <div key={`${upload.file.name}-${index}`} className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-2)] p-3">
                  <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]">
                    <ImagePlus className="h-8 w-8 text-[var(--gold)]" />
                  </div>
                  <p className="mt-3 truncate text-sm text-[var(--text)]">{upload.file.name}</p>
                  <div className="mt-3 h-2 rounded-full bg-[var(--surface)]">
                    <div
                      className="h-2 rounded-full bg-[var(--gold)] transition-all"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-3 w-full justify-center gap-2"
                    onClick={() => setUploads((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-2)] px-4 py-12 text-center">
              <ImagePlus className="mx-auto h-8 w-8 text-[var(--gold)]" />
              <p className="mt-3 text-sm text-[var(--text-dim)]">No images selected yet.</p>
            </div>
          )}
        </div>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : productId ? "Update Product" : "Create Product"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/dashboard/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </Panel>
  );
}
