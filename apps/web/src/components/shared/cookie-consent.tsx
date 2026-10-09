"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GA_MEASUREMENT_ID, HOTJAR_ID, whenActivated } from "@/lib/analytics";

export const CONSENT_STORAGE_KEY = "glitz-cookie-consent";
export const CONSENT_EVENT = "nexyyra:consent";
/** Re-opens the banner so a visitor can change or withdraw their choice. */
export const CONSENT_OPEN_EVENT = "nexyyra:consent-open";

type ConsentChoice = "accepted" | "declined";

/** "accepted" | "declined" | null — analytics load only on "accepted". */
export function readConsent(): string | null {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Opens the consent banner again ("Cookie settings"). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

/** Cookies and storage keys set by Google Analytics (_ga, _ga_*, _gid, _gat*) and Hotjar (_hj*). */
const TRACKER_KEY = /^(_ga|_gid|_gat|_hj)/;

/**
 * Deletes the analytics cookies this origin can reach. GA and Hotjar set
 * theirs on the registrable domain, so each cookie is expired for the host
 * and every parent domain (the browser ignores the ones that do not match).
 */
function clearTrackerStorage() {
  const parts = window.location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i += 1) domains.push(`; domain=.${parts.slice(i).join(".")}`);

  for (const pair of document.cookie.split(";")) {
    const name = pair.split("=")[0]?.trim();
    if (!name || !TRACKER_KEY.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }

  for (const getStore of [() => localStorage, () => sessionStorage]) {
    try {
      const store = getStore();
      for (const key of Object.keys(store)) if (TRACKER_KEY.test(key)) store.removeItem(key);
    } catch {
      /* storage blocked — nothing stored there either */
    }
  }
}

/** True when GA or Hotjar was injected into this document (consent given earlier in this page view). */
function trackersLoaded() {
  return Boolean(document.getElementById("google-analytics-inline") || document.getElementById("hotjar-init"));
}

/**
 * Consent sheet. Sits above the phone action bar (never stacked under it) and
 * offers Accept and Decline at equal weight. A page prerendered by Speculation
 * Rules must not read or stamp consent, so nothing happens until the document
 * is actually shown (whenActivated).
 *
 * Withdrawal is as easy as giving consent: any `[data-consent-open]` link (the
 * footer's and the privacy policy's "Cookie settings") re-opens this sheet.
 * Declining after an accept stops GA at once, deletes the _ga / _hj cookies,
 * and reloads so no tracker script stays resident in the page.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const focusOnOpen = useRef(false);

  useEffect(() => {
    let timer: number | undefined;
    let cancelled = false;
    void whenActivated().then(() => {
      if (cancelled || readConsent()) return;
      timer = window.setTimeout(() => setVisible(true), 1200);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  // "Cookie settings": the links are plain server-rendered anchors to
  // /privacy#cookies (they still work without JS); with JS they open the sheet.
  useEffect(() => {
    const open = () => {
      setCurrent(readConsent());
      focusOnOpen.current = true;
      setVisible(true);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("[data-consent-open]")) return;
      event.preventDefault();
      openConsentSettings();
    };
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT, open);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (!visible || !focusOnOpen.current) return;
    focusOnOpen.current = false;
    sheetRef.current?.focus();
  }, [visible]);

  const choose = async (value: ConsentChoice) => {
    await whenActivated();
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch {
      /* storage blocked — the choice still applies for this page view */
    }

    if (value === "declined") {
      const loaded = trackersLoaded();
      if (GA_MEASUREMENT_ID) (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
      clearTrackerStorage();
      if (loaded) {
        // Scripts already running cannot be unloaded; a fresh page view starts without them.
        window.location.reload();
        return;
      }
    }

    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section ref={sheetRef} tabIndex={-1} aria-label="Cookie consent" className="pg-shell-consent">
      <p className="pg-shell-consent__title">Analytics cookies</p>
      <p className="pg-shell-consent__text">
        {HOTJAR_ID === null
          ? "With your permission we use Google Analytics to see how the site is used."
          : "With your permission we use Google Analytics to see how the site is used, and Hotjar to record how visitors move through pages (clicks, taps and scrolling)."}{" "}
        Nothing loads until you choose; change it any time under &ldquo;Cookie settings&rdquo; in the footer.{" "}
        {current === "accepted" || current === "declined" ? `Your current choice: ${current}. ` : null}
        <Link href="/privacy#cookies" prefetch={false}>Privacy policy</Link>
      </p>
      <div className="pg-shell-consent__actions">
        <button type="button" className="pg-shell-consent__btn" onClick={() => void choose("accepted")}>
          Accept
        </button>
        <button type="button" className="pg-shell-consent__btn" onClick={() => void choose("declined")}>
          Decline
        </button>
      </div>
    </section>
  );
}
