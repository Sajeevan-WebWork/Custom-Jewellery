"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  Gem,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
  Tag,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/dashboard";
import { Button } from "@/components/dashboard/ui";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Products", icon: Gem },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/categories", label: "Categories", icon: Tag },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
];

const authPaths = new Set(["/dashboard/login", "/dashboard/signup"]);

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname && !authPaths.has(pathname)) {
      router.replace("/dashboard/login");
    }
  }, [loading, pathname, router, user]);

  if (pathname && authPaths.has(pathname)) {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--gold)]" />
          <p className="mt-4 text-sm text-[var(--text-dim)]">
            Loading secure dashboard…
          </p>
        </div>
      </div>
    );
  }

  const sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] md:w-56 sm:w-full">
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-6">
        <div className="rounded-2xl bg-[var(--surface-2)] p-3">
          <Gem className="h-6 w-6 text-[var(--gold)]" />
        </div>
        <div>
          <p className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold)]">
            Jewellery Studio
          </p>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
            Admin Console
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-r-2xl border-l-2 px-4 py-3 text-sm transition",
                  active
                    ? "border-[var(--gold)] bg-[rgba(201,169,110,0.08)] text-[var(--gold)]"
                    : "border-transparent text-[var(--text-dim)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]",
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-[var(--border)] px-5 py-5">
        <p className="truncate text-sm text-[var(--text)]">{user.email}</p>
        <Button
          variant="secondary"
          className="mt-3 w-full justify-center gap-2"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="hidden lg:block">{sidebar}</div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className="relative h-full">{sidebar}</div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[rgba(9,9,8,0.75)] px-6 py-4 backdrop-blur lg:hidden">
          <button
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] p-2"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5 text-[var(--text)]" />
          </button>
          <p className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold)]">
            Jewellery Studio
          </p>
          <button
            className="rounded-full border border-transparent p-2 text-[var(--text-dim)]"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
