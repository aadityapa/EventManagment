"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  extractStitchContent,
  extractHeadStyles,
  extractScripts,
  extractTailwindConfig,
  isInternalRoute,
  stitchHrefToRoute,
} from "@/lib/stitch/parse";
import { remapConfigToLight } from "@/lib/stitch/light-palette";

type StitchMainProps = {
  html: string;
  className?: string;
};

let tailwindReady: Promise<void> | null = null;

function ensureTailwind(config: Record<string, unknown> | null): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as unknown as { __stitchTailwindReady?: boolean }).__stitchTailwindReady) {
    return Promise.resolve();
  }

  if (!tailwindReady) {
    tailwindReady = new Promise((resolve) => {
      const finish = () => {
        (window as unknown as { __stitchTailwindReady?: boolean }).__stitchTailwindReady = true;
        resolve();
      };

      const applyConfig = () => {
        if (!config) return;
        let cfg = document.getElementById("stitch-tailwind-config");
        if (!cfg) {
          cfg = document.createElement("script");
          cfg.id = "stitch-tailwind-config";
          document.head.appendChild(cfg);
        }
        cfg.textContent = `tailwind.config = ${JSON.stringify(remapConfigToLight(config))};`;
      };

      const existing = document.querySelector('script[data-stitch-tailwind="1"]');
      if (existing) {
        applyConfig();
        finish();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries";
      script.dataset.stitchTailwind = "1";
      script.onload = () => {
        applyConfig();
        setTimeout(finish, 100);
      };
      script.onerror = finish;
      document.head.appendChild(script);
    });
  }

  return tailwindReady;
}

export function StitchMain({ html, className }: StitchMainProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const content = extractStitchContent(html);
  const styles = extractHeadStyles(html);
  const config = extractTailwindConfig(html);

  useEffect(() => {
    document.documentElement.setAttribute("data-stitch-active", "true");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    document.body.style.overflowX = "hidden";

    ensureTailwind(config).then(() => setReady(true));

    return () => {
      document.documentElement.removeAttribute("data-stitch-active");
      document.body.style.overflowX = "";
    };
  }, [config]);

  useEffect(() => {
    if (!ready) return;
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
        /* skip broken inline scripts */
      }
    }

    root.querySelectorAll(".reveal, .scroll-reveal, .fade-up-hidden").forEach((el) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active", "fade-up");
              entry.target.classList.remove("fade-up-hidden");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      observer.observe(el);
      cleanups.push(() => observer.disconnect());
    });

    return () => cleanups.forEach((fn) => fn());
  }, [html, router, ready]);

  return (
    <div
      ref={rootRef}
      className={`stitch-shell overflow-x-hidden ${className ?? ""}`}
      style={{ opacity: ready ? 1 : 0.3, transition: "opacity 0.25s ease" }}
    >
      {styles ? <style dangerouslySetInnerHTML={{ __html: styles }} /> : null}
      <div className="stitch-main w-full overflow-x-hidden" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
