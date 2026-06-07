"use client";

import Link from "next/link";
import { Star, Calendar, DollarSign, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockBookings = [
  { id: "1", client: "Kapoor Family", event: "Wedding", date: "2026-11-20", amount: 850000 },
  { id: "2", client: "TechCorp", event: "Corporate Gala", date: "2026-10-05", amount: 1200000 },
];

const mockReviews = [
  { id: "1", author: "Aisha K.", rating: 5, text: "Absolutely stunning decor work!" },
  { id: "2", author: "Vikram M.", rating: 5, text: "Professional and creative team." },
];

export function VendorDashboard() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Vendor Dashboard</h1>
          <p className="text-muted">Lens & Light Studio</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/vendor?tab=profile">
            <User className="h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Bookings", value: "4", icon: Calendar },
          { label: "This Month Earnings", value: "₹4.2L", icon: DollarSign },
          { label: "Average Rating", value: "4.9", icon: Star },
          { label: "Total Reviews", value: "127", icon: User },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <stat.icon className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
            <p className="font-display text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-xl font-semibold">Recent Bookings</h2>
          <div className="space-y-3">
            {mockBookings.map((b) => (
              <div key={b.id} className="glass-card p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{b.client}</p>
                    <p className="text-sm text-muted">{b.event} · {b.date}</p>
                  </div>
                  <p className="font-semibold text-primary">₹{(b.amount / 100000).toFixed(1)}L</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-xl font-semibold">Recent Reviews</h2>
          <div className="space-y-3">
            {mockReviews.map((r) => (
              <div key={r.id} className="glass-card p-4">
                <div className="flex gap-1">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mt-2 text-sm">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-2 text-xs text-muted">— {r.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
