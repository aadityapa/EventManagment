"use client";

import type { ImgHTMLAttributes } from "react";

/**
 * A plain eager <img> for a page's LCP photo, rendered from a client component
 * on purpose. React Flight emits a preload hint for every non-lazy <img> a
 * server component renders, and that hint rides in the RSC payload — so each
 * route prefetch preloaded the other page's cover ("preloaded using link
 * preload but not used within a few seconds"). From here the <img> is not in
 * the Flight tree; the server HTML render (Fizz) still preloads it for the page
 * actually being loaded (fetchPriority="high"), so the LCP request is unchanged.
 */
export function LcpImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- sized local WebP set; callers pass alt
  return <img {...props} />;
}
