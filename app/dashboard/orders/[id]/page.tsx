"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase";
import {
  formatCurrency,
  formatDate,
  orderStatuses,
  type OrderStatus,
} from "@/lib/dashboard";
import {
  Button,
  PageHeader,
  Panel,
  Select,
  StatusBadge,
} from "@/components/dashboard/ui";

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  product_name: string | null;
  amount: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
};

// Helper function to parse products from comma-separated string
function parseProducts(productString: string | null): string[] {
  if (!productString) return [];
  return productString
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params?.id) return;

    const loadOrder = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", params.id)
          .maybeSingle();

        if (fetchError) {
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        if (!data) {
          setError("Order not found");
          setLoading(false);
          return;
        }

        const nextOrder = data as Order;
        setOrder(nextOrder);
        setStatus(nextOrder.status);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading order");
        setLoading(false);
      }
    };

    loadOrder();
  }, [params?.id, supabase]);

  const updateStatus = async () => {
    setSaving(true);
    setError("");

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", params.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.refresh();
    setSaving(false);
  };

  if (loading) {
    return (
      <Panel className="p-6 text-sm text-[var(--text-dim)]">
        Loading order…
      </Panel>
    );
  }

  if (!order) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Order Not Found"
            description="This order could not be loaded."
          />
          <Link href="/dashboard/orders">
            <Button variant="secondary" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>
        <Panel className="p-6 text-sm text-rose-400">
          {error || "Order not found"}
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Order Detail"
          description="Review customer information and update the fulfilment status."
        />
        <Link href="/dashboard/orders">
          <Button variant="secondary" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <Panel className="p-6 md:p-8">
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Customer Info
            </p>
            <p className="text-lg text-[var(--text)]">{order.customer_name}</p>
            <p className="text-sm text-[var(--text-dim)]">
              {order.customer_email}
            </p>
            <p className="text-sm text-[var(--text-dim)]">
              {order.customer_phone || "No phone number"}
            </p>
          </div>

          {/* Main Grid: Left (Notes + Products) | Right (Status) */}
          <div className="grid gap-6 md:grid-cols-[1fr_0.35fr]">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Order Notes */}
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Order Notes
                </p>
                <div className="mt-3 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-dim)]">
                  {order.notes || "No notes were attached to this order."}
                </div>
              </div>

              {/* Products Ordered */}
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Products Ordered
                </p>
                <div className="mt-3 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-4">
                  {parseProducts(order.product_name).length > 0 ? (
                    <ul className="space-y-2">
                      {parseProducts(order.product_name).map(
                        (product, index) => (
                          <li
                            key={index}
                            className="flex items-start text-sm text-[var(--text)]"
                          >
                            <span className="mr-3 text-[var(--gold)]">•</span>
                            <span>{product}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-[var(--text-dim)]">
                      No products
                    </p>
                  )}
                  <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-[var(--text-muted)]">
                        Total Amount
                      </span>
                      <span className="text-sm font-medium text-[var(--gold)]">
                        {formatCurrency(order.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[var(--text-muted)]">
                        Order Date
                      </span>
                      <span className="text-sm text-[var(--text-dim)]">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Status */}
            <div className="space-y-4 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Current Status
                </p>
                <div className="mt-3">
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-[var(--text-dim)]">
                  Update Status
                </p>
                <Select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as OrderStatus)
                  }
                >
                  {orderStatuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </div>
              {error ? <p className="text-sm text-rose-400">{error}</p> : null}
              <Button onClick={updateStatus} disabled={saving}>
                {saving ? "Saving…" : "Update Status"}
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
