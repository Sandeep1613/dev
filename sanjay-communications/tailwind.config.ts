import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: ["SF Pro Display", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#1d1d1f",
          soft: "#424245",
          mute: "#86868b",
        },
        bg: {
          DEFAULT: "#ffffff",
          subtle: "#f5f5f7",
          dim: "#fafafa",
        },
        accent: {
          DEFAULT: "#0071e3",
          hover: "#0077ed",
        },
        line: "#d2d2d7",
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter: "-0.025em",
        tight: "-0.015em",
      },
      borderRadius: {
        xl: "18px",
        "2xl": "22px",
        "3xl": "28px",
      },
      boxShadow: {
        card: "0 4px 16px rgba(0,0,0,0.04)",
        cardHover: "0 12px 36px rgba(0,0,0,0.08)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fadeIn 0.6s ease both",
        marquee: "marquee 28s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
