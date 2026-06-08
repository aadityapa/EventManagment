import { VenuesPageContent } from "@/components/pages/venues-page-content";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Luxury Venues — Pune, Mumbai, Goa, Jaipur",
  description: "Explore exclusive venues for weddings, corporate events, and destination celebrations across India.",
  path: "/venues",
});

export default function VenuesPage() {
  return <VenuesPageContent />;
}
