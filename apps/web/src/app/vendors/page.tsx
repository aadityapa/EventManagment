import { VendorsPageContent } from "@/components/pages/vendors-page-content";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Premium Vendor Partners",
  description: "Curated network of luxury photographers, decorators, caterers, entertainers, and artisans.",
  path: "/vendors",
});

export default function VendorsPage() {
  return <VendorsPageContent />;
}
