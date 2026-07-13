import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        navy: "var(--navy)",
        success: "var(--success)",
        error: "var(--error)",
        warning: "var(--warning)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.06)",
        card: "0 4px 16px rgba(0,0,0,0.08)",
        md: "0 6px 20px rgba(0,0,0,0.10)",
        lg: "0 12px 32px rgba(0,0,0,0.14)",
        xl: "0 20px 60px rgba(0,0,0,0.20)",
        button: "0 4px 14px rgba(255,107,0,0.35)",
      },
      borderRadius: {
        card: "8px",
        pill: "50px",
        modal: "12px",
      },
      spacing: {
        '18': '4.5rem',
      }
    },
  },
  plugins: [],
};
export default config;
