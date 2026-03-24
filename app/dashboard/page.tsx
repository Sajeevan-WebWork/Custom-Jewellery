"use client";

import {
  Bell,
  BellOff,
  Gem,
  LayoutDashboard,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import { DashboardOverviewSkeleton } from "./loading";
import {
  Button,
  Panel,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/dashboard/ui";
import {
  formatCurrency,
  type OrderStatus,
  formatDate,
  playNotificationTone,
} from "@/lib/dashboard";
import Link from "next/link";

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
  const supabase = useMemo(() => createClient(), []);
  const [data, setData] = useState<DashboardData>({
    productsCount: 0,
    ordersCount: 0,
    categoriesCount: 0,
    pendingOrdersCount: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationSupported, setNotificationSupported] = useState(false);
  const [liveMessage, setLiveMessage] = useState("Waiting for live updates…");
  const [liveConnected, setLiveConnected] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const latestOrderIdsRef = useRef<Set<string>>(new Set());

  const loadData = useCallback(async () => {
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

    const recentOrders = recentOrdersResponse.data ?? [];
    latestOrderIdsRef.current = new Set(recentOrders.map((order) => order.id));

    setData({
      productsCount: productsCount.count ?? 0,
      ordersCount: ordersCount.count ?? 0,
      categoriesCount: categoriesCount.count ?? 0,
      pendingOrdersCount: pendingOrdersCount.count ?? 0,
      recentOrders,
    });
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        await loadData();
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, [loadData]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const supported = "Notification" in window;
    setNotificationSupported(supported);
    setNotificationsEnabled(supported && Notification.permission === "granted");
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-orders-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        async (payload) => {
          const eventType = payload.eventType;
          const newOrder =
            payload.new && typeof payload.new === "object"
              ? (payload.new as Partial<RecentOrder>)
              : null;

          if (
            eventType === "INSERT" &&
            newOrder?.id &&
            !latestOrderIdsRef.current.has(newOrder.id)
          ) {
            latestOrderIdsRef.current.add(newOrder.id);
            setLiveMessage(
              `New order from ${newOrder.customer_name || "a customer"} just arrived.`,
            );

            if (notificationsEnabled && typeof window !== "undefined") {
              const detail = newOrder.product_name || "Custom order";
              new Notification("New jewellery order", {
                body: `${newOrder.customer_name || "A customer"} placed ${detail}.`,
              });
              playNotificationTone(audioContextRef.current);
            }
          } else {
            setLiveMessage("Dashboard updated from live order activity.");
          }

          await loadData();
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setLiveConnected(true);
          setLiveMessage(
            "Realtime connection active. Listening for new orders.",
          );
          return;
        }

        if (status === "CHANNEL_ERROR") {
          setLiveConnected(false);
          setLiveMessage(
            "Realtime connection failed. Falling back to automatic refresh every 10 seconds.",
          );
          return;
        }

        if (status === "TIMED_OUT") {
          setLiveConnected(false);
          setLiveMessage(
            "Realtime connection timed out. Falling back to automatic refresh every 10 seconds.",
          );
        }
      });

    const pollInterval = window.setInterval(() => {
      loadData();
    }, 10000);

    return () => {
      window.clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [loadData, notificationsEnabled, supabase]);

  const enableNotifications = async () => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    const Context =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!audioContextRef.current && Context) {
      audioContextRef.current = new Context();
    }

    if (audioContextRef.current?.state === "suspended") {
      await audioContextRef.current.resume();
    }

    const permission = await Notification.requestPermission();
    const enabled = permission === "granted";
    setNotificationsEnabled(enabled);
    setLiveMessage(
      enabled
        ? "Browser alerts and sound are enabled for new orders."
        : "Notifications are blocked in this browser.",
    );

    if (enabled) {
      playNotificationTone(audioContextRef.current);
    }
  };

  const stats = [
    { label: "Products", value: data.productsCount, icon: Gem },
    { label: "Orders", value: data.ordersCount, icon: ShoppingBag },
    { label: "Categories", value: data.categoriesCount, icon: Tag },
    { label: "Pending", value: data.pendingOrdersCount, icon: LayoutDashboard },
  ];

  const recentOrders = data.recentOrders;

  if (loading) {
    return <DashboardOverviewSkeleton />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Track key admin metrics and keep an eye on pending client orders."
        action={
          notificationSupported ? (
            <Button
              variant={notificationsEnabled ? "secondary" : "primary"}
              className="gap-2"
              onClick={enableNotifications}
            >
              {notificationsEnabled ? (
                <Bell className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
              {notificationsEnabled ? "Alerts On" : "Enable Alerts"}
            </Button>
          ) : null
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Panel className="flex items-center justify-between gap-3 px-5 py-4">
        <div>
          <p className="text-sm font-medium text-[var(--text)]">Live Orders</p>
          <p className="text-sm text-[var(--text-dim)]">{liveMessage}</p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
            liveConnected
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border border-amber-500/20 bg-amber-500/10 text-amber-300"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              liveConnected ? "bg-emerald-300" : "bg-amber-300"
            }`}
          />
          {liveConnected ? "Realtime On" : "Polling Fallback"}
        </span>
      </Panel>

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
                  <td>
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      <Button variant="secondary">View Details</Button>
                    </Link>
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
