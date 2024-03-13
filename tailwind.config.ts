import type { Config } from "tailwindcss";

import colors from "tailwindcss/colors";

export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.vue"],

  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1200px",
      xl: "1280px",
      "2xl": "1350px",
    },

    fontSize: {
      8: ["8px", "14px"],
      10: ["10px", "14px"],
      11: ["11px", "14px"],
      12: ["12px", "16px"],
      13: ["13px", "16px"],
      14: ["14px", "18px"],
      15: ["15px", "16px"],
      16: ["16px", "22px"],
      17: ["17px", "22px"],
      18: ["18px", "26px"],
      20: ["20px", "26px"],
      22: ["22px", "26px"],
      24: ["24px", "26px"],
      32: ["32px", "36px"],
      36: ["36px", "36px"],
    },

    lineHeight: {
      10: "10px",
      14: "14px",
      20: "20px",
      24: "24px",
      30: "30px",
      48: "48px",
      110: "110px",
      120: "120px",
    },

    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      yellow: colors.yellow,
      orange: colors.orange,
      blue: colors.blue,
      red: colors.red,
      green: colors.green,
      primary: "var(--primary)",
      secondary: "var(--secondary)",
      warning: "var(--red)",
      gray: "var(--gray)",
      "light-gray": "var(--light-gray)",
      "page-bg": "var(--page-bg)",
    },

    extend: {
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
    },

    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        md: "1rem",
        lg: "2rem",
        xl: "2rem",
        "2xl": "2rem",
      },
    },
  },
} satisfies Config;
