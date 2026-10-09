import { generateSEO } from "@/lib/seo";
import { VendorDashboard } from "@/components/dashboard/vendor-dashboard";

export const metadata = generateSEO({
  title: "Vendor Dashboard",
  description: "Manage your vendor profile, bookings, reviews, and earnings.",
  path: "/dashboard/vendor",
  noIndex: true,
});

export default function VendorDashboardPage() {
  // The marker is server-rendered so pages/shell.css hides the marketing chrome before hydration;
  // it trails the content so the dashboard keeps its own first-child layout.
  return (
    <>
      <VendorDashboard />
      <span className="lux-app-route" hidden />
    </>
  );
}
