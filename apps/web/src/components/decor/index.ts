// V8 décor barrel — the luxury-celebration layer (V8 brief, package D).
// Server components (SVG + CSS, styled in src/styles/decor.css); every piece is
// aria-hidden and absolutely positioned inside the caller's positioned box.
//
// `burstConfetti` is deliberately NOT re-exported: it is client-only and must
// stay out of every initial bundle — callers load it on demand with
// `import("@/components/decor/confetti")`.

export { FairyLights, type FairyLightsProps } from "@/components/decor/fairy-lights";
export { StageLights, type StageLightsProps } from "@/components/decor/stage-lights";
export { Filigree, FiligreeFrame, type FiligreeKind, type FiligreeProps } from "@/components/decor/filigree";
export { Sparkles, type SparklesProps } from "@/components/decor/sparkles";
export { PetalsLayer, type PetalsLayerProps } from "@/components/decor/petals-layer";
export type { ConfettiOptions } from "@/components/decor/confetti";
