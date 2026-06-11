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
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col lg:flex-row">
      <aside className="border-b border-border bg-secondary/5 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="container-page py-4 lg:px-4">
          <h2 className="mb-3 font-display text-lg font-bold lg:mb-4">Client Portal</h2>
          <nav className="scroll-nav gap-2 lg:flex-col lg:overflow-visible">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "touch-target flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-primary/10 lg:w-full",
                  pathname === "/dashboard" && item.href === "/dashboard" && "bg-primary/10 text-primary"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <main className="container-page flex-1 py-6 lg:py-8">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Dashboard Overview</h1>
        <p className="mt-1 text-muted">Welcome back! Here&apos;s your event status.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active Bookings", value: loading ? "—" : String(stats.active) },
            { label: "Upcoming Events", value: loading ? "—" : String(stats.upcoming) },
            { label: "Paid Bookings", value: loading ? "—" : String(stats.paid) },
            { label: "Total Value", value: loading ? "—" : formatCurrency(stats.total) },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-5">
              <p className="text-sm text-muted">{stat.label}</p>
              <p className="mt-1 font-display text-2xl font-bold gradient-text">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="font-display text-xl font-semibold">Your Bookings</h2>
          {loading ? (
            <div className="glass-card p-5 text-sm text-muted">Loading your bookings…</div>
          ) : bookings.length ? (
            bookings.map((b) => (
              <div key={b.id} className="glass-card p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold">{b.eventType}</p>
                    <p className="text-sm text-muted">
                      {b.bookingNumber} · {formatDate(b.eventDate)}
                    </p>
                    <p className="mt-1 text-sm text-primary">{formatCurrency(b.totalAmount)}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {b.status}
                    </span>
                    <span className="text-xs text-muted">Payment: {b.paymentStatus}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card p-5">
              <p className="text-sm text-muted">No bookings yet.</p>
              <Link href="/book-event" className="mt-3 inline-block text-sm font-semibold text-primary">
                Book your first event →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
