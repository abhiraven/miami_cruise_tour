import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        miami: {
          navy: "#0F2D4A", // Primary Navy — branding, navigation, strong text
          indigo: "#3D546C", // Navy → Blue-Gray bridge, for dark-section gradients
          gold: "#C7A461", // Gold Accent — CTAs, highlights, borders, icons
          goldBright: "#D8BF90", // Lighter Gold — hover states & gradient highlights
          ivory: "#E6EEF4", // Light Section Background — subtle secondary sections
          pearl: "#F7F4ED", // Warm Cream Background — main site background
          mist: "#EDE2CC", // Soft gold-tinted border tone
          gray: "#6B7A8F", // Secondary Blue-Gray — supporting text
          onyx: "#1E1E1E", // Dark Text
        },
      },
      fontFamily: {
        // next/font/google self-hosts Playfair Display / Jost at build time
        // and exposes them as CSS variables on <html> (see app/layout.tsx).
        // The variable comes first so the real webfont is used once loaded,
        // with the same system-serif stack as a no-JS/loading fallback.
        display: ["var(--font-display)", "ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["var(--font-display)", "ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
      },
    },
  },
  plugins: [typography],
};

export default config;
