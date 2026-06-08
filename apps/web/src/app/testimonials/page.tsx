import { generateSEO } from "@/lib/seo";
import { TestimonialsView } from "@/brand";

export const metadata = generateSEO({ title: "Client Testimonials", description: "Stories from Glitz Events clients — luxury weddings and corporate galas.", path: "/testimonials" });

export default function TestimonialsPage() {
  return <TestimonialsView />;
}
