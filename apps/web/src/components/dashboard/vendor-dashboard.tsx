"use client";

import { Star, Calendar, DollarSign, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/lux-button";

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
    <div className="bg-lux-bg min-h-[100dvh] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="lux-label mb-2">Vendor Portal</p>
            <h1 className="font-display text-h2 font-semibold text-lux-white">Vendor Dashboard</h1>
            <p className="max-w-[44rem] text-body text-lux-muted mt-1">Lens & Light Studio</p>
          </div>
          <Button href="/dashboard/vendor?tab=profile" variant="ghost" size="compact" cta="edit_profile" location="vendor_dashboard">
            <User className="h-4 w-4" />
            Edit Profile
          </Button>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active Bookings", value: "4", icon: Calendar },
            { label: "This Month Earnings", value: "₹4.2L", icon: DollarSign },
            { label: "Average Rating", value: "4.9", icon: Star },
            { label: "Total Reviews", value: "127", icon: User },
          ].map((stat) => (
            <Card level={1} key={stat.label} className="p-5">
              <stat.icon className="h-5 w-5 text-[var(--lux-gold)]" />
              <p className="mt-2 text-sm text-[var(--lux-subtle)]">{stat.label}</p>
              <p className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--lux-white)]">
                {stat.value}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-4 font-display text-xl font-semibold text-lux-white">Recent Bookings</h2>
            <div className="space-y-3">
              {mockBookings.map((b) => (
                <Card level={1} key={b.id} className="p-4">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-medium text-[var(--lux-white)]">{b.client}</p>
                      <p className="text-sm text-[var(--lux-subtle)]">{b.event} · {b.date}</p>
                    </div>
                    <p className="font-semibold text-[var(--lux-gold)]">
                      ₹{(b.amount / 100000).toFixed(1)}L
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl font-semibold text-lux-white">Recent Reviews</h2>
            <div className="space-y-3">
              {mockReviews.map((r) => (
                <Card level={1} key={r.id} className="p-4">
                  <div className="flex gap-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[var(--lux-gold)] text-[var(--lux-gold)]" />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-lux-muted">&ldquo;{r.text}&rdquo;</p>
                  <p className="mt-2 text-xs text-[var(--lux-subtle)]">— {r.author}</p>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
