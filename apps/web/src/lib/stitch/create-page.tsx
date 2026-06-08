import type { ReactNode } from "react";
import { StitchPage } from "@/components/stitch/stitch-page";
import { STITCH_PAGES, stitchMetadata } from "@/lib/stitch/pages";

type StitchPageKey = keyof typeof STITCH_PAGES;

export function createStitchPage(key: StitchPageKey, fallback: ReactNode) {
  const cfg = STITCH_PAGES[key];

  return {
    metadata: stitchMetadata(key),
    Page: function StitchRoutePage() {
      return <StitchPage screen={cfg.screen} fallback={fallback} />;
    },
  };
}
