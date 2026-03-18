"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { formatCurrency, formatDate, orderStatuses, type OrderStatus } from "@/lib/dashboard";
import { Button, PageHeader, Panel, Select, StatusBadge } from "@/components/dashboard/ui";

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
    const loadOrder = async () => {
      const { data, error: fetchError } = await supabase.from("orders").select("*").eq("id", params.id).single();
      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        const nextOrder = data as Order;
        setOrder(nextOrder);
        setStatus(nextOrder.status);
      }
      setLoading(false);
    };

    loadOrder();
  }, [params.id, supabase]);

  const updateStatus = async () => {
    setSaving(true);
    setError("");

    const { error: updateError } = await supabase.from("orders").update({ status }).eq("id", params.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.refresh();
    setSaving(false);
  };

  if (loading) {
    return <Panel className="p-6 text-sm text-[var(--text-dim)]">Loading order…</Panel>;
  }

  if (!order) {
    return <Panel className="p-6 text-sm text-rose-400">{error || "Order not found."}</Panel>;
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
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">Customer Info</p>
            <p className="text-lg text-[var(--text)]">{order.customer_name}</p>
            <p className="text-sm text-[var(--text-dim)]">{order.customer_email}</p>
            <p className="text-sm text-[var(--text-dim)]">{order.customer_phone || "No phone number"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">Product Info</p>
            <p className="text-lg text-[var(--text)]">{order.product_name || "Custom order"}</p>
            <p className="text-sm text-[var(--gold)]">{formatCurrency(order.amount)}</p>
            <p className="text-sm text-[var(--text-dim)]">{formatDate(order.created_at)}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[0.7fr_0.3fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">Order Notes</p>
            <div className="mt-3 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-dim)]">
              {order.notes || "No notes were attached to this order."}
            </div>
          </div>
          <div className="space-y-4 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">Current Status</p>
              <div className="mt-3">
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[var(--text-dim)]">Update Status</p>
              <Select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)}>
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
      </Panel>
    </div>
  );
}

