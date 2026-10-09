// Server component. About-page glyphs in the site's engraved-hairline style
// (DESIGN.md §7): 24-grid, arcs and lines only, one gold jewel each. They stand
// in for the lucide icons the pre-V6 About page used.
import type { ReactNode } from "react";
import { IconSvg, Jewel, type IconProps } from "@/components/icons/service-icons";

const GLYPHS = {
  eye: (
    <>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <circle cx="12" cy="12" r="3" />
      <Jewel cx={12} cy={12} />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5" />
      <path d="M12 12l7-7M16.5 5h2.5v2.5" />
      <Jewel cx={12} cy={12} />
    </>
  ),
  gem: (
    <>
      <path d="M6 4.5h12l3 5-9 10-9-10z" />
      <path d="M3 9.5h18M9 4.5l-1.5 5 4.5 10 4.5-10-1.5-5" />
      <Jewel cx={12} cy={7} />
    </>
  ),
  crown: (
    <>
      <path d="M4 17.5l-1-10 5 4 4-6 4 6 5-4-1 10z" />
      <path d="M4.5 20.5h15" />
      <Jewel cx={12} cy={14} />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
      <Jewel cx={12} cy={6.5} />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.2-3.8-8.5s1.3-6.2 3.8-8.5z" />
      <Jewel cx={16} cy={7.5} />
    </>
  ),
  sparkle: (
    <>
      <path d="M11 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5z" />
      <path d="M18 15v5M15.5 17.5h5" />
      <Jewel cx={11} cy={10} />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
      <Jewel cx={12} cy={12} />
    </>
  ),
  handshake: (
    <>
      <path d="M2.5 9.5l4-3 4 1.5 3-1.5 4 1 4 2" />
      <path d="M2.5 9.5l2 6 3.5 3 3-1 3 1.5 3.5-3 4-6.5" />
      <path d="M10.5 8l-2.5 3 1.5 1.5 3-2 3.5 3" />
      <Jewel cx={13} cy={10.5} />
    </>
  ),
  chip: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <rect x="9.5" y="9.5" width="5" height="5" />
      <path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5" />
      <Jewel cx={12} cy={12} />
    </>
  ),
  code: (
    <>
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14" />
      <Jewel cx={12} cy={12} />
    </>
  ),
  flow: (
    <>
      <rect x="3" y="3.5" width="6" height="5" rx="1" />
      <rect x="15" y="15.5" width="6" height="5" rx="1" />
      <path d="M9 6h4.5a2.5 2.5 0 0 1 2.5 2.5v0M18 15.5V11a2.5 2.5 0 0 0-2.5-2.5H11a2.5 2.5 0 0 0-2.5 2.5v4.5a2.5 2.5 0 0 0 2.5 2.5h4" />
      <Jewel cx={6} cy={6} />
    </>
  ),
  trend: (
    <>
      <path d="M3 20.5h18" />
      <path d="M4 16l5-5 3.5 3.5L20 7" />
      <path d="M15.5 7H20v4.5" />
      <Jewel cx={9} cy={11} />
    </>
  ),
  "user-plus": (
    <>
      <circle cx="9.5" cy="8" r="3.5" />
      <path d="M3 20c.5-3.6 3.1-6 6.5-6s6 2.4 6.5 6M18.5 8v6M15.5 11h6" />
      <Jewel cx={9.5} cy={8} />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="9" r="2.2" />
      <path d="M12 6.8c-1.4-2.6-.6-4.3 0-4.8.6.5 1.4 2.2 0 4.8zM14.2 9c2.6-1.4 4.3-.6 4.8 0-.5.6-2.2 1.4-4.8 0zM12 11.2c1.4 2.6.6 4.3 0 4.8-.6-.5-1.4-2.2 0-4.8zM9.8 9c-2.6 1.4-4.3.6-4.8 0 .5-.6 2.2-1.4 4.8 0z" />
      <path d="M12 16v5.5M12 19c1.5-2 3.5-2.5 5-2" />
      <Jewel cx={12} cy={9} />
    </>
  ),
  palette: (
    <>
      <path d="M12 3c-5 0-9 3.7-9 8.5S7 20.5 11 20.5c1.4 0 2-.9 2-1.8 0-1.4-1.2-1.7-1.2-3 0-1 .8-1.7 1.9-1.7H16c2.8 0 5-1.6 5-4.5C21 6.3 17 3 12 3z" />
      <circle cx="7.5" cy="11" r="1" />
      <circle cx="10" cy="7" r="1" />
      <circle cx="15" cy="7" r="1" />
      <Jewel cx={17.5} cy={10.5} />
    </>
  ),
  wand: (
    <>
      <path d="M4 20l11-11M13 7l4 4" />
      <path d="M18 2.5v3M16.5 4h3M20.5 9v2M19.5 10h2M9.5 3v2M8.5 4h2" />
      <Jewel cx={15} cy={9} />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.5" />
      <path d="M4.5 5.5v13c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-13M4.5 12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5" />
      <Jewel cx={12} cy={5.5} />
    </>
  ),
  document: (
    <>
      <path d="M6 2.5h8.5l4 4v15H6z" />
      <path d="M14.5 2.5v4h4M9 11h6.5M9 14.5h6.5M9 18h4" />
      <Jewel cx={9} cy={7} />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4M8 13.5h2M14 13.5h2M8 17h2" />
      <Jewel cx={15} cy={17} />
    </>
  ),
  clipboard: (
    <>
      <path d="M8.5 4.5H6v17h12v-17h-2.5" />
      <rect x="8.5" y="3" width="7" height="3" rx="1" />
      <path d="M9 11h6M9 14.5h6M9 18h3.5" />
      <Jewel cx={12} cy={4.5} />
    </>
  ),
  wallet: (
    <>
      <path d="M4 6.5h14.5a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19V6.5zm0 0l11-3.5v3.5" />
      <path d="M20 11.5h-4a2 2 0 0 0 0 4h4" />
      <Jewel cx={16.5} cy={13.5} />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="1.5" />
      <rect x="8" y="5.5" width="8" height="3.5" />
      <path d="M8.5 13h1M12 13h1M15 13h.5M8.5 16.5h1M12 16.5h1M15 16.5h.5" />
      <Jewel cx={15.25} cy={17.5} />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="1.5" />
      <path d="M2.5 9.5h19M6 15h4" />
      <Jewel cx={17.5} cy={15} />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5c-3.5-.5-6.5 0-8.5 1.5zM12 6.5v13" />
      <path d="M14.5 11l1.5 1.5 2.5-3" />
      <Jewel cx={12} cy={6.5} />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type AboutIconName = keyof typeof GLYPHS;

export function AboutIcon({ name, ...p }: IconProps & { name: AboutIconName }) {
  return <IconSvg {...p}>{GLYPHS[name]}</IconSvg>;
}

/** Each responsibility label on a team card → its glyph (the pre-V6 lucide mapping, redrawn). */
export const RESPONSIBILITY_ICONS: Record<string, AboutIconName> = {
  "Business Strategy": "target",
  "Event Operations": "gear",
  "Client Relations": "handshake",
  "Overall Management": "crown",
  "Technology Strategy": "chip",
  "Website Development": "code",
  Automation: "flow",
  "Digital Innovation": "sparkle",
  "Technical Operations": "gear",
  "Marketing Strategy": "target",
  "Brand Development": "gem",
  "Business Growth": "trend",
  "Client Acquisition": "user-plus",
  "Digital Marketing": "globe",
  "Event Decoration": "flower",
  "Theme Planning": "palette",
  "Floral Design": "flower",
  "Venue Styling": "wand",
  "Creative Execution": "sparkle",
  "Data Management": "database",
  Documentation: "document",
  "Event Coordination": "calendar",
  "Administrative Operations": "clipboard",
  "Financial Planning": "wallet",
  "Budget Management": "calculator",
  "Vendor Payments": "card",
  Accounts: "book",
  Compliance: "shield",
};
