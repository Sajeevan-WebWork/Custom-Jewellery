"use client";

import { Gem, LayoutDashboard, ShoppingBag, Tag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  Panel,
  PageHeader,
  StatCard,
  StatusBadge,
  Button,
} from "@/components/dashboard/ui";
import { formatCurrency, type OrderStatus, formatDate } from "@/lib/dashboard";

type RecentOrder = {
  id: string;
  customer_name: string;
  product_name: string;
  amount: number;
  status: OrderStatus;
  created_at: string;
};

type DashboardData = {
  productsCount: number;
  ordersCount: number;
  categoriesCount: number;
  pendingOrdersCount: number;
  recentOrders: RecentOrder[];
};

export default function DashboardOverviewPage() {
  const supabase = createClient();
  const [data, setData] = useState<DashboardData>({
    productsCount: 0,
    ordersCount: 0,
    categoriesCount: 0,
    pendingOrdersCount: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [
        productsCount,
        ordersCount,
        categoriesCount,
        pendingOrdersCount,
        recentOrdersResponse,
      ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("orders")
          .select("id, customer_name, product_name, amount, status, created_at")
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setData({
        productsCount: productsCount.count ?? 0,
        ordersCount: ordersCount.count ?? 0,
        categoriesCount: categoriesCount.count ?? 0,
        pendingOrdersCount: pendingOrdersCount.count ?? 0,
        recentOrders: recentOrdersResponse.data ?? [],
      });
      setLoading(false);
    };

    loadData();
  }, []);

  const stats = [
    { label: "Products", value: data.productsCount, icon: Gem },
    { label: "Orders", value: data.ordersCount, icon: ShoppingBag },
    { label: "Categories", value: data.categoriesCount, icon: Tag },
    { label: "Pending", value: data.pendingOrdersCount, icon: LayoutDashboard },
  ];

  const recentOrders = data.recentOrders;

  if (loading) {
    return (
      <div
        role="status"
        className="flex items-center justify-center min-h-screen"
      >
        <span className="sr-only text-white">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Track key admin metrics and keep an eye on pending client orders."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Panel className="overflow-hidden">
        <div className="border-b border-[var(--border)] px-6 py-5">
          <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--text)]">
            Pending Orders
          </h2>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border)] text-left text-sm">
            <thead className="bg-[var(--surface)] text-[var(--text-muted)]">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="bg-[var(--surface-2)]/45">
                  <td className="px-6 py-4 text-[var(--text)]">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 text-[var(--text-dim)]">
                    {order.product_name || "Custom order"}
                  </td>
                  <td className="px-6 py-4 text-[var(--gold)]">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
              {!recentOrders.length ? (
                <tr>
                  <td className="px-6 py-10 text-[var(--text-dim)]" colSpan={4}>
                    No pending orders.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        {recentOrders.length ? (
          <div className="space-y-3 md:hidden p-6">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/45 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-[var(--text)]">
                      {order.customer_name}
                    </p>
                    <p className="text-xs text-[var(--text-dim)]">
                      {order.product_name || "Custom order"}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
                  <p className="text-sm font-semibold text-[var(--gold)]">
                    {formatCurrency(order.amount)}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {formatDate(order.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="md:hidden p-6 text-center text-[var(--text-dim)]">
            No orders yet.
          </div>
        )}
      </Panel>
    </div>
  );
}
