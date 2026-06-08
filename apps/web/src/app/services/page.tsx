import { ServicesPageContent } from "@/components/pages/services-page-content";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Luxury Event Services",
  description: "Luxury weddings, corporate events, destination celebrations, concerts, product launches, and celebrity management across India.",
  path: "/services",
});

export default function ServicesPage() {
  return <ServicesPageContent />;
}
