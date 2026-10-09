"use client";

import { useEffect } from "react";
import { HOTJAR_ID } from "@/lib/analytics";

/**
 * Hotjar session recording. Mounted by AnalyticsProvider only after the
 * visitor accepts in the cookie banner, and only when a real Hotjar id is set
 * (HOTJAR_ID is null for unset or placeholder ids).
 */
export function Hotjar() {
  useEffect(() => {
    if (HOTJAR_ID === null) return;
    if (document.getElementById("hotjar-init")) return;

    const script = document.createElement("script");
    script.id = "hotjar-init";
    script.text = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
    document.head.appendChild(script);
  }, []);

  return null;
}
