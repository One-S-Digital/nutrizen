/** Shared scroll-into-view presets for Framer Motion (site-wide). */
export const scrollEase = [0.22, 1, 0.36, 1] as const;

export const scrollViewport = {
  once: true,
  amount: 0.35,
  margin: "0px 0px -8% 0px",
} as const;

/** Roughly matches former GSAP `start: "top 60%"` / earlier reveal. */
export const scrollViewportEarly = {
  once: true,
  amount: 0.28,
  margin: "0px 0px -14% 0px",
} as const;

/**
 * Quiet Lab motion grammar — instrument precision, no bounce.
 * One scroll-driven hero moment per page; everything else stays micro.
 */
export const DUR = { fast: 0.45, base: 0.7, slow: 1.05 } as const;

export const STAGGER = 0.08;

/** Cursor-follow lag for light-field / magnetic elements. */
export const springLag = { stiffness: 55, damping: 18, mass: 0.8 } as const;

/** Specimen tilt response. */
export const springTilt = { stiffness: 150, damping: 20, mass: 0.6 } as const;

/** Panel expansion (goal selector). */
export const springPanel = { type: "spring", stiffness: 170, damping: 27 } as const;
