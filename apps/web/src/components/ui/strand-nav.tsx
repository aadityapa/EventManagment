"use client";

import { getMotionMode } from "@/components/motion/motion-mode";

/**
 * Prev/next buttons for a Strand. CSS shows them only on hover-capable
 * devices; the strand itself stays a user-driven scroller (no autoplay).
 */
export function StrandNav({ targetId }: { targetId: string }) {
  const nudge = (dir: -1 | 1) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: getMotionMode() === "full" ? "smooth" : "auto" });
  };
  return (
    <div className="lux-strand__nav">
      <button type="button" className="lux-strand__btn" aria-controls={targetId} aria-label="Scroll back" onClick={() => nudge(-1)}>
        <Chevron d="M14 6l-6 6 6 6" />
      </button>
      <button type="button" className="lux-strand__btn" aria-controls={targetId} aria-label="Scroll forward" onClick={() => nudge(1)}>
        <Chevron d="M10 6l6 6-6 6" />
      </button>
    </div>
  );
}

function Chevron({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
