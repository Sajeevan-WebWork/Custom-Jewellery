import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Fallback categories in case database is empty
const FALLBACK_CATEGORIES = [
  {
    id: "1",
    name: "Rings",
    count: 0,
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
    image_url:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
    link: "/products?category=Rings",
  },
  {
    id: "2",
    name: "Necklaces",
    count: 0,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    image_url:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    link: "/products?category=Necklaces",
  },
  {
    id: "3",
    name: "Earrings",
    count: 0,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    image_url:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    link: "/products?category=Earrings",
  },
  {
    id: "4",
    name: "Bracelets",
    count: 0,
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800",
    image_url:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800",
    link: "/products?category=Bracelets",
  },
];

export async function GET() {
  try {
    const [
      { data: categories, error: categoriesError },
      { data: products, error: productsError },
    ] = await Promise.all([
      supabase
        .from("categories")
        .select("id, name, image_url")
        .order("name", { ascending: true }),
      supabase
        .from("products")
        .select("category_id, image_urls")
        .order("created_at", { ascending: false }),
    ]);

    if (categoriesError || productsError) {
      console.error("Supabase error:", categoriesError || productsError);
      throw categoriesError || productsError;
    }

    if (!categories || categories.length === 0) {
      console.warn("No categories found in database, using fallback categories");
      return NextResponse.json(FALLBACK_CATEGORIES);
    }

    const productMap = new Map<
      string,
      {
        count: number;
        fallbackImage: string;
      }
    >();

    (products ?? []).forEach((product) => {
      if (!product.category_id) return;

      if (!productMap.has(product.category_id)) {
        productMap.set(product.category_id, {
          count: 0,
          fallbackImage: "",
        });
      }

      const productData = productMap.get(product.category_id)!;
      productData.count += 1;

      if (!productData.fallbackImage && product.image_urls?.[0]) {
        productData.fallbackImage = product.image_urls[0];
      }
    });

    const categoriesWithMetadata = categories
      .map((category) => {
        const productData = productMap.get(category.id);
        const thumbnail =
          category.image_url ||
          productData?.fallbackImage ||
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800";

        return {
          id: category.id,
          name: category.name,
          count: productData?.count ?? 0,
          image: thumbnail,
          image_url: thumbnail,
          link: `/products?category=${encodeURIComponent(category.name)}`,
        };
      })
      .filter((category) => category.count > 0 || category.image_url)
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(categoriesWithMetadata);
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return fallback on error
    return NextResponse.json(FALLBACK_CATEGORIES);
  }
}
