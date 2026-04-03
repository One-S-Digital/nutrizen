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
