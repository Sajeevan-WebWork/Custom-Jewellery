"use client";

import { Gem, LayoutDashboard, ShoppingBag, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  Panel,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/dashboard/ui";
import { formatCurrency, type OrderStatus } from "@/lib/dashboard";

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
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Track key admin metrics and keep an eye on the most recent client orders."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Panel className="overflow-hidden">
        <div className="border-b border-[var(--border)] px-6 py-5">
          <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--text)]">
            Recent Orders
          </h2>
        </div>
        <div className="overflow-x-auto">
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
                    No orders yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
