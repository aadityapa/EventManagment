import { generateSEO } from "@/lib/seo";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata = generateSEO({
  title: "Admin Dashboard",
  description: "Nexyyra Events administration panel.",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  // The marker is server-rendered so pages/shell.css hides the marketing chrome before hydration;
  // it trails the content so the dashboard keeps its own first-child layout.
  return (
    <>
      <AdminDashboard />
      <span className="lux-app-route" hidden />
    </>
  );
}
