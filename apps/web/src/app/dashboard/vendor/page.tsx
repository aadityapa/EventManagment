import { generateSEO } from "@/lib/seo";
import { VendorDashboard } from "@/components/dashboard/vendor-dashboard";

export const metadata = generateSEO({
  title: "Vendor Dashboard",
  description: "Manage your vendor profile, bookings, reviews, and earnings.",
  path: "/dashboard/vendor",
  noIndex: true,
});

export default function VendorDashboardPage() {
  return <VendorDashboard />;
}
