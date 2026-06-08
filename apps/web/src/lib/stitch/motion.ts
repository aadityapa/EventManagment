export const STITCH_EASE = [0.22, 1, 0.36, 1] as const;

export const stitchTransition = {
  duration: 0.7,
  ease: STITCH_EASE,
};

export const stitchStagger = 0.08;

export const stitchVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeScale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
  textReveal: {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  lineGrow: {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1 },
  },
};

export const stitchViewport = { once: true, margin: "-80px" as const, amount: 0.2 as const };
