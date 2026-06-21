import type { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export type StitchPageConfig = {
  screen: string;
  title: string;
  description: string;
  path: string;
};

export const STITCH_PAGES: Record<string, StitchPageConfig> = {
  home: {
    screen: "home",
    title: "Luxury Event Management Pune",
    description:
      "Nexyyra Events — premier luxury event management in Pune. Weddings, corporate events, concerts & celebrity management.",
    path: "/",
  },
  about: {
    screen: "about",
    title: "About Us",
    description:
      "Learn about Nexyyra Events — 15+ years of luxury event management excellence in Pune.",
    path: "/about",
  },
  services: {
    screen: "services",
    title: "Experiences",
    description:
      "Comprehensive luxury event management — weddings, corporate events, concerts, exhibitions, and more.",
    path: "/services",
  },
  contact: {
    screen: "contact",
    title: "Contact",
    description: "Get in touch with Nexyyra Events for a free consultation.",
    path: "/contact",
  },
  "book-event": {
    screen: "book-event",
    title: "Book Event",
    description: "Book your extraordinary event with Nexyyra Events.",
    path: "/book-event",
  },
  portfolio: {
    screen: "portfolio",
    title: "Portfolio",
    description: "Explore our portfolio of luxury weddings, corporate galas, and celebrity events.",
    path: "/portfolio",
  },
  pricing: {
    screen: "pricing",
    title: "Pricing",
    description: "Transparent pricing packages for luxury event management in Pune.",
    path: "/pricing",
  },
  testimonials: {
    screen: "testimonials",
    title: "Testimonials",
    description: "What our clients say about Nexyyra Events.",
    path: "/testimonials",
  },
  gallery: {
    screen: "gallery",
    title: "Gallery",
    description: "Visual stories from our most prestigious events.",
    path: "/gallery",
  },
  faqs: {
    screen: "faqs",
    title: "FAQs",
    description: "Frequently asked questions about booking and planning your event.",
    path: "/faqs",
  },
  blog: {
    screen: "blog",
    title: "Blog",
    description: "Event planning insights and inspiration from Nexyyra Events.",
    path: "/blog",
  },
  terms: {
    screen: "terms",
    title: "Terms of Service",
    description: "Terms of service for Nexyyra Events.",
    path: "/terms",
  },
  privacy: {
    screen: "privacy",
    title: "Privacy Policy",
    description: "How Nexyyra Events handles your data.",
    path: "/privacy",
  },
  refund: {
    screen: "refund",
    title: "Refund Policy",
    description: "Refund and cancellation policy for Nexyyra Events.",
    path: "/refund",
  },
  vendors: {
    screen: "vendors",
    title: "Vendor Partners",
    description: "Our trusted vendor network for flawless event execution.",
    path: "/vendors",
  },
  venues: {
    screen: "venues",
    title: "Venues",
    description: "Stunning venues for your next extraordinary celebration in Pune.",
    path: "/venues",
  },
};

export function stitchMetadata(key: keyof typeof STITCH_PAGES): Metadata {
  const cfg = STITCH_PAGES[key];
  return generateSEO({
    title: cfg.title,
    description: cfg.description,
    path: cfg.path,
  });
}
