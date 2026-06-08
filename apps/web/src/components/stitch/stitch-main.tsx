"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  extractMainHtml,
  extractHeadStyles,
  extractScripts,
  isInternalRoute,
  stitchHrefToRoute,
} from "@/lib/stitch/parse";

type StitchMainProps = {
  html: string;
  className?: string;
};

export function StitchMain({ html, className }: StitchMainProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];

    root.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((a) => {
      const raw = a.getAttribute("href");
      if (!raw) return;
      const href = stitchHrefToRoute(raw);
      if (href !== raw) a.setAttribute("href", href);

      if (isInternalRoute(href)) {
        const onClick = (e: MouseEvent) => {
          e.preventDefault();
          router.push(href);
        };
        a.addEventListener("click", onClick);
        cleanups.push(() => a.removeEventListener("click", onClick));
      }
    });

    const scripts = extractScripts(html);
    for (const source of scripts) {
      try {
        const fn = new Function(source);
        fn();
      } catch {
        const el = document.createElement("script");
        el.textContent = source;
        document.body.appendChild(el);
        cleanups.push(() => el.remove());
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, [html, router]);

  const mainHtml = extractMainHtml(html);
  const styles = extractHeadStyles(html);

  return (
    <div ref={rootRef} className={className}>
      {styles ? <style dangerouslySetInnerHTML={{ __html: styles }} /> : null}
      <div className="stitch-main" dangerouslySetInnerHTML={{ __html: mainHtml }} />
    </div>
  );
}
