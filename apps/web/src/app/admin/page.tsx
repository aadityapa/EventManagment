import { generateSEO } from "@/lib/seo";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata = generateSEO({
  title: "Admin Dashboard",
  description: "JIJU Events administration panel.",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return <AdminDashboard />;
}
