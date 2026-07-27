"use client";

import { useEffect } from "react";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-5WS115MZ5E";

export function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    if (!document.querySelector(`script[src="${src}"]`)) {
      const gtagScript = document.createElement("script");
      gtagScript.src = src;
      gtagScript.async = true;
      document.head.appendChild(gtagScript);
    }

    if (!document.getElementById("google-analytics-inline")) {
      const inline = document.createElement("script");
      inline.id = "google-analytics-inline";
      inline.text = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}');
      `;
      document.head.appendChild(inline);
    }
  }, []);

  return null;
}
