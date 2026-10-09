// V6 primitives barrel (DESIGN.md §6). Server components unless noted.
// Client islands should import their dependencies from the file, not from here.

export * from "@/components/ui/types";
export { ViewTransition, type ViewTransitionProps } from "@/components/ui/view-transition";
export { JsonLd } from "@/components/ui/json-ld";

export { Section, type SectionProps } from "@/components/ui/section";
export { SectionHead, type SectionHeadProps } from "@/components/ui/section-head";
export { Eyebrow, type EyebrowProps } from "@/components/ui/eyebrow";
export { Heading, type HeadingProps } from "@/components/ui/heading";
export { Deck } from "@/components/ui/deck";
export { Prose, type ProseProps } from "@/components/ui/prose";
export { Button, type ButtonProps } from "@/components/ui/lux-button";
export { Card, type CardProps } from "@/components/ui/card";
export { Reveal, type RevealProps } from "@/components/ui/reveal";
export { MediaFrame, resolveAsset, resolveCoverAsset, focalToObjectPosition, type MediaFrameProps } from "@/components/ui/media-frame";
export { Badge, ConceptTag } from "@/components/ui/badge";
export { Accordion, textOf, type AccordionItem, type AccordionProps } from "@/components/ui/accordion";
export { Tabs, TabsRadio, type TabItem, type TabsRadioProps } from "@/components/ui/tabs";
export { Commitments, type CommitmentsProps } from "@/components/ui/commitments";
export { Breadcrumbs } from "@/components/ui/breadcrumbs";
export { Pagination, pageWindow, type PaginationProps } from "@/components/ui/pagination";
export { Cover, PRIMARY_CTA_LABEL, ENTITY_LINE, PAGE_TITLE_ID, type CoverProps } from "@/components/ui/cover";
export { Spread, Diptych } from "@/components/ui/spread";
export { Ledger, type LedgerProps, type LedgerRow } from "@/components/ui/ledger";
export { DetailsOpenAtDesktop } from "@/components/ui/details-open-at-desktop"; // client island
export { OnThisPage } from "@/components/ui/on-this-page";
export { ConceptCard, ConceptBanner, CONCEPT_LINE, venueTypeOf, conceptSpecs, type ConceptCardProps } from "@/components/ui/concept-card";

// Package A2 (written concurrently): strand, services index, process line, price table, gallery, lightbox, inquiry panel.
export * from "@/components/ui/strand";
export * from "@/components/ui/strand-nav"; // client island
export * from "@/components/ui/services-index";
export * from "@/components/ui/process-line";
export * from "@/components/ui/price-table";
export * from "@/components/ui/gallery";
export * from "@/components/ui/lightbox"; // client island
export * from "@/components/ui/inquiry-panel";
export * from "@/components/ui/inquiry-sentinel"; // client island
