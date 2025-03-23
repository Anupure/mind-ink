// tailwind config is required for editor support

import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "content" | "presets" | "theme" | "plugins"> = {
  content: ["./app/**/*.tsx", "./ui/**/*.tsx"],
  presets: [sharedConfig],
  theme: {
    extend: {
      fontFamily: {
        handWritten: ["var(--font-handwritten)","Indie Flower", "cursive"],
        sans: ["var(--font-sans)","Inter", "system-ui", "Arial", "sans-serif"],
      },
      animation:{
        'ink-splash':'inkSplash 0.8s forwards cubic-bezier(0.165, 0.84, 0.44, 1)',
        'ink-spread':'inkSpread 0.5s forwards cubic-bezier(0.165, 0.84, 0.44, 1)',
      },
      keyframes: {
        inkSplash: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(5)', opacity: '0.7' },
          '100%': { transform: 'scale(10)', opacity: '0' },
        },
        inkSpread: {
          '0%': { transform: 'scale(0.5)', opacity: '0.7' },
          '100%': { transform: 'scale(1.2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;