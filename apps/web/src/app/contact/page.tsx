import { ContactView } from "@/brand";
import { BRAND_REPLY_HOURS_SHORT } from "@/brand/data/content";
import { JsonLd } from "@/components/ui";
import { SITE_CONFIG } from "@/lib/constants";
import { contactPageSchema, generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Contact — Talk to a Planner",
  description: `Talk to a ${SITE_CONFIG.shortName} planner: call or WhatsApp ${SITE_CONFIG.phone} or email ${SITE_CONFIG.email}. ${BRAND_REPLY_HOURS_SHORT}.`,
  path: "/contact",
});

/* ContactPage only — the old contact FAQ markup described answers the page
   no longer renders. Breadcrumb JSON-LD comes from the cover. */
export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema()} />
      <ContactView />
    </>
  );
}
