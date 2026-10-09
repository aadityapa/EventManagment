import { assetForRole } from "@/brand/data/image-curation";
import { Cover } from "@/components/ui";
import { getWhatsAppUrl } from "@/lib/utils";

const WHATSAPP_MESSAGE = "Hello Nexyyra Events, I would like to talk to a planner about my event.";

/**
 * The home cover: the offer, the primary action and three commitments sit in
 * the first phone screen; the local 4:5 poster (the LCP) follows below them.
 */
export function HomeCover() {
  return (
    <Cover
      size="xl"
      eyebrow="Nexyyra Events · Pune"
      title="Luxury weddings and corporate events, planned end-to-end"
      titleAccent="end-to-end"
      lead="From Pune to destinations across India, one accountable team designs, produces and runs your occasion."
      primary={{ href: "#plan", cta: "home_cover_proposal" }}
      secondary={{ href: getWhatsAppUrl(WHATSAPP_MESSAGE), label: "WhatsApp a planner", cta: "home_cover_whatsapp", external: true }}
      asset={assetForRole("cover-home")?.id}
      commitments
      entityLine
    />
  );
}
