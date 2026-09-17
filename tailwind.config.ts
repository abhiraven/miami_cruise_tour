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
        // Outfit is the site's one and only typeface. next/font/google
        // self-hosts it and exposes it as --font-outfit on <html> (see
        // app/layout.tsx). Every key below — display, sans, serif — points
        // to the same variable + sans-serif fallback stack, so headings,
        // body copy, and every other element always render in Outfit
        // regardless of which font-* utility class is applied to them.
        display: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        sans: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [typography],
};

export default config;
