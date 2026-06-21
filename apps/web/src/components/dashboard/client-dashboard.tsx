"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Wallet,
  FileText,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard?tab=bookings", label: "Bookings", icon: Calendar },
  { href: "/dashboard?tab=timeline", label: "Timeline", icon: Clock },
  { href: "/dashboard?tab=budget", label: "Budget", icon: Wallet },
  { href: "/dashboard?tab=documents", label: "Documents", icon: FileText },
  { href: "/dashboard?tab=messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard?tab=payments", label: "Payments", icon: CreditCard },
];

type BookingRow = {
  id: string;
  bookingNumber: string;
  eventType: string;
  eventDate: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
};

export function ClientDashboard() {
  const pathname = usePathname();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/bookings/my", { method: "GET", cache: "no-store" });
        const data = (await res.json().catch(() => [])) as unknown;
        if (!ignore && res.ok && Array.isArray(data)) {
          const rows = (data as unknown[]).map((raw) => {
            const r = (raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}) as Record<string, unknown>;
            return {
              id: String(r.id ?? ""),
              bookingNumber: String(r.bookingNumber ?? ""),
              eventType: String(r.eventType ?? ""),
              eventDate: String(r.eventDate ?? ""),
              status: String(r.status ?? ""),
              paymentStatus: String(r.paymentStatus ?? ""),
              totalAmount: Number(r.totalAmount ?? 0),
            };
          }).filter((b) => b.id && b.bookingNumber);
          setBookings(rows);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status !== "CANCELLED").length;
    const upcoming = bookings.filter((b) => new Date(b.eventDate) > new Date()).length;
    const paid = bookings.filter((b) => b.paymentStatus === "PAID").length;
    const total = bookings.reduce((sum, b) => sum + (Number.isFinite(b.totalAmount) ? b.totalAmount : 0), 0);
    return { active, upcoming, paid, total };
  }, [bookings]);

  return (
    <div className="dashboard-shell v5-grain flex min-h-[100dvh] flex-col lg:flex-row">
      <aside className="border-b border-[var(--v5-glass-border)] lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
        <GlassPanel variant="commission" className="m-4 p-5 lg:m-5" glow>
          <p className="v5-kicker mb-2">Client Portal</p>
          <h2 className="v5-title font-[family-name:var(--font-playfair)]">Your Commission</h2>
          <nav className="mt-6 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "touch-target flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--v5-gold-luxury)]/10 lg:w-full",
                  pathname === "/dashboard" && item.href === "/dashboard" &&
                    "bg-[var(--v5-gold-luxury)]/12 text-[var(--v5-copper)]"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0 text-[var(--v5-gold-metallic)]" />
                {item.label}
              </Link>
            ))}
          </nav>
        </GlassPanel>
      </aside>

      <main className="flex-1 px-4 py-6 lg:px-8 lg:py-10">
        <header className="mb-8">
          <p className="v5-kicker mb-2">Overview</p>
          <h1 className="v5-title font-[family-name:var(--font-playfair)] text-[var(--text-primary)]">
            Dashboard
          </h1>
          <p className="v5-body mt-2 text-[var(--text-muted)]">
            Welcome back — here is the status of your extraordinary events.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Active Bookings", value: loading ? "—" : String(stats.active) },
            { label: "Upcoming Events", value: loading ? "—" : String(stats.upcoming) },
            { label: "Paid Bookings", value: loading ? "—" : String(stats.paid) },
            { label: "Total Value", value: loading ? "—" : formatCurrency(stats.total) },
          ].map((stat) => (
            <GlassPanel key={stat.label} glow className="p-5">
              <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
              <p className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-semibold v5-gold-text">
                {stat.value}
              </p>
            </GlassPanel>
          ))}
        </div>

        <div className="mt-10 space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="v5-title text-xl font-[family-name:var(--font-cormorant)]">Your Bookings</h2>
            <div className="v5-hairline hidden max-w-[8rem] flex-1 sm:block" aria-hidden />
          </div>
          {loading ? (
            <GlassPanel className="p-5 text-sm text-[var(--text-muted)]">Loading your bookings…</GlassPanel>
          ) : bookings.length ? (
            bookings.map((b) => (
              <GlassPanel key={b.id} variant="liquid" className="p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{b.eventType}</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {b.bookingNumber} · {formatDate(b.eventDate)}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--v5-gold-luxury)]">
                      {formatCurrency(b.totalAmount)}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className="inline-flex w-fit rounded-full border border-[var(--v5-glass-border)] bg-[var(--v5-gold-luxury)]/10 px-3 py-1 text-xs font-medium text-[var(--v5-copper)]">
                      {b.status}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">Payment: {b.paymentStatus}</span>
                  </div>
                </div>
              </GlassPanel>
            ))
          ) : (
            <GlassPanel variant="commission" glow className="p-6">
              <p className="text-sm text-[var(--text-muted)]">No bookings yet.</p>
              <Link
                href="/book-event"
                className="mt-3 inline-block text-sm font-semibold text-[var(--v5-gold-luxury)] hover:text-[var(--v5-copper)]"
              >
                Book your first event →
              </Link>
            </GlassPanel>
          )}
        </div>
      </main>
    </div>
  );
}
