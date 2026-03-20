"use client";

import type { LucideIcon } from "lucide-react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn, getStatusClasses, type OrderStatus } from "@/lib/dashboard";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "glass-panel gold-ring rounded-[1.5rem] border border-[var(--border)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const variants = {
    primary: "bg-[var(--gold)] text-black hover:bg-[#d6b57d]",
    secondary:
      "border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--gold)]",
    ghost: "text-[var(--text-dim)] hover:text-[var(--text)]",
    danger: "bg-rose-600 text-white hover:bg-rose-500",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[var(--text-dim)]">
        {label}
      </span>
      {children}
      {error ? <span className="text-sm text-rose-400">{error}</span> : null}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--gold)]",
        props.className,
      )}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-32 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--gold)]",
        props.className,
      )}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)]",
        props.className,
      )}
    />
  );
}

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 rounded-full transition",
        checked ? "bg-[var(--gold)]" : "bg-[var(--surface-2)]",
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-white transition",
          checked ? "left-6" : "left-1",
        )}
      />
    </button>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize",
        getStatusClasses(status),
      )}
    >
      {status}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--text)]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-dim)]">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <Panel className="flex flex-col items-center px-6 py-16 text-center">
      <div className="rounded-full border border-[var(--border)] bg-[var(--surface)] p-4">
        <Icon className="h-8 w-8 text-[var(--gold)]" />
      </div>
      <h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl text-[var(--text)]">
        {title}
      </h2>
      <p className="mt-3 max-w-md text-sm text-[var(--text-dim)]">{body}</p>
    </Panel>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <Panel className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base uppercase tracking-[0.1em] font-semibold text-[var(--text-muted)]">
            {label}
          </p>
          <p className="mt-4 text-4xl font-semibold text-[var(--gold)]">
            {value}
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--surface)] p-3">
          <Icon className="h-6 w-6 text-[var(--gold)]" />
        </div>
      </div>
    </Panel>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn("shimmer rounded-2xl bg-[var(--surface-2)]", className)}
    />
  );
}
