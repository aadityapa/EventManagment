"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps server-rendered `<details data-group>` groups (footer, FAQ contents):
 * at ≥ minWidth every group is forced open and loses its `name` so all show;
 * below, the exclusive `name` is restored and they collapse. Needed because
 * CSS cannot force `open` and `::details-content` support is too new.
 */
export function DetailsOpenAtDesktop({ children, minWidth = 1024 }: { children: ReactNode; minWidth?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const apply = () =>
      ref.current?.querySelectorAll<HTMLDetailsElement>("details").forEach((d) => {
        if (mq.matches) {
          d.open = true;
          d.removeAttribute("name");
        } else {
          d.setAttribute("name", d.dataset.group ?? "group");
          d.open = false;
        }
      });
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [minWidth]);
  return <div ref={ref}>{children}</div>;
}
