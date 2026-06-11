"use client";

import dynamic from "next/dynamic";
import { Users, Calendar, TrendingUp, DollarSign } from "lucide-react";

const AdminRevenueChart = dynamic(
  () => import("./admin-revenue-chart").then((m) => m.AdminRevenueChart),
  {
    ssr: false,
    loading: () => <div className="h-64 min-h-[256px] w-full animate-pulse rounded-xl bg-white/5" />,
  }
);

const revenueData = [
  { month: "Jan", revenue: 45 },
  { month: "Feb", revenue: 52 },
  { month: "Mar", revenue: 48 },
  { month: "Apr", revenue: 61 },
  { month: "May", revenue: 55 },
  { month: "Jun", revenue: 67 },
];

const recentBookings = [
  { id: "Glitz-001", client: "Sharma Wedding", amount: "₹18L", status: "Confirmed" },
  { id: "Glitz-002", client: "TechCorp Gala", amount: "₹32L", status: "Planning" },
  { id: "Glitz-003", client: "Music Fest", amount: "₹85L", status: "Confirmed" },
];

const recentLeads = [
  { id: "L-101", name: "Rajesh Kumar", event: "Corporate", date: "2026-06-05" },
  { id: "L-102", name: "Priya Nair", event: "Wedding", date: "2026-06-04" },
  { id: "L-103", name: "Global Finance", event: "Conference", date: "2026-06-03" },
];

export function AdminDashboard() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-bold md:text-3xl">Admin Dashboard</h1>
      <p className="text-muted">Glitz Events & Promotions management overview</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: "₹3.2Cr", icon: DollarSign, change: "+12%" },
          { label: "Active Bookings", value: "48", icon: Calendar, change: "+5" },
          { label: "New Leads", value: "23", icon: Users, change: "+8" },
          { label: "Conversion Rate", value: "34%", icon: TrendingUp, change: "+2%" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center justify-between">
              <stat.icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium text-green-600">{stat.change}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
            <p className="font-display text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 glass-card p-6">
        <h2 className="mb-4 font-display text-xl font-semibold">Revenue Overview</h2>
        <AdminRevenueChart data={revenueData} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="glass-card overflow-hidden">
          <h2 className="border-b border-border p-4 font-display text-lg font-semibold">
            Recent Bookings
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="p-4 font-medium">ID</th>
                  <th className="p-4 font-medium">Client</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-border/50">
                    <td className="p-4 font-mono text-xs">{b.id}</td>
                    <td className="p-4">{b.client}</td>
                    <td className="p-4 text-primary">{b.amount}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <h2 className="border-b border-border p-4 font-display text-lg font-semibold">
            Recent Leads
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="p-4 font-medium">ID</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Event</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((l) => (
                  <tr key={l.id} className="border-b border-border/50">
                    <td className="p-4 font-mono text-xs">{l.id}</td>
                    <td className="p-4">{l.name}</td>
                    <td className="p-4">{l.event}</td>
                    <td className="p-4 text-muted">{l.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
