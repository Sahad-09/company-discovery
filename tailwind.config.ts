import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Fintech surface colors
        surface: {
          primary: "var(--surface-primary)",
          secondary: "var(--surface-secondary)",
          elevated: "var(--surface-elevated)",
        },
        // Border colors
        border: {
          subtle: "var(--border-subtle)",
          DEFAULT: "var(--border-default)",
          hover: "var(--border-hover)",
        },
        // Market colors
        market: {
          green: "var(--market-green)",
          "green-muted": "var(--market-green-muted)",
          red: "var(--market-red)",
          "red-muted": "var(--market-red-muted)",
          blue: "var(--market-blue)",
          "blue-muted": "var(--market-blue-muted)",
        },
        // Text hierarchy
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          subtle: "var(--text-subtle)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "market-shimmer": "market-shimmer 2s ease-in-out infinite",
        "ticker-pulse": "ticker-pulse 1.5s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px -10px rgba(59, 130, 246, 0.3)" },
          "50%": { boxShadow: "0 0 30px -5px rgba(59, 130, 246, 0.4)" },
        },
      },
      boxShadow: {
        "fintech-sm": "0 2px 8px -2px rgba(0, 0, 0, 0.3)",
        "fintech-md": "0 4px 16px -4px rgba(0, 0, 0, 0.4)",
        "fintech-lg": "0 8px 32px -8px rgba(0, 0, 0, 0.5)",
        "glow-blue": "0 0 20px -5px rgba(59, 130, 246, 0.3)",
        "glow-green": "0 0 20px -5px rgba(0, 210, 106, 0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "fintech-gradient": "linear-gradient(180deg, rgba(10, 11, 15, 1) 0%, rgba(13, 17, 28, 1) 50%, rgba(10, 11, 15, 1) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
