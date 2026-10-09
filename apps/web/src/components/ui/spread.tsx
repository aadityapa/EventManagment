import { MediaFrame } from "@/components/ui/media-frame";
import type { CurationId } from "@/components/ui/types";
import { cn } from "@/lib/utils";

/**
 * Full-bleed photographic moment: 21:9 at ≥ 1024, 3:2 below, caption beneath
 * on the content rail. Place it as a direct child of `.lux-page` to bleed, or
 * first inside a chapter so the photo touches the rule.
 */
export function Spread({ asset, caption = true, className }: { asset: CurationId; caption?: boolean; className?: string }) {
  return (
    <div className={cn("lux-spread lux-bleed", className)}>
      <MediaFrame asset={asset} ratio="3:2" sizes="100vw" caption={caption ? undefined : false} />
    </div>
  );
}

/** Two gilt panels: 3:4 side by side at ≥ 768, 4:5 stacked below, captions beneath each. */
export function Diptych({ left, right, className }: { left: CurationId; right: CurationId; className?: string }) {
  const sizes = "(min-width:768px) 50vw, 100vw";
  return (
    <div className={cn("lux-diptych", className)}>
      <MediaFrame asset={left} ratio="3:4" sizes={sizes} frame />
      <MediaFrame asset={right} ratio="3:4" sizes={sizes} frame />
    </div>
  );
}
