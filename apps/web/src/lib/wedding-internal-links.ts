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
      description: "Wedding planning in Pune — venue shortlisting, vendor contracts, and on-ground management of every function.",
    },
    {
      href: "/destination-wedding-planner-pune",
      label: "Destination Wedding Planner Pune",
      description: "Udaipur, Goa and other destination weddings, planned from our Pune coordination office; international destinations on request.",
    },
  ],
  "destination-weddings": [
    {
      href: "/destination-wedding-planner-pune",
      label: "Destination Wedding Planner from Pune",
      description: "Full destination wedding logistics — guest travel, multi-day itineraries, and on-ground hospitality desks.",
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
      description: "Questions to ask, red flags, and what full-service planning should include.",
    },
    {
      href: "/blog/pune-luxury-venues-guide",
      label: "Pune Luxury Venues Guide",
      description: "Ballrooms, garden estates, and boutique properties matched to your guest count.",
    },
    {
      href: "/contact",
      label: "Contact Nexyyra Pune",
      description: "Book a free consultation; a planner replies the same day.",
    },
  ],
  "destination-wedding-planner-pune": [
    {
      href: "/services/destination-weddings",
      label: "Destination Weddings Service",
      description: "Destination wedding planning — venues, guest logistics, and permits.",
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
      description: "Nexyyra's destination wedding planning — Udaipur, Goa and other Indian destinations, and international destinations on request.",
    },
    {
      href: "/destination-wedding-planner-pune",
      label: "Destination Wedding Planner from Pune",
      description: "Plan your destination celebration with one event director, coordinated from Pune.",
    },
  ],
  "udaipur-palace-wedding-guide": [
    {
      href: "/destination-wedding-planner-pune",
      label: "Destination Wedding Planner from Pune",
      description: "Destination planning for Udaipur palace weddings and multi-venue coordination.",
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
    "We plan your wedding end to end — venue shortlisting, vendor contracts, design direction and on-ground management of every function, in Pune and across India, with one event director from first consultation to farewell.",
  "destination-weddings":
    "Take your wedding to a palace, a beach or the hills. We shortlist the venue, move and host your guests, build the multi-day itinerary and run every function on the ground — across India, and international destinations on request.",
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
      "Full-service wedding planning in Pune — venue shortlisting, vendor contracts, multi-day coordination and on-ground management by Nexyyra Events.",
  },
  "destination-weddings": {
    title: "Destination Wedding Planning India",
    description:
      "Destination wedding planning from Pune — Udaipur palaces, Goa beaches and international destinations on request, with guest travel and on-ground management.",
  },
};

export function getServiceSeo(slug: string) {
  return SERVICE_SEO[slug];
}

export function getServicePageIntro(slug: string): string | undefined {
  return SERVICE_PAGE_INTROS[slug];
}
