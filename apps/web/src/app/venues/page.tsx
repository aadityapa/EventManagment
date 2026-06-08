import { generateSEO } from "@/lib/seo";
import { VenuesView } from "@/brand";

export const metadata = generateSEO({ title: "Luxury Venues", description: "Exclusive venues across Pune, Mumbai, Goa, Jaipur, and Udaipur.", path: "/venues" });

export default function VenuesPage() {
  return <VenuesView />;
}
