import { generateSEO } from "@/lib/seo";
import { ServicesView } from "@/brand";

export const metadata = generateSEO({ title: "Luxury Event Services", description: "Luxury weddings, corporate galas, destination celebrations, and premium experiences.", path: "/services" });

export default function ServicesPage() {
  return <ServicesView />;
}
