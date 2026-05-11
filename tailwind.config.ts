import type { Config } from "tailwindcss";

const withOpacity = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    extend: {
      colors: {
        border: withOpacity("--border"),
        input: withOpacity("--input"),
        ring: withOpacity("--ring"),
        background: withOpacity("--background"),
        foreground: withOpacity("--foreground"),
        primary: {
          DEFAULT: withOpacity("--primary"),
          foreground: withOpacity("--primary-foreground"),
        },
        secondary: {
          DEFAULT: withOpacity("--secondary"),
          foreground: withOpacity("--secondary-foreground"),
        },
        destructive: {
          DEFAULT: withOpacity("--destructive"),
          foreground: withOpacity("--destructive-foreground"),
        },
        muted: {
          DEFAULT: withOpacity("--muted"),
          foreground: withOpacity("--muted-foreground"),
        },
        accent: {
          DEFAULT: withOpacity("--accent"),
          foreground: withOpacity("--accent-foreground"),
        },
        popover: {
          DEFAULT: withOpacity("--popover"),
          foreground: withOpacity("--popover-foreground"),
        },
        card: {
          DEFAULT: withOpacity("--card"),
          foreground: withOpacity("--card-foreground"),
        },
        inputInfo: {
          err_color: withOpacity("--input-info-error"),
          succ_color: withOpacity("--input-info-success"),
        },
        main: {
          red: withOpacity("--main-red"),
          dark: withOpacity("--main-dark"),
          gray: withOpacity("--main-gray"),
          white_100: withOpacity("--main-white-100"),
          white_300: withOpacity("--main-white-300"),
          match_color: withOpacity("--main-match-color"),
          login_input_info_color: withOpacity("--main-login-input-info"),
        },
        chart: {
          "1": withOpacity("--chart-1"),
          "2": withOpacity("--chart-2"),
          "3": withOpacity("--chart-3"),
          "4": withOpacity("--chart-4"),
          "5": withOpacity("--chart-5"),
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "slide-X": "slide-X 5s infinite linear",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
} satisfies Config;
