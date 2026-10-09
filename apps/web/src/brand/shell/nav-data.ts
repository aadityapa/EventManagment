// Server-only navigation data for the V6 shell (DESIGN.md §10.0). Client
// islands never import this file: it pulls in the cms data, which must stay
// out of the browser bundle.
import { SERVICE_GROUPS } from "@/components/ui/services-index";
import type { ServiceSlug } from "@/components/ui/types";
import { services } from "@/data/cms";
import { MEGA_EXPLORE_LINKS, NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { formatCurrency, getWhatsAppUrl } from "@/lib/utils";

export { MEGA_EXPLORE_LINKS, NAV_LINKS };

/** Resized WebP wordmark (11 KB / 33 KB) — the base64 SVG stays for schema and favicons. */
export const WORDMARK = {
  src: "/brand/nexyyra-logo-160.webp",
  srcSet: "/brand/nexyyra-logo-160.webp 160w, /brand/nexyyra-logo-320.webp 320w",
  width: 520,
  height: 499,
} as const;

export const PRIMARY_LABEL = "Get a Free Proposal";
export const PROPOSAL_HREF = "/book-event";
export const TEL_HREF = `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`;
export const MAIL_HREF = `mailto:${SITE_CONFIG.email}`;
export const WHATSAPP_HREF = getWhatsAppUrl("Hello Nexyyra Events, I'd like to plan an event.");

export type NavService = { slug: ServiceSlug; title: string; href: string; from: string };
export type NavServiceGroup = { id: string; label: string; items: NavService[] };

/** The twelve services in the index's three editorial groups, each with its starting price. */
export const NAV_SERVICE_GROUPS: NavServiceGroup[] = SERVICE_GROUPS.map((group) => ({
  id: group.id,
  label: group.label,
  items: group.slugs.flatMap((slug) => {
    const service = services.find((s) => s.slug === slug);
    return service
      ? [{ slug, title: service.title, href: `/services/${slug}`, from: `From ${formatCurrency(service.basePrice)}` }]
      : [];
  }),
}));

export const NAV_SERVICES: NavService[] = NAV_SERVICE_GROUPS.flatMap((g) => g.items);
