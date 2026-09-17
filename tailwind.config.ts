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
          navy: "#0B2E44", // Midnight Ocean
          indigo: "#0E5C73", // Deep Teal
          gold: "#FF6B4A", // Sunset Coral
          goldBright: "#FF9478", // Bright Coral
          ivory: "#FBF3E7", // Warm Sand
          pearl: "#F6FBFC", // Soft Pearl (cool aqua-white)
          mist: "#DCEEF0", // Aqua Mist
          gray: "#64748B", // Slate Gray
          onyx: "#0B1720", // Onyx Black
        },
      },
      fontFamily: {
        display: ["ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
        sans: ["ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
        serif: ["ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
      },
    },
  },
  plugins: [typography],
};

export default config;
