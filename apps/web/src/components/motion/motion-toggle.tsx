"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { getMotionMode, onMotionChange, setMotionMode, type MotionMode } from "./motion-mode";

type MotionToggleProps = {
  /** Glyph from the server (keeps the icon module out of this island). */
  icon?: ReactNode;
  className?: string;
};

const subscribe = (cb: () => void) => onMotionChange(cb);
const getSnapshot = (): MotionMode => getMotionMode();
/** Unknown on the server: the button renders hidden until hydration (it needs JS to work). */
const getServerSnapshot = (): MotionMode | null => null;

/**
 * "Motion: On / Off" — the site motion preference control (DESIGN.md §9).
 * A toggle button (aria-pressed = motion on) whose accessible name stays
 * "Motion"; the visible state word follows it. Clicking stores the choice via
 * window.__nxSetMotion (inline boot script in layout.tsx), which updates
 * html[data-motion] and fires "nx:motion" for the 3D scenes and the runtime.
 */
export function MotionToggle({ icon, className }: MotionToggleProps) {
  const mode = useSyncExternalStore<MotionMode | null>(subscribe, getSnapshot, getServerSnapshot);
  const on = mode === "full";

  return (
    <button
      type="button"
      className={`pg-shell-motion${className ? ` ${className}` : ""}`}
      aria-pressed={on}
      hidden={mode === null}
      onClick={() => setMotionMode(on ? "reduced" : "full")}
    >
      {icon}
      <span>
        Motion
        <span className="pg-shell-motion__state" aria-hidden="true">
          {`: ${on ? "On" : "Off"}`}
        </span>
      </span>
    </button>
  );
}
