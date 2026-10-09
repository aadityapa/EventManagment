"use client";

import Image from "next/image";
import { createContext, startTransition, use, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { ViewTransition } from "@/components/ui/view-transition";

export type LightboxAsset = { id: string; src: string; alt: string; caption: string; width: number; height: number };

const PREFIX = "#photo-";

/** Id of the photo open in the viewer, so its page tile can hand over the `photo-{id}` name. */
const OpenPhotoContext = createContext<string | null>(null);

/**
 * Holds a tile's `photo-{id}` view-transition name, except while that photo is
 * open: the viewer then holds it. Exactly one boundary carries each name at a
 * time (React errors on duplicates), and because the tile's named boundary
 * unmounts in the same transition that mounts the viewer's, React pairs them
 * into the shared-element morph. Render tiles inside `<Lightbox>`.
 */
export function PhotoName({ id, children }: { id: string; children: ReactNode }) {
  if (use(OpenPhotoContext) === id) return <>{children}</>;
  return (
    <ViewTransition name={`photo-${id}`} share="lux-morph">
      {children}
    </ViewTransition>
  );
}

/** The page tile for a photo (`<a href="#photo-{id}">`), if one is rendered. */
function tileFor(id: string): HTMLAnchorElement | null {
  return document.querySelector<HTMLAnchorElement>(`a[href="${PREFIX}${CSS.escape(id)}"]`);
}

/**
 * Hidden by an in-page filter (TabsRadio `:has()` → `display: none` on the
 * tile): a display-none subtree has no layout boxes. A photo with no tile on
 * the page counts as shown.
 */
function isTileHidden(id: string): boolean {
  const tile = tileFor(id);
  return tile ? tile.getClientRects().length === 0 : false;
}

/** The heading of the section holding the gallery — where focus lands when no tile opened the viewer. */
function galleryHeading(id: string): HTMLElement | null {
  const section = tileFor(id)?.closest("section");
  const heading = section?.querySelector<HTMLElement>("h2, h3") ?? null;
  if (heading && !heading.hasAttribute("tabindex")) heading.tabIndex = -1;
  return heading;
}

/**
 * Native `<dialog>` photo viewer for a Gallery. Opens from any
 * `<a href="#photo-{id}">` on the page (or the URL hash), keeps a
 * three-slide scroll-snap strip (previous · current · next) so swipe is
 * native, and returns focus to the tile on close. Tiles passed as `children`
 * name themselves with `PhotoName`, so the open photo morphs from its tile.
 */
export function Lightbox({ assets, children }: { assets: LightboxAsset[]; children?: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const fromHashRef = useRef(false);
  const settle = useRef(0);
  const [index, setIndex] = useState<number | null>(null);
  /** Asset indices the viewer steps through: the tiles shown when it opened (the filter cannot change while it is modal). */
  const [order, setOrder] = useState<number[]>([]);

  const openById = useCallback(
    (id: string, trigger: HTMLElement | null) => {
      const i = assets.findIndex((a) => a.id === id);
      if (i < 0) return false;
      triggerRef.current = trigger;
      fromHashRef.current = trigger === null;
      const shown = assets.flatMap((a, j) => (j === i || !isTileHidden(a.id) ? [j] : []));
      startTransition(() => {
        // a transition, so the photo-{id} shared element can morph
        setOrder(shown);
        setIndex(i);
      });
      return true;
    },
    [assets],
  );

  // Tiles are plain hash links so the grid works without JS; this upgrades them.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>(`a[href^="${PREFIX}"]`);
      if (a && openById(a.getAttribute("href")!.slice(PREFIX.length), a)) e.preventDefault();
    };
    document.addEventListener("click", onClick);
    if (window.location.hash.startsWith(PREFIX)) openById(window.location.hash.slice(PREFIX.length), null);
    return () => document.removeEventListener("click", onClick);
  }, [openById]);

  // showModal() gives the focus trap and inert background for free. It must run
  // BEFORE the strip is scrolled: a closed dialog is display:none, so the strip's
  // clientWidth is 0 and the scroll would land on slot 0 (the previous photo).
  // Then keep the current photo in the middle slot; instant, so re-renders never
  // visibly jump.
  useLayoutEffect(() => {
    if (index === null) return;
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
    const s = stripRef.current;
    if (s) s.scrollTo({ left: s.clientWidth, behavior: "instant" });
  }, [index]);

  const count = order.length;
  const position = index === null ? -1 : order.indexOf(index);
  /** The asset `dir` places away from the current one, skipping photos hidden by the filter. */
  const at = (dir: number) => order[(position + dir + count) % count];

  const step = (dir: -1 | 1) => {
    if (index === null || count < 2) return;
    setIndex(at(dir));
  };

  const onClose = () => {
    const current = index === null ? undefined : assets[index];
    setIndex(null);
    if (!fromHashRef.current) {
      triggerRef.current?.focus();
      return;
    }
    // Opened from the URL hash on load: no tile was clicked. Drop the hash so a
    // reload does not reopen the viewer, and land focus on the gallery heading.
    fromHashRef.current = false;
    if (window.location.hash.startsWith(PREFIX)) {
      history.replaceState(history.state, "", window.location.pathname + window.location.search);
    }
    if (current) galleryHeading(current.id)?.focus();
  };

  const onScroll = () => {
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      const s = stripRef.current;
      if (!s) return;
      const slot = Math.round(s.scrollLeft / s.clientWidth);
      if (slot !== 1) step(slot < 1 ? -1 : 1);
    }, 120);
  };

  const slides = index === null || position < 0 ? [] : [-1, 0, 1].map((d) => assets[at(d)]);

  const openId = index === null ? null : (assets[index]?.id ?? null);

  return (
    <OpenPhotoContext value={openId}>
      {children}
      <dialog
        ref={dialogRef}
        className="lux-lightbox"
        closedby="any"
        aria-label="Photo viewer"
        onClose={onClose}
        onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current.close(); }}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") step(-1); else if (e.key === "ArrowRight") step(1); }}
      >
        {index !== null ? (
          <>
            <div ref={stripRef} className="lux-lightbox__strip" onScroll={onScroll}>
              {slides.map((a, slot) => {
                const current = slot === 1;
                const img = <Image src={a.src} alt={a.alt} width={a.width} height={a.height} sizes="100vw" className="lux-lightbox__img" />;
                return (
                  <figure key={slot} className="lux-lightbox__slide" aria-hidden={current ? undefined : true}>
                    <div className="lux-lightbox__box">
                      {current ? <ViewTransition name={`photo-${a.id}`} share="lux-morph">{img}</ViewTransition> : img}
                      {current ? (
                        <Card level={2} glass padding="sm" className="lux-lightbox__counter">
                          <span aria-live="polite">Photo {position + 1} of {count}</span>
                        </Card>
                      ) : null}
                    </div>
                    <figcaption className="lux-lightbox__caption">{a.caption}</figcaption>
                  </figure>
                );
              })}
            </div>
            <button type="button" className="lux-lightbox__btn lux-lightbox__close" aria-label="Close" onClick={() => dialogRef.current?.close()}>
              <Glyph d="M6 6l12 12M18 6L6 18" />
            </button>
            {count > 1 ? (
              <>
                <button type="button" className="lux-lightbox__btn lux-lightbox__prev" aria-label="Previous photo" onClick={() => step(-1)}>
                  <Glyph d="M14 6l-6 6 6 6" />
                </button>
                <button type="button" className="lux-lightbox__btn lux-lightbox__next" aria-label="Next photo" onClick={() => step(1)}>
                  <Glyph d="M10 6l6 6-6 6" />
                </button>
              </>
            ) : null}
          </>
        ) : null}
      </dialog>
    </OpenPhotoContext>
  );
}

function Glyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
