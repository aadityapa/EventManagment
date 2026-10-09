"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Routes that render their own chrome. Their pages also server-render a .lux-app-route marker (pages/shell.css hides the chrome before hydration); data-chrome="app" covers browsers without :has(). */
const APP_ROUTES = ["/dashboard", "/admin", "/login", "/register"];
const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));
const supportsPopover = () => "togglePopover" in HTMLElement.prototype;

/**
 * The header's only JavaScript (DESIGN.md §10.0, §11.6 (3)): the 24px scroll
 * flag, hover-intent + Safari 16.4 fallback for the services popover, and the
 * per-route state the server header cannot know (aria-current, close panel).
 */
export function HeaderIsland() {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;
    const sync = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  useEffect(() => {
    const trigger = document.getElementById("services-trigger");
    const panel = document.getElementById("services-panel");
    if (!trigger || !panel) return;
    const off = new AbortController();
    const on = { signal: off.signal };
    const native = supportsPopover();
    const isOpen = () => (native ? panel.matches(":popover-open") : !panel.hidden);
    const show = () => { if (native) { if (!isOpen()) panel.showPopover(); } else { panel.hidden = false; trigger.setAttribute("aria-expanded", "true"); } };
    const hide = () => { if (native) { if (isOpen()) panel.hidePopover(); } else { panel.hidden = true; trigger.setAttribute("aria-expanded", "false"); } };

    if (!native) {
      // No popover API: plain disclosure with outside-click and ESC.
      panel.removeAttribute("popover");
      hide();
      trigger.addEventListener("click", () => (isOpen() ? hide() : show()), on);
      document.addEventListener("keydown", (e) => e.key === "Escape" && hide(), on);
      document.addEventListener("pointerdown", (e) => { if (!panel.contains(e.target as Node) && !trigger.contains(e.target as Node)) hide(); }, on);
    }
    // Same-route links do not change the pathname, so close on any link click too.
    panel.addEventListener("click", (e) => (e.target as Element).closest("a") && hide(), on);

    if (window.matchMedia("(hover: hover)").matches) {
      let timer = 0;
      let hoverOpenedAt = 0;
      const intent = (fn: () => void, ms: number) => { window.clearTimeout(timer); timer = window.setTimeout(fn, ms); };
      const leave = () => intent(() => { if (!trigger.matches(":hover") && !panel.matches(":hover")) hide(); }, 220);
      trigger.addEventListener("pointerenter", () => intent(() => { if (!isOpen()) { show(); hoverOpenedAt = Date.now(); } }, 120), on);
      trigger.addEventListener("pointerleave", leave, on);
      panel.addEventListener("pointerenter", () => window.clearTimeout(timer), on);
      panel.addEventListener("pointerleave", leave, on);
      // A click straight after hover-open would toggle the panel shut again: swallow it.
      trigger.addEventListener("click", (e) => { if (Date.now() - hoverOpenedAt < 600) e.preventDefault(); }, { capture: true, signal: off.signal });
      off.signal.addEventListener("abort", () => window.clearTimeout(timer));
    }
    return () => off.abort();
  }, []);

  useEffect(() => {
    const panel = document.getElementById("services-panel");
    // `:popover-open` is a syntax error where the API is missing, so test support first.
    if (panel && supportsPopover()) { if (panel.matches(":popover-open")) panel.hidePopover(); }
    else if (panel) { panel.hidden = true; document.getElementById("services-trigger")?.setAttribute("aria-expanded", "false"); }
    document.querySelectorAll<HTMLElement>("[data-nav-href]").forEach((el) => {
      const active = isActive(pathname, el.dataset.navHref ?? "");
      el.toggleAttribute("data-active", active);
      if (el.tagName !== "A") return;
      if (active) el.setAttribute("aria-current", "page");
      else el.removeAttribute("aria-current");
    });
    const app = APP_ROUTES.some((r) => isActive(pathname, r));
    if (app) document.documentElement.dataset.chrome = "app";
    else delete document.documentElement.dataset.chrome;
  }, [pathname]);

  return null;
}
