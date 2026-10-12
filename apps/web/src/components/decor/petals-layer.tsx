// Server component — no "use client". Falling rose petals for a section or a
// panel: a thin wrapper around the lazy WebGL `petals` scene (three.js loads
// after `load` + idle and only where 3D can run; a faint CSS petal glow stands
// in otherwise). The wrapper is absolutely positioned and aria-hidden; the
// caller's class decides where it sits and how it is masked (decor.css).
import { Scene3D } from "@/components/three/scene-host";
import { cn } from "@/lib/utils";

export type PetalsLayerProps = {
  className?: string;
  /** 0–1, default 0.6: petal count and fallback strength. */
  intensity?: number;
};

export function PetalsLayer({ className, intensity = 0.6 }: PetalsLayerProps) {
  return (
    <div className={cn("nx-petals", className)} aria-hidden="true">
      <Scene3D variant="petals" intensity={intensity} className="nx-petals__scene" />
    </div>
  );
}
