"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type RevenuePoint = { month: string; revenue: number };

export function AdminRevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="h-64 min-h-[256px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.12)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickFormatter={(v) => `₹${v}L`} tickLine={false} axisLine={false} />
          <Tooltip formatter={(v) => [`₹${v} Lakhs`, "Revenue"]} />
          <Bar dataKey="revenue" fill="#d4af37" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

