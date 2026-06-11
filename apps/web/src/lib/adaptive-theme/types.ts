export type SampleRegion = "left-third" | "center" | "full";

export type ImageAnalysis = {
  brightness: number;
  dominant: [number, number, number];
  warmth: number;
  isWarm: boolean;
  isDark: boolean;
};

export type AdaptivePalette = {
  text: string;
  muted: string;
  accent: string;
  accentLight: string;
  overlay: string;
  scrim: string;
  scrimBottom: string;
  shadow: string;
  shadowStrong: string;
  button: string;
  buttonText: string;
  gradientGold: string;
};

export type AdaptiveRegistration = {
  id: string;
  element: HTMLElement;
  getImageSrc: () => string | undefined;
  videoRef?: { current: HTMLVideoElement | null };
  region: SampleRegion;
  priority: number;
  visibility: number;
};
