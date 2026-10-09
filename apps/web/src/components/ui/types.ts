import type { BRAND_CASE_STUDIES } from "@/brand/data/content";
import type { services } from "@/data/cms";

/** Shared TypeScript contracts for the V6 primitives (DESIGN.md §6.2). */

export type ServiceSlug = (typeof services)[number]["slug"];
/** Google Drive file id of a curated photo; `MediaFrame` throws at render when it is unknown. */
export type CurationId = string;
export type Ratio = "3:2" | "4:5" | "3:4" | "1:1" | "21:9" | "16:10" | "4:3";
export type BreadcrumbItem = { name: string; href: string };
export type Commitment = { id: "reply" | "proposal" | "director" | "advance"; term: string; detail: string };
export type InquirySource = "home" | "contact" | "book_event" | "callback" | "service" | "footer";
/** Every clickable primitive takes these and renders `data-cta` attributes for the delegated analytics handler. */
export type CtaProps = { cta: string; location: string };
/** 0–1 focal point → `object-position`. */
export type Focal = { x: number; y: number };
export type CaseStudy = (typeof BRAND_CASE_STUDIES)[number];
