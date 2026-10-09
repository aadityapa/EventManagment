"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

type MobileMenuProps = {
  /** Server-rendered menu body (links, contact lines, CTA). */
  children: ReactNode;
  /** Glyphs come from the server so the icon module stays out of this island. */
  menuIcon: ReactNode;
  closeIcon: ReactNode;
};

/**
 * Phone menu (DESIGN.md §10.0): a native modal <dialog closedby="any"> —
 * showModal() gives the focus trap, inert background, ESC and focus return,
 * so nothing is hand-rolled. Closes on route change, on any link tap (same-route
 * links do not change the pathname) and when the viewport grows to desktop.
 */
export function MobileMenu({ children, menuIcon, closeIcon }: MobileMenuProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    ref.current?.close();
  }, [pathname]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const onWide = () => mq.matches && dialog.close();
    const onClick = (e: MouseEvent) => (e.target as Element).closest("a[href]") && dialog.close();
    mq.addEventListener("change", onWide);
    dialog.addEventListener("click", onClick);
    return () => {
      mq.removeEventListener("change", onWide);
      dialog.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="pg-shell-menubtn"
        aria-haspopup="dialog"
        aria-controls="site-menu"
        onClick={() => ref.current?.showModal()}
      >
        {menuIcon}
        Menu
      </button>
      <dialog id="site-menu" ref={ref} closedby="any" className="pg-shell-menu" aria-label="Menu">
        <div className="pg-shell-menu__head">
          <p className="lux-label lux-label--rule-none">Menu</p>
          <button type="button" className="pg-shell-menubtn" onClick={() => ref.current?.close()}>
            {closeIcon}
            Close
          </button>
        </div>
        {children}
      </dialog>
    </>
  );
}
