// Server component — no "use client". The twelve service icons in the
// "engraved hairline" style (DESIGN.md §7): 24-grid, arcs and straight lines
// only, round caps, currentColor stroke and exactly one gold jewel dot each.
import type { CSSProperties, ReactNode } from "react";
import type { ServiceSlug } from "@/components/ui/types";

export type IconSize = 20 | 24 | 32 | 48;
export type IconProps = { size?: IconSize; title?: string; className?: string };

/** Thinner line as the glyph grows, so the weight reads the same at every size. */
export const strokeFor = (size: number) => (size >= 48 ? 1.25 : size <= 20 ? 1.75 : 1.5);

type IconSvgProps = IconProps & {
  /** The 48px cover variant adds a thin outer ring (service icons only). */
  ring?: boolean;
  children: ReactNode;
};

/** Shared frame for every glyph: a11y wiring, stroke rule and the optional ring. */
export function IconSvg({ size = 24, title, className, ring = false, children }: IconSvgProps) {
  const stroke = strokeFor(size);
  // The size rule sets --icon-stroke inline; the attribute is the fallback for
  // contexts without CSS custom properties (OG renderers, email).
  const style = { "--icon-stroke": stroke, strokeWidth: "var(--icon-stroke)" } as CSSProperties;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      className={className}
    >
      {title ? <title>{title}</title> : null}
      {ring && size >= 48 ? <circle cx="12" cy="12" r="11" strokeWidth="0.75" opacity="0.4" /> : null}
      {children}
    </svg>
  );
}

/** The one 2px solid gold dot per icon, placed at the focal point. */
export function Jewel({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r="1" fill="var(--icon-jewel)" stroke="none" />;
}

const service = (p: IconProps) => ({ ring: true, ...p });

/** Two interlocking rings beneath a scalloped mandap canopy; jewel at the overlap. */
export function WeddingPlanningIcon(p: IconProps) {
  return (
    <IconSvg {...service(p)}>
      <path d="M3 12V8a3 3 0 0 1 6 0a3 3 0 0 1 6 0a3 3 0 0 1 6 0v4" />
      <circle cx="9.5" cy="15.5" r="3.5" />
      <circle cx="14.5" cy="15.5" r="3.5" />
      <Jewel cx={12} cy={15.5} />
    </IconSvg>
  );
}

/** Palace dome between two minarets on a horizon line, small sun arc; jewel is the sun. */
export function DestinationWeddingsIcon(p: IconProps) {
  return (
    <IconSvg {...service(p)}>
      <path d="M2 19h20" />
      <path d="M6 14h12M7 14v5M17 14v5M7 14a5 5 0 0 1 10 0M12 9V7.5" />
      <path d="M3 19v-6a1 1 0 0 1 2 0v6M19 19v-6a1 1 0 0 1 2 0v6" />
      <path d="M15.5 5a3 3 0 0 1 6 0" />
      <Jewel cx={18.5} cy={5} />
    </IconSvg>
  );
}

/** Lectern in profile on a tiered stage, gooseneck mic; jewel is the mic capsule. */
export function CorporateEventsIcon(p: IconProps) {
  return (
    <IconSvg {...service(p)}>
      <path d="M2 21h20M5 21v-3h14v3" />
      <path d="M6.5 10h11M7.5 10l1 8h7l1-8" />
      <path d="M14.5 10V8a1.5 1.5 0 0 1 1.5-1.5h.5" />
      <Jewel cx={17.5} cy={6.5} />
    </IconSvg>
  );
}

/** Five-point star as one line above a velvet rope on two posts; jewel at the star centre. */
export function CelebrityManagementIcon(p: IconProps) {
  return (
    <IconSvg {...service(p)}>
      <path d="M12 5l2.35 7.24L8.2 7.76h7.6l-6.15 4.48z" />
      <path d="M4 21v-7M20 21v-7M4 14a14 14 0 0 0 16 0" />
      <Jewel cx={12} cy={9} />
    </IconSvg>
  );
}

/** Tall tapered candle on a single cake tier; jewel is the flame. */
export function BirthdayEventsIcon(p: IconProps) {
  return (
    <IconSvg {...service(p)}>
      <path d="M2 20h20M4 20v-4h16v4" />
      <path d="M11 16l.5-8h1l.5 8M12 8V6.5" />
      <Jewel cx={12} cy={5} />
    </IconSvg>
  );
}

/** Lanyard badge: loop, rounded card, two text lines; jewel at the clip. */
export function ConferencesIcon(p: IconProps) {
  return (
    <IconSvg {...service(p)}>
      <path d="M9.5 3.5a2.5 2.5 0 0 1 5 0M9.5 3.5l2.5 4 2.5-4" />
      <rect x="6" y="11" width="12" height="10" rx="1.5" />
      <path d="M9 15.5h6M9 18h4" />
      <Jewel cx={12} cy={9} />
    </IconSvg>
  );
}

/** One-point-perspective runway under a spotlight arc; jewel at the vanishing point. */
export function FashionShowsIcon(p: IconProps) {
  return (
    <IconSvg {...service(p)}>
      <path d="M4 21L11.5 7M20 21L12.5 7M4 21h16M7.2 15h9.6" />
      <path d="M8 6a4 4 0 0 1 8 0" />
      <Jewel cx={12} cy={6} />
    </IconSvg>
  );
}

/** Stage truss with three hangers and one beam cone; jewel is the lit fixture. */
export function ConcertManagementIcon(p: IconProps) {
  return (
    <IconSvg {...service(p)}>
      <path d="M2 5h20M2 8h20M5 5l3 3M11 5l3 3M17 5l3 3" />
      <path d="M6 8v2M18 8v2M12 8v2" />
      <path d="M12 12.5l-4.5 8.5M12 12.5l4.5 8.5M6 21h12" />
      <Jewel cx={12} cy={11.5} />
    </IconSvg>
  );
}

/** Oblique booth plan — three walls, open front — with a pennant; jewel at the flag tip. */
export function ExhibitionsIcon(p: IconProps) {
  return (
    <IconSvg {...service(p)}>
      <path d="M4 19h12l4-4H8z" />
      <path d="M4 19v-7l4-4v7M8 8h12v7M16 19v-7l4-4" />
      <path d="M14 8V4.5M14 4.5l2.5 1-2.5 1" />
      <Jewel cx={17.5} cy={5.5} />
    </IconSvg>
  );
}

/** Scalloped pop-up awning over a counter, two ripple arcs; jewel at the awning peak. */
export function BrandPromotionsIcon(p: IconProps) {
  return (
    <IconSvg {...service(p)}>
      <path d="M5 11l7-5.5 7 5.5" />
      <path d="M5 11a1.75 1.75 0 0 0 3.5 0a1.75 1.75 0 0 0 3.5 0a1.75 1.75 0 0 0 3.5 0a1.75 1.75 0 0 0 3.5 0" />
      <path d="M12 13v3M4 20h16M7 20v-4h10v4" />
      <path d="M3 9a4 4 0 0 0 0 5M21 9a4 4 0 0 1 0 5" />
      <Jewel cx={12} cy={4.5} />
    </IconSvg>
  );
}

/** Veil lifted from a pedestal — drape arc, hanging corner, pedestal; jewel at the lift point. */
export function ProductLaunchesIcon(p: IconProps) {
  return (
    <IconSvg {...service(p)}>
      <path d="M5 21h14M8 21v-6h8v6M9.5 15a2.5 2.5 0 0 1 5 0" />
      <path d="M6.5 15A9 9 0 0 1 15.5 6M15.5 6a3 3 0 0 1 3 3v3" />
      <Jewel cx={16} cy={4.5} />
    </IconSvg>
  );
}

/** Fresnel lantern hung from a pipe, aimed down-right, two beam lines; jewel is the lens. */
export function EventProductionIcon(p: IconProps) {
  return (
    <IconSvg {...service(p)}>
      <path d="M2 4h20M8.5 4v4.5" />
      <path d="M10.3 6.76L15.24 11.7 11.7 15.24 6.76 10.3z" />
      <path d="M15.24 11.7A2.5 2.5 0 0 0 11.7 15.24" />
      <path d="M16.5 14.5l4.5 2M14.5 16.5l2 4.5" />
      <Jewel cx={14.2} cy={14.2} />
    </IconSvg>
  );
}

export const SERVICE_ICONS: Record<ServiceSlug, (p: IconProps) => React.JSX.Element> = {
  "wedding-planning": WeddingPlanningIcon,
  "destination-weddings": DestinationWeddingsIcon,
  "corporate-events": CorporateEventsIcon,
  "celebrity-management": CelebrityManagementIcon,
  "birthday-events": BirthdayEventsIcon,
  conferences: ConferencesIcon,
  "fashion-shows": FashionShowsIcon,
  "concert-management": ConcertManagementIcon,
  exhibitions: ExhibitionsIcon,
  "brand-promotions": BrandPromotionsIcon,
  "product-launches": ProductLaunchesIcon,
  "event-production": EventProductionIcon,
};

export function ServiceIcon({ name, ...p }: IconProps & { name: ServiceSlug }) {
  const Icon = SERVICE_ICONS[name];
  return <Icon {...p} />;
}
