// Server component — no "use client". Two or three very soft stage-light
// beams from the rig above, washing behind the cover copy: each beam is a
// conic-gradient cone (≤ 10% alpha) faded along its length by a static mask,
// and only its `rotate` animates (src/styles/decor.css) — a slow sweep under
// motion "full", a small drift under "gentle", still under "off" / no JS.
import { cn } from "@/lib/utils";

export type StageLightsProps = { className?: string };

export function StageLights({ className }: StageLightsProps) {
  return (
    <div className={cn("nx-stage", className)} aria-hidden="true">
      <span className="nx-stage__beam nx-stage__beam--1" />
      <span className="nx-stage__beam nx-stage__beam--2" />
      <span className="nx-stage__beam nx-stage__beam--3" />
    </div>
  );
}
