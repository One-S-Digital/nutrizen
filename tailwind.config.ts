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
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
