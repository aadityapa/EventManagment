/** Contextual internal links — wedding keyword cannibalization fix */

export type ContextualLink = {
  href: string;
  label: string;
  description: string;
};

const SERVICE_LINKS: Record<string, ContextualLink[]> = {
  "wedding-planning": [
    {
      href: "/wedding-planner-pune",
      label: "Wedding Planner Pune",
      description: "Local luxury wedding planning from our Pune studio — venue scouting, vendor curation, and on-ground execution.",
    },
    {
      href: "/destination-wedding-planner-pune",
      label: "Destination Wedding Planner Pune",
      description: "Plan Udaipur, Goa, and international destination weddings with a Pune-based planning team.",
    },
  ],
  "destination-weddings": [
    {
      href: "/destination-wedding-planner-pune",
      label: "Destination Wedding Planner from Pune",
      description: "Full destination wedding logistics — guest travel, multi-day itineraries, and on-ground command centres.",
    },
  ],
};

const LOCAL_PAGE_LINKS: Record<string, ContextualLink[]> = {
  "wedding-planner-pune": [
    {
      href: "/services/wedding-planning",
      label: "Wedding Planning Service",
      description: "Overview of Nexyyra's full-service wedding planning — from mehendi to reception.",
    },
    {
      href: "/blog/wedding-planner-pune-guide",
      label: "How to Choose a Wedding Planner in Pune",
      description: "Questions to ask, red flags, and what premium planning looks like in Pune.",
    },
    {
      href: "/blog/pune-luxury-venues-guide",
      label: "Pune Luxury Venues Guide",
      description: "Ballrooms, garden estates, and boutique properties matched to your guest count.",
    },
    {
      href: "/contact",
      label: "Contact Nexyyra Pune",
      description: "Book a complimentary consultation with our Pune wedding planning team.",
    },
  ],
  "destination-wedding-planner-pune": [
    {
      href: "/services/destination-weddings",
      label: "Destination Weddings Service",
      description: "Generic destination wedding planning — venues, guest logistics, and legal liaison.",
    },
    {
      href: "/blog/udaipur-palace-wedding-guide",
      label: "Udaipur Palace Wedding Guide",
      description: "Heritage palace celebrations — venues, guest logistics, and regulatory requirements.",
    },
    {
      href: "/blog/goa-beach-wedding-guide",
      label: "Goa Beach Wedding Guide",
      description: "Coastal destination weddings — permits, weather backup, and guest experiences.",
    },
  ],
};

const BLOG_PAGE_LINKS: Record<string, ContextualLink[]> = {
  "wedding-planner-pune-guide": [
    {
      href: "/wedding-planner-pune",
      label: "Luxury Wedding Planner in Pune",
      description: "Hire Nexyyra for full-service wedding planning in Pune and Maharashtra.",
    },
  ],
  "destination-wedding-trends-2026": [
    {
      href: "/services/destination-weddings",
      label: "Destination Weddings Service",
      description: "Nexyyra's destination wedding planning — Udaipur, Goa, Kerala, and international venues.",
    },
    {
      href: "/destination-wedding-planner-pune",
      label: "Destination Wedding Planner from Pune",
      description: "Plan your destination celebration with our Pune-based specialist team.",
    },
  ],
  "udaipur-palace-wedding-guide": [
    {
      href: "/destination-wedding-planner-pune",
      label: "Destination Wedding Planner from Pune",
      description: "Specialist destination planning for Udaipur palace weddings and multi-venue coordination.",
    },
  ],
  "goa-beach-wedding-guide": [
    {
      href: "/destination-wedding-planner-pune",
      label: "Destination Wedding Planner from Pune",
      description: "Beach wedding permits, guest logistics, and weather backup managed from Pune.",
    },
  ],
};

/** AEO opening copy — answers "what is this page about?" in 1–2 sentences */
export const SERVICE_PAGE_INTROS: Record<string, string> = {
  "wedding-planning":
    "This page describes Nexyyra's full-service wedding planning — venue scouting, vendor curation, design direction, and on-ground execution for luxury celebrations in Pune and across India.",
  "destination-weddings":
    "This page covers Nexyyra's destination wedding planning service — venue sourcing, guest travel logistics, multi-day itineraries, and on-ground execution for celebrations beyond Pune.",
};

export function getServiceContextualLinks(slug: string): ContextualLink[] {
  return SERVICE_LINKS[slug] ?? [];
}

export function getLocalPageContextualLinks(slug: string): ContextualLink[] {
  return LOCAL_PAGE_LINKS[slug] ?? [];
}

export function getBlogContextualLinks(slug: string): ContextualLink[] {
  return BLOG_PAGE_LINKS[slug] ?? [];
}

/** SEO titles/descriptions for high-intent service pages */
export const SERVICE_SEO: Record<string, { title: string; description: string }> = {
  "wedding-planning": {
    title: "Luxury Wedding Planning Pune",
    description:
      "Full-service luxury wedding planning in Pune — venue scouting, vendor curation, multi-day coordination, and on-ground execution by Nexyyra Events.",
  },
  "destination-weddings": {
    title: "Destination Wedding Planning India",
    description:
      "Destination wedding planning from Pune — Udaipur palaces, Goa beaches, and international venues with guest logistics and luxury execution.",
  },
};

export function getServiceSeo(slug: string) {
  return SERVICE_SEO[slug];
}

export function getServicePageIntro(slug: string): string | undefined {
  return SERVICE_PAGE_INTROS[slug];
}
