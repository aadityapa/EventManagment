"use client";

import { Star, Calendar, DollarSign, User } from "lucide-react";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { BrandButton } from "@/brand/primitives/brand-button";

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
    <div className="dashboard-shell v5-grain min-h-[100dvh] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="v5-kicker mb-2">Vendor Portal</p>
            <h1 className="v5-title font-[family-name:var(--font-playfair)]">Vendor Dashboard</h1>
            <p className="v5-body mt-1 text-[var(--text-muted)]">Lens & Light Studio</p>
          </div>
          <BrandButton href="/dashboard/vendor?tab=profile" variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            Edit Profile
          </BrandButton>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active Bookings", value: "4", icon: Calendar },
            { label: "This Month Earnings", value: "₹4.2L", icon: DollarSign },
            { label: "Average Rating", value: "4.9", icon: Star },
            { label: "Total Reviews", value: "127", icon: User },
          ].map((stat) => (
            <GlassPanel key={stat.label} glow className="p-5">
              <stat.icon className="h-5 w-5 text-[var(--v5-gold-metallic)]" />
              <p className="mt-2 text-sm text-[var(--text-muted)]">{stat.label}</p>
              <p className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--text-primary)]">
                {stat.value}
              </p>
            </GlassPanel>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="v5-title mb-4 text-xl font-[family-name:var(--font-cormorant)]">Recent Bookings</h2>
            <div className="space-y-3">
              {mockBookings.map((b) => (
                <GlassPanel key={b.id} variant="liquid" className="p-4">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{b.client}</p>
                      <p className="text-sm text-[var(--text-muted)]">{b.event} · {b.date}</p>
                    </div>
                    <p className="font-semibold text-[var(--v5-gold-luxury)]">
                      ₹{(b.amount / 100000).toFixed(1)}L
                    </p>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </section>

          <section>
            <h2 className="v5-title mb-4 text-xl font-[family-name:var(--font-cormorant)]">Recent Reviews</h2>
            <div className="space-y-3">
              {mockReviews.map((r) => (
                <GlassPanel key={r.id} variant="commission" className="p-4">
                  <div className="flex gap-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[var(--v5-gold-luxury)] text-[var(--v5-gold-luxury)]" />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">&ldquo;{r.text}&rdquo;</p>
                  <p className="mt-2 text-xs text-[var(--text-muted)]">— {r.author}</p>
                </GlassPanel>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
