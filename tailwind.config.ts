import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#EEF3F6",
        input: "#EEF3F6",
        ring: "#8CAB77",
        foreground: "#2F3A33",
        primary: {
          DEFAULT: "#8CAB77",
          foreground: "#F7F9F6",
        },
        secondary: {
          DEFAULT: "#6995B1",
          foreground: "#F7F9F6",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#EEF3F6",
          foreground: "#5A6A65",
        },
        accent: {
          DEFAULT: "#EEF3F6",
          foreground: "#2F3A33",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#2F3A33",
        },
        neutral: {
          light: "#EEF3F6",
          DEFAULT: "#C4C4C4",
          dark: "#5A6A65",
          darkest: "#2F3A33",
        },
        background: {
          DEFAULT: "#FFFFFF",
          main: "#F7F9F6",
          alt: "#EEF3F6",
          white: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#10201A",
          deep: "#0A1510",
          soft: "#1A2C1E",
          mist: "#24382B",
        },
        paper: {
          DEFAULT: "#F6F3EA",
          warm: "#EFEAD9",
          white: "#FFFFFF",
        },
        glow: "#D9E8C4",
        goal: {
          immunity: "#42634C",
          energy: "#A8762E",
          calm: "#5B5E80",
          recovery: "#8A5A40",
          cellular: "#2F5D5C",
          metabolic: "#6B7240",
          detox: "#4E7050",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.4)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "pulse-soft": "pulse-soft 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
