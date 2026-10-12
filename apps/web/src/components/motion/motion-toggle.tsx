"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { getMotionMode, MOTION_MODES, onMotionChange, setMotionMode, type MotionMode } from "./motion-mode";

type MotionToggleProps = {
  /** Glyph from the server (keeps the icon module out of this island). */
  icon?: ReactNode;
  className?: string;
};

const LABELS: Record<MotionMode, string> = { full: "Full", gentle: "Gentle", off: "Off" };

const subscribe = (cb: () => void) => onMotionChange(cb);
const getSnapshot = (): MotionMode => getMotionMode();
/** Unknown on the server: the control renders hidden until hydration (it needs JS to work). */
const getServerSnapshot = (): MotionMode | null => null;

/**
 * "Motion: Full · Gentle · Off" — the site motion level control (DESIGN.md §9)
 * and the site-wide pause mechanism for every looping animation. A labelled
 * group of three toggle buttons (aria-pressed marks the active level; each is
 * a 44px target). Choosing one stores it via window.__nxSetMotion (inline boot
 * script in layout.tsx), which updates html[data-motion] and fires "nx:motion"
 * for the 3D scenes and the runtime.
 */
export function MotionToggle({ icon, className }: MotionToggleProps) {
  const mode = useSyncExternalStore<MotionMode | null>(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div role="group" aria-label="Motion" className={`pg-shell-motion${className ? ` ${className}` : ""}`} hidden={mode === null}>
      <span className="pg-shell-motion__label" aria-hidden="true">
        {icon}
        Motion
      </span>
      <span className="pg-shell-motion__opts">
        {MOTION_MODES.map((m) => (
          <button
            key={m}
            type="button"
            className="pg-shell-motion__opt"
            aria-pressed={mode === m}
            onClick={() => {
              if (mode !== m) setMotionMode(m);
            }}
          >
            {LABELS[m]}
          </button>
        ))}
      </span>
    </div>
  );
}
