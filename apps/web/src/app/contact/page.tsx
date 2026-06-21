import { generateSEO, contactPageSchema, faqSchema } from "@/lib/seo";
import { ContactView } from "@/brand";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = generateSEO({
  title: "Contact — Book Consultation",
  description: `Contact ${SITE_CONFIG.name} for luxury wedding and corporate event planning in Pune. Call ${SITE_CONFIG.phone} or email ${SITE_CONFIG.email}.`,
  path: "/contact",
});

const CONTACT_FAQS = [
  {
    question: "How do I contact Nexyyra Events?",
    answer: `Call ${SITE_CONFIG.phone}, email ${SITE_CONFIG.email}, or WhatsApp ${SITE_CONFIG.whatsapp}. Book online at /book-event for a complimentary consultation.`,
  },
  {
    question: "Where is Nexyyra Events located?",
    answer: "Nexyyra Events is headquartered in Pune, Maharashtra, India, serving clients across Maharashtra, India, and international destinations.",
  },
  {
    question: "What are Nexyyra Events' business hours?",
    answer: "Monday to Saturday, 9:00 AM to 9:00 PM IST. Emergency on-ground support is available 24/7 during active events.",
  },
];

export default function ContactPage() {
  const contactLd = contactPageSchema();
  const faqLd = faqSchema(CONTACT_FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <ContactView />
    </>
  );
}
