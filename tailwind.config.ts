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
        canvas: {
          primary: "#FFFFFF",
          secondary: "#F7F7F5",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          warm: "#A69B8C",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          subtle: "#E7E7E3",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        charcoal: "#1E1E1C",
        text: {
          primary: "#1E1E1C",
          muted: "#777772",
        },
        status: {
          new: { bg: "#F7F7F5", border: "#E7E7E3", text: "#1E1E1C" },
          confirmed: { bg: "#FDFBF7", border: "#E2D9C8", text: "#7A5E28" },
          preparing: { bg: "#F4F7FA", border: "#D2DCE5", text: "#2B4C6F" },
          ready: { bg: "#F5F8F3", border: "#D3DEC8", text: "#3B5E2B" },
          completed: { bg: "#FAFAFA", border: "#E7E7E3", text: "#777772" },
          cancelled: { bg: "#FDF6F5", border: "#ECCEC9", text: "#8C3426" },
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
