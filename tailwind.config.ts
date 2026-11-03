import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF6B2C",
          "orange-hover": "#F35815",
          "orange-light": "#FFF7ED",
          "orange-soft": "#FFEDD5",
          navy: "#061826",
          "navy-light": "#0A2135",
          "navy-card": "#0E2A42",
          blue: "#1E6FD9",
          "blue-hover": "#1659B0",
          "blue-light": "#EFF6FF",
          canvas: "#FAFAFA",
          surface: "#F1F5F9",
          border: "#E2E8F0",
          heading: "#0F172A",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 20px 40px -10px rgba(0, 0, 0, 0.12)",
        pill: "0 2px 10px rgba(0, 0, 0, 0.04)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
        marquee: "marquee 35s linear infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
