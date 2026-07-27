"use client";

import { useEffect } from "react";

const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;

export function Hotjar() {
  useEffect(() => {
    if (!HOTJAR_ID) return;

    const hjid = Number.parseInt(HOTJAR_ID, 10);
    if (Number.isNaN(hjid)) return;
    if (document.getElementById("hotjar-init")) return;

    const script = document.createElement("script");
    script.id = "hotjar-init";
    script.text = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${hjid},hjsv:6};
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
