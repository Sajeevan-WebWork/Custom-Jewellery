export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export const orderStatuses: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number | string) {
  const amount = typeof value === "number" ? value : Number(value);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "confirmed":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    case "shipped":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
    case "delivered":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "cancelled":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    default:
      return "border-[var(--border)] bg-[var(--surface)] text-[var(--text-dim)]";
  }
}

export function extractStoragePath(url: string) {
  const marker = "/storage/v1/object/public/products/";

  try {
    const pathname = new URL(url).pathname;
    const index = pathname.indexOf(marker);
    if (index === -1) return null;
    return decodeURIComponent(pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

export function playNotificationTone(audioContext?: AudioContext | null) {
  if (typeof window === "undefined") return;

  const Context = window.AudioContext || (window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
  }).webkitAudioContext;

  const context = audioContext ?? (Context ? new Context() : null);
  if (!context) return;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    660,
    context.currentTime + 0.18,
  );

  gainNode.gain.setValueAtTime(0.001, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    context.currentTime + 0.24,
  );

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + 0.24);
}
