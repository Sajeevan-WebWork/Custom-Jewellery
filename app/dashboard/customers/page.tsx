"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { formatCurrency, formatDate } from "@/lib/dashboard";
import { EmptyState, Input, PageHeader, Panel } from "@/components/dashboard/ui";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  total_orders: number | null;
  total_spent: number | null;
  created_at: string;
};

export default function DashboardCustomersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
      const { data, error: fetchError } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setCustomers((data as Customer[]) ?? []);
        setError("");
      }

      setLoading(false);
    };

    loadCustomers();
  }, [supabase]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return customers;
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term) || customer.email.toLowerCase().includes(term)
    );
  }, [customers, search]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Customers"
        description="Read-only customer records generated from orders and retained for reporting."
      />

      <Panel className="p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            className="pl-11"
            placeholder="Search by customer name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </Panel>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {loading ? (
        <Panel className="p-6 text-sm text-[var(--text-dim)]">Loading customers…</Panel>
      ) : filtered.length ? (
        <Panel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)] text-left text-sm">
              <thead className="bg-[var(--surface)] text-[var(--text-muted)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Phone</th>
                  <th className="px-6 py-4 font-medium">Total Orders</th>
                  <th className="px-6 py-4 font-medium">Total Spent</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="bg-[var(--surface-2)]/45">
                    <td className="px-6 py-4 text-[var(--text)]">{customer.name}</td>
                    <td className="px-6 py-4 text-[var(--text-dim)]">{customer.email}</td>
                    <td className="px-6 py-4 text-[var(--text-dim)]">{customer.phone || "—"}</td>
                    <td className="px-6 py-4 text-[var(--gold)]">{customer.total_orders ?? 0}</td>
                    <td className="px-6 py-4 text-[var(--gold)]">{formatCurrency(customer.total_spent ?? 0)}</td>
                    <td className="px-6 py-4 text-[var(--text-dim)]">{formatDate(customer.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : (
        <EmptyState icon={Users} title="No customers yet" body="Customer records will appear here once orders start flowing in." />
      )}
    </div>
  );
}
