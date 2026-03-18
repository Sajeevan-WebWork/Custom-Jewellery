"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CartItem = {
  id: number | string;
  name: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
};

type OrderFormData = {
  name: string;
  phone: string;
  address: string;
  notes: string;
};

export async function saveOrderAction(
  formData: OrderFormData,
  cartItems: CartItem[],
  cartTotal: number,
) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (toSet) => {
            try {
              toSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch {
              return;
            }
          },
        },
      },
    );

    // Generate a unique order ID
    const orderId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Format product names with quantities
    const productList = cartItems
      .map((item) => `${item.name} (Qty: ${item.quantity})`)
      .join(", ");

    // Prepare order data - matching actual database schema
    const orderData = {
      customer_name: formData.name,
      customer_email: formData.phone,
      customer_phone: formData.phone,
      product_name: productList,
      amount: cartTotal,
      status: "pending",
      notes: formData.address + (formData.notes ? `\n\n${formData.notes}` : ""),
      created_at: new Date().toISOString(),
    };

    // Insert the order into Supabase
    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select();

    if (error) {
      console.error("Supabase Error Details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Server action error:", errorMessage, error);
    return { success: false, error: errorMessage };
  }
}
