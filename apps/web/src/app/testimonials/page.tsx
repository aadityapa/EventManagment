import { TestimonialsPageContent } from "@/components/pages/testimonials-page-content";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Client Testimonials",
  description: "Read testimonials from Glitz Events clients — luxury weddings, corporate galas, and destination celebrations.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return <TestimonialsPageContent />;
}
