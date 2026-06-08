import { generateSEO } from "@/lib/seo";
import { ContactView } from "@/brand";

export const metadata = generateSEO({ title: "Contact — Book Consultation", description: "Contact Glitz Events for luxury wedding and corporate event planning in Pune.", path: "/contact" });

export default function ContactPage() {
  return <ContactView />;
}
