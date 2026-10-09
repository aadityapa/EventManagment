import { generateSEO } from "@/lib/seo";
import { ClientDashboard } from "@/components/dashboard/client-dashboard";

export const metadata = generateSEO({
  title: "Client Dashboard",
  description: "Track your event bookings, budget, timeline, and communications.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardPage() {
  // The marker is server-rendered so pages/shell.css hides the marketing chrome before hydration;
  // it trails the content so the dashboard keeps its own first-child layout.
  return (
    <>
      <ClientDashboard />
      <span className="lux-app-route" hidden />
    </>
  );
}
