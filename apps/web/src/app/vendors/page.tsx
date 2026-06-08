import { generateSEO } from "@/lib/seo";
import { VendorsView } from "@/brand";

export const metadata = generateSEO({ title: "Premium Vendor Partners", description: "Curated luxury vendor ecosystem — photography, decor, catering, entertainment.", path: "/vendors" });

export default function VendorsPage() {
  return <VendorsView />;
}
