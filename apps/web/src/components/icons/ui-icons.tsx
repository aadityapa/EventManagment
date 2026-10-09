// Server component — no "use client". UI glyphs in the same engraved hairline
// style as the service icons (DESIGN.md §7.2): 24-grid, arcs and lines only,
// one gold jewel each. Social marks are redrawn in-house at the same weight.
import type { ReactNode } from "react";
import { IconSvg, Jewel, type IconProps } from "@/components/icons/service-icons";

export const UI_ICON_NAMES = [
  "arrow-right",
  "arrow-up-right",
  "plus",
  "chevron-down",
  "phone",
  "whatsapp",
  "mail",
  "map-pin",
  "clock",
  "calendar",
  "menu",
  "external-link",
  "check",
  "play",
  "instagram",
  "linkedin",
  "youtube",
  "facebook",
] as const;

export type UiIconName = (typeof UI_ICON_NAMES)[number];

const GLYPHS: Record<UiIconName, ReactNode> = {
  // Long 14-unit shaft with a small head — the CTA arrow; jewel at the tail.
  "arrow-right": (
    <>
      <path d="M5.5 12h14M16.5 9l3 3-3 3" />
      <Jewel cx={3} cy={12} />
    </>
  ),
  "arrow-up-right": (
    <>
      <path d="M7 17L17 7M9 7h8v8" />
      <Jewel cx={5} cy={19} />
    </>
  ),
  // Rotates 45° for details[open] via .lux-icon-plus; jewel at the crossing.
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
      <Jewel cx={12} cy={12} />
    </>
  ),
  "chevron-down": (
    <>
      <path d="M6 9l6 6 6-6" />
      <Jewel cx={12} cy={15} />
    </>
  ),
  // Handset outline: two concentric arcs joined by the ear and mouth pieces.
  phone: (
    <>
      <path d="M6 3h2.5l2 4.5-2 1.5a10 10 0 0 1 6.5 6.5l1.5-2 4.5 2V18a3 3 0 0 1-3 3A15 15 0 0 1 3 6a3 3 0 0 1 3-3z" />
      <Jewel cx={16.5} cy={7.5} />
    </>
  ),
  // Speech bubble with a half-size handset inside; green only ever as stroke colour.
  whatsapp: (
    <>
      <path d="M8.2 20.16A9 9 0 1 0 4.63 17.16L3.5 21.5z" />
      <path d="M9 7.5h1.25l1 2.25-1 .75a5 5 0 0 1 3.25 3.25l.75-1 2.25 1V15a1.5 1.5 0 0 1-1.5 1.5A7.5 7.5 0 0 1 7.5 9a1.5 1.5 0 0 1 1.5-1.5z" />
      <Jewel cx={16} cy={8} />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <path d="M3 7.5l9 6 9-6" />
      <Jewel cx={12} cy={13.5} />
    </>
  ),
  // Teardrop from a 240° arc and two tangent lines; jewel at the centre.
  "map-pin": (
    <>
      <path d="M6.8 12A6 6 0 1 1 17.2 12L12 21z" />
      <Jewel cx={12} cy={9} />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
      <Jewel cx={12} cy={12} />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="1.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <Jewel cx={12} cy={15.5} />
    </>
  ),
  // Two 14-unit lines — the mobile Menu glyph.
  menu: (
    <>
      <path d="M5 9h14M5 15h14" />
      <Jewel cx={21} cy={12} />
    </>
  ),
  "external-link": (
    <>
      <path d="M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5M14 4h6v6M20 4l-9.5 9.5" />
      <Jewel cx={20} cy={4} />
    </>
  ),
  check: (
    <>
      <path d="M4 12.5l5 5L20 7" />
      <Jewel cx={9} cy={17.5} />
    </>
  ),
  play: (
    <>
      <path d="M7 4l13 8-13 8z" />
      <Jewel cx={10.5} cy={12} />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <Jewel cx={17.5} cy={6.5} />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 11v6M12 17v-6M12 13.5a2.5 2.5 0 0 1 5 0V17" />
      <Jewel cx={8} cy={7.5} />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="6" width="19" height="13" rx="4" />
      <path d="M10 9.5l5 3-5 3z" />
      <Jewel cx={15} cy={12.5} />
    </>
  ),
  facebook: (
    <>
      <path d="M16 3h-2a4 4 0 0 0-4 4v3H7.5v3.5H10V21h3.5v-7.5h2.5l.5-3.5h-3V8a1 1 0 0 1 1-1h2z" />
      <Jewel cx={19} cy={5.5} />
    </>
  ),
};

export type UiIconProps = IconProps & { name: UiIconName };

export function UiIcon({ name, className, ...p }: UiIconProps) {
  // The plus/close glyph carries the hook class the accordion CSS rotates.
  const cls = name === "plus" ? ["lux-icon-plus", className].filter(Boolean).join(" ") : className;
  return (
    <IconSvg {...p} className={cls}>
      {GLYPHS[name]}
    </IconSvg>
  );
}
