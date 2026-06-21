"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useTheme } from "next-themes";
import {
  analyzeImageUrl,
  analyzeVideoFrame,
  applyAdaptiveVars,
  applyAdaptiveVarsToSection,
  generatePalette,
  resetAdaptiveVars,
} from "@/lib/adaptive-theme";
import type { SampleRegion } from "@/lib/adaptive-theme";

type RegisterOptions = {
  id: string;
  element: HTMLElement;
  getImageSrc: () => string | undefined;
  videoRef?: { current: HTMLVideoElement | null };
  region?: SampleRegion;
  priority?: number;
};

type AdaptiveThemeContextValue = {
  register: (options: RegisterOptions) => () => void;
  pushImage: (src: string, region?: SampleRegion) => void;
};

const AdaptiveThemeContext = createContext<AdaptiveThemeContextValue | null>(null);

const VISIBILITY_THRESHOLD = 0.15;

export function AdaptiveThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const registrations = useRef(new Map<string, RegisterOptions & { visibility: number }>());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const analyzingRef = useRef(false);
  const forcedSrcRef = useRef<{ src: string; region: SampleRegion } | null>(null);

  const pickWinner = useCallback(() => {
    let best: (RegisterOptions & { visibility: number }) | null = null;
    let bestScore = -1;

    for (const reg of registrations.current.values()) {
      const score = reg.visibility * (reg.priority ?? 1);
      if (score > bestScore) {
        bestScore = score;
        best = reg;
      }
    }

    return bestScore >= VISIBILITY_THRESHOLD ? best : null;
  }, []);

  const clearAdaptiveState = useCallback((section?: HTMLElement | null) => {
    const root = document.documentElement;
    resetAdaptiveVars(root);
    delete root.dataset.adaptiveActive;
    if (section) {
      resetAdaptiveVars(section);
    }
  }, []);

  const applyFromSource = useCallback(
    async (
      src: string | undefined,
      region: SampleRegion,
      section?: HTMLElement | null,
      videoRef?: { current: HTMLVideoElement | null }
    ) => {
      if (typeof document === "undefined") return;

      const root = document.documentElement;

      if (!src && !videoRef?.current) {
        clearAdaptiveState(section);
        activeIdRef.current = null;
        return;
      }

      if (analyzingRef.current) return;
      analyzingRef.current = true;

      try {
        let analysis;

        if (videoRef?.current) {
          analysis = analyzeVideoFrame(videoRef.current, region);
        }

        if (!analysis && src) {
          analysis = await analyzeImageUrl(src, region);
        }

        if (!analysis) {
          clearAdaptiveState(section);
          return;
        }

        const palette = generatePalette(analysis, region);
        if (section) {
          applyAdaptiveVarsToSection(section, palette);
        }
        delete root.dataset.adaptiveActive;
      } finally {
        analyzingRef.current = false;
      }
    },
    [clearAdaptiveState]
  );

  const refreshActive = useCallback(async () => {
    if (forcedSrcRef.current) {
      const { src, region } = forcedSrcRef.current;
      const winner = pickWinner();
      await applyFromSource(src, region, winner?.element, winner?.videoRef);
      return;
    }

    const winner = pickWinner();
    if (!winner) {
      clearAdaptiveState();
      activeIdRef.current = null;
      return;
    }

    const src = winner.getImageSrc();
    if (activeIdRef.current === winner.id) {
      if (src || winner.videoRef?.current) {
        await applyFromSource(src, winner.region ?? "left-third", winner.element, winner.videoRef);
      }
      return;
    }

    activeIdRef.current = winner.id;
    await applyFromSource(src, winner.region ?? "left-third", winner.element, winner.videoRef);
  }, [applyFromSource, clearAdaptiveState, pickWinner]);

  const register = useCallback(
    (options: RegisterOptions) => {
      const entry = {
        ...options,
        region: options.region ?? "left-third",
        priority: options.priority ?? 1,
        visibility: 0,
      };
      registrations.current.set(options.id, entry);

      observerRef.current?.observe(options.element);

      const src = options.getImageSrc();
      if (src) {
        void refreshActive();
      }

      return () => {
        registrations.current.delete(options.id);
        observerRef.current?.unobserve(options.element);
        if (activeIdRef.current === options.id) {
          activeIdRef.current = null;
          forcedSrcRef.current = null;
          void refreshActive();
        }
      };
    },
    [refreshActive]
  );

  const pushImage = useCallback(
    (src: string, region: SampleRegion = "left-third") => {
      forcedSrcRef.current = { src, region };
      const winner = pickWinner();
      void applyFromSource(src, region, winner?.element, winner?.videoRef);
    },
    [applyFromSource, pickWinner]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          for (const reg of registrations.current.values()) {
            if (reg.element === entry.target) {
              reg.visibility = entry.intersectionRatio;
            }
          }
        }
        forcedSrcRef.current = null;
        void refreshActive();
      },
      { threshold: [0, 0.15, 0.35, 0.55, 0.75, 1] }
    );

    observerRef.current = observer;

    for (const reg of registrations.current.values()) {
      observer.observe(reg.element);
    }

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [refreshActive]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    clearAdaptiveState();
    forcedSrcRef.current = null;
    activeIdRef.current = null;
    void refreshActive();
  }, [resolvedTheme, clearAdaptiveState, refreshActive]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const winner = pickWinner();
      if (winner?.videoRef?.current && winner.visibility >= VISIBILITY_THRESHOLD) {
        void applyFromSource(undefined, winner.region ?? "left-third", winner.element, winner.videoRef);
      }
    }, 2500);
    return () => window.clearInterval(id);
  }, [applyFromSource, pickWinner]);

  const value = useMemo(() => ({ register, pushImage }), [register, pushImage]);

  return <AdaptiveThemeContext.Provider value={value}>{children}</AdaptiveThemeContext.Provider>;
}

export function useAdaptiveTheme() {
  return useContext(AdaptiveThemeContext);
}

export function useAdaptiveBackdrop({
  imageSrc,
  videoRef,
  region = "left-third",
  priority = 1,
  enabled = true,
}: {
  imageSrc?: string;
  videoRef?: { current: HTMLVideoElement | null };
  region?: SampleRegion;
  priority?: number;
  enabled?: boolean;
}) {
  const ctx = useAdaptiveTheme();
  const id = useId();
  const imageSrcRef = useRef(imageSrc);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    imageSrcRef.current = imageSrc;
  }, [imageSrc]);

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      cleanupRef.current?.();
      cleanupRef.current = null;

      if (!node || !ctx || !enabled) return;

      cleanupRef.current = ctx.register({
        id,
        element: node,
        getImageSrc: () => imageSrcRef.current,
        videoRef,
        region,
        priority,
      });
    },
    [ctx, id, enabled, region, priority, videoRef]
  );

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (ctx && enabled && imageSrc) {
      ctx.pushImage(imageSrc, region);
    }
  }, [ctx, enabled, imageSrc, region]);

  return setRef;
}
