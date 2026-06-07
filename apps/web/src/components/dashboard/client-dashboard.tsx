"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Wallet,
  FileText,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard?tab=bookings", label: "Bookings", icon: Calendar },
  { href: "/dashboard?tab=timeline", label: "Timeline", icon: Clock },
  { href: "/dashboard?tab=budget", label: "Budget", icon: Wallet },
  { href: "/dashboard?tab=documents", label: "Documents", icon: FileText },
  { href: "/dashboard?tab=messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard?tab=payments", label: "Payments", icon: CreditCard },
];

const mockBookings = [
  { id: "JIJU-A1B2C3", event: "Royal Udaipur Wedding", date: "2026-12-15", status: "Confirmed", progress: 65 },
  { id: "JIJU-D4E5F6", event: "TechCorp Annual Gala", date: "2026-09-20", status: "Planning", progress: 35 },
];

export function ClientDashboard() {
  const pathname = usePathname();

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
            { label: "Active Bookings", value: "2" },
            { label: "Upcoming Events", value: "1" },
            { label: "Budget Used", value: "42%" },
            { label: "Unread Messages", value: "3" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-5">
              <p className="text-sm text-muted">{stat.label}</p>
              <p className="mt-1 font-display text-2xl font-bold gradient-text">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="font-display text-xl font-semibold">Your Bookings</h2>
          {mockBookings.map((booking) => (
            <div key={booking.id} className="glass-card p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold">{booking.event}</p>
                  <p className="text-sm text-muted">
                    {booking.id} · {booking.date}
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {booking.status}
                </span>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>Progress</span>
                  <span>{booking.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full gradient-gold"
                    style={{ width: `${booking.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
