import { ContactPageContent } from "@/components/pages/contact-page-content";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Contact — Book a Consultation",
  description: "Contact Glitz Events & Promotions for luxury wedding planning, corporate events, and destination celebrations in Pune.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageContent />;
}
