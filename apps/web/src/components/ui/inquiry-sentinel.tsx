"use client";

import { useEffect, useRef } from "react";

/** Flags `body[data-inquiry-visible]` while its parent panel is on screen, so the action bar can hide in CSS alone. */
export function InquirySentinel() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const target = ref.current?.parentElement;
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => { document.body.dataset.inquiryVisible = String(entry.isIntersecting); }, { threshold: 0.15 });
    io.observe(target);
    return () => { io.disconnect(); delete document.body.dataset.inquiryVisible; };
  }, []);
  return <span ref={ref} hidden />;
}
