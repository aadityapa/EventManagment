import { generateSEO } from "@/lib/seo";
import { ClientDashboard } from "@/components/dashboard/client-dashboard";

export const metadata = generateSEO({
  title: "Client Dashboard",
  description: "Track your event bookings, budget, timeline, and communications.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardPage() {
  return <ClientDashboard />;
}
