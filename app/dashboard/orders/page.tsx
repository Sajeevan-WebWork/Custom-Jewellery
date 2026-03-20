"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  formatCurrency,
  formatDate,
  orderStatuses,
  type OrderStatus,
} from "@/lib/dashboard";
import {
  Button,
  EmptyState,
  PageHeader,
  Panel,
  StatusBadge,
} from "@/components/dashboard/ui";
import { ShoppingBag } from "lucide-react";

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  product_name: string | null;
  amount: number;
  status: OrderStatus;
  created_at: string;
};

const filters: Array<"all" | OrderStatus> = ["all", ...orderStatuses];

// Helper function to count products from product_name string
function countProducts(productName: string | null): number {
  if (!productName) return 0;
  // Count items by splitting by comma and filtering empty strings
  return productName.split(",").filter((item) => item.trim()).length;
}

export default function DashboardOrdersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select(
          "id, customer_name, customer_email, product_name, amount, status, created_at",
        )
        .order("created_at", { ascending: false });

      if (fetchError) setError(fetchError.message);
      setOrders((data as Order[]) ?? []);
      setLoading(false);
    };

    loadOrders();
  }, [supabase]);

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((order) => order.status === filter);
  }, [filter, orders]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Orders"
        description="Filter by fulfilment stage and open any order to update its delivery status."
      />

      <div className="flex flex-wrap gap-3">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-2 text-sm capitalize transition ${
              filter === item
                ? "bg-[var(--gold)] text-black"
                : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-dim)] hover:text-[var(--text)]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {loading ? (
        <Panel className="p-6 text-sm text-[var(--text-dim)]">
          Loading orders…
        </Panel>
      ) : filteredOrders.length ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Panel className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--border)] text-left text-sm">
                  <thead className="bg-[var(--surface)] text-[var(--text-white)]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Product Count</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="bg-[var(--surface-2)]/45">
                        <td className="px-6 py-4 text-[var(--text)]">
                          {order.customer_name}
                        </td>
                        <td className="px-6 py-4 text-[var(--text-dim)]">
                          {order.customer_email}
                        </td>
                        <td className="px-6 py-4 text-[var(--text)]">
                          <span className="inline-flex items-center justify-center rounded-full bg-[var(--gold)]/20 px-3 py-1 text-sm font-medium text-[var(--gold)]">
                            {countProducts(order.product_name)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[var(--gold)]">
                          {formatCurrency(order.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4 text-[var(--text-dim)]">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <Button variant="secondary">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {filteredOrders.map((order) => (
              <Panel key={order.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-[var(--text)]">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-[var(--text-dim)]">
                        {order.customer_email}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-3">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                        Items
                      </p>
                      <p className="mt-1 rounded-full bg-[var(--gold)]/20 px-2 py-1 text-center text-sm font-medium text-[var(--gold)]">
                        {countProducts(order.product_name)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                        Amount
                      </p>
                      <p className="mt-1 text-sm font-medium text-[var(--gold)]">
                        {formatCurrency(order.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[var(--border)] pt-3 text-xs text-[var(--text-muted)]">
                    {formatDate(order.created_at)}
                  </div>

                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button variant="secondary" className="w-full">
                      View Order
                    </Button>
                  </Link>
                </div>
              </Panel>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found"
          body="Orders matching this status filter will appear here."
        />
      )}
    </div>
  );
}
