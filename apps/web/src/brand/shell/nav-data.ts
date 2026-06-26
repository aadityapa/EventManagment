import {
  Building2,
  Cake,
  Heart,
  LayoutGrid,
  Megaphone,
  Music,
  Plane,
  Rocket,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { MEGA_EXPLORE_LINKS } from "@/lib/constants";

export type ExperienceCategory = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/** Mobile accordion + desktop mega menu — canonical order. */
export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  { label: "Wedding", href: "/services/wedding-planning", icon: Heart },
  { label: "Corporate", href: "/services/corporate-events", icon: Building2 },
  { label: "Destination", href: "/services/destination-weddings", icon: Plane },
  { label: "Celebrity", href: "/services/celebrity-management", icon: Star },
  { label: "Birthday", href: "/services/birthday-events", icon: Cake },
  { label: "Conference", href: "/services/conferences", icon: Users },
  { label: "Concert", href: "/services/concert-management", icon: Music },
  { label: "Product Launch", href: "/services/product-launches", icon: Rocket },
  { label: "Brand Promotion", href: "/services/brand-promotions", icon: Megaphone },
  { label: "Exhibitions", href: "/services/exhibitions", icon: LayoutGrid },
];

export const MEGA_COLUMNS: { heading: string; items: ExperienceCategory[] }[] = [
  {
    heading: "Celebrations",
    items: EXPERIENCE_CATEGORIES.filter((c) =>
      ["Wedding", "Destination", "Birthday", "Concert"].includes(c.label)
    ),
  },
  {
    heading: "Corporate",
    items: EXPERIENCE_CATEGORIES.filter((c) =>
      ["Corporate", "Product Launch", "Brand Promotion"].includes(c.label)
    ),
  },
  {
    heading: "Production",
    items: EXPERIENCE_CATEGORIES.filter((c) =>
      ["Conference", "Exhibitions", "Celebrity"].includes(c.label)
    ),
  },
  {
    heading: "Explore",
    items: [],
  },
];

export { MEGA_EXPLORE_LINKS };

export function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
