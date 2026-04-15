/**
 * AUTO-GENERATED from tokens/source/*.tokens.json
 * Do NOT edit by hand. Run `npm run tokens:generate`.
 *
 * Exports:
 *   cssVar          — flat map { "kebab-name": "var(--kebab-name, fallback)" }
 *   token           — nested ergonomic tree (token.color.primary[500])
 *   typographyStyle — compound typography as CSSProperties objects
 *   shadowValue     — CSS box-shadow strings
 */

import type { CSSProperties } from "react";

export const cssVar = {
  "color-primary-50": "var(--color-primary-50, #ebeef3)",
  "color-primary-100": "var(--color-primary-100, #b0c3d3)",
  "color-primary-200": "var(--color-primary-200, #8aa6bd)",
  "color-primary-300": "var(--color-primary-300, #547e9f)",
  "color-primary-400": "var(--color-primary-400, #33658d)",
  "color-primary-500": "var(--color-primary-500, #003e70)",
  "color-primary-600": "var(--color-primary-600, #003866)",
  "color-primary-700": "var(--color-primary-700, #002c50)",
  "color-primary-800": "var(--color-primary-800, #00223e)",
  "color-primary-900": "var(--color-primary-900, #001a2f)",
  "color-neutral-50": "var(--color-neutral-50, #f3f3f3)",
  "color-neutral-100": "var(--color-neutral-100, #d8d8d8)",
  "color-neutral-200": "var(--color-neutral-200, #c6c6c6)",
  "color-neutral-300": "var(--color-neutral-300, #ababab)",
  "color-neutral-400": "var(--color-neutral-400, #9b9b9b)",
  "color-neutral-500": "var(--color-neutral-500, #828282)",
  "color-neutral-600": "var(--color-neutral-600, #767676)",
  "color-neutral-700": "var(--color-neutral-700, #5c5c5c)",
  "color-neutral-800": "var(--color-neutral-800, #484848)",
  "color-neutral-900": "var(--color-neutral-900, #373737)",
  "color-secondary-50": "var(--color-secondary-50, #fef2ec)",
  "color-secondary-100": "var(--color-secondary-100, #fbd7c3)",
  "color-secondary-200": "var(--color-secondary-200, #f9c3a6)",
  "color-secondary-300": "var(--color-secondary-300, #f7a87d)",
  "color-secondary-400": "var(--color-secondary-400, #f59764)",
  "color-secondary-500": "var(--color-secondary-500, #f37d3d)",
  "color-secondary-600": "var(--color-secondary-600, #dd7238)",
  "color-secondary-700": "var(--color-secondary-700, #ad592b)",
  "color-secondary-800": "var(--color-secondary-800, #864522)",
  "color-secondary-900": "var(--color-secondary-900, #66351a)",
  "color-green-50": "var(--color-green-50, #e6f5ed)",
  "color-green-100": "var(--color-green-100, #b0dfc8)",
  "color-green-200": "var(--color-green-200, #8acfae)",
  "color-green-300": "var(--color-green-300, #54b988)",
  "color-green-400": "var(--color-green-400, #33ac71)",
  "color-green-500": "var(--color-green-500, #00974e)",
  "color-green-600": "var(--color-green-600, #008947)",
  "color-green-700": "var(--color-green-700, #006b37)",
  "color-green-800": "var(--color-green-800, #00532b)",
  "color-green-900": "var(--color-green-900, #003f21)",
  "color-red-50": "var(--color-red-50, #ffebea)",
  "color-red-100": "var(--color-red-100, #ffc2bf)",
  "color-red-200": "var(--color-red-200, #ffa4a0)",
  "color-red-300": "var(--color-red-300, #ff7b74)",
  "color-red-400": "var(--color-red-400, #ff6159)",
  "color-red-500": "var(--color-red-500, #ff3a30)",
  "color-red-600": "var(--color-red-600, #e8352c)",
  "color-red-700": "var(--color-red-700, #b52922)",
  "color-red-800": "var(--color-red-800, #8c201a)",
  "color-red-900": "var(--color-red-900, #6b1814)",
  "feedback-verde-confirmado": "var(--feedback-verde-confirmado, #00974e)",
  "feedback-naranja": "var(--feedback-naranja, #f37d3d)",
  "feedback-error": "var(--feedback-error, #ff3b30)",
  "feedback-deshabilitado": "var(--feedback-deshabilitado, #d8e6ff)",
  "feedback-success": "var(--feedback-success, #00974e)",
  "size-xs": "var(--size-xs, 4px)",
  "size-s": "var(--size-s, 8px)",
  "size-md": "var(--size-md, 12px)",
  "size-l": "var(--size-l, 16px)",
  "size-xl": "var(--size-xl, 24px)",
  "size-xxl": "var(--size-xxl, 36px)",
  "grid-mobile-columns": "var(--grid-mobile-columns, 4)",
  "grid-mobile-gutter": "var(--grid-mobile-gutter, 16px)",
  "grid-mobile-gap": "var(--grid-mobile-gap, 12px)",
  "grid-tablet-columns": "var(--grid-tablet-columns, 8)",
  "grid-tablet-gutter": "var(--grid-tablet-gutter, 24px)",
  "grid-tablet-gap": "var(--grid-tablet-gap, 16px)",
  "grid-desktop-columns": "var(--grid-desktop-columns, 12)",
  "grid-desktop-gutter": "var(--grid-desktop-gutter, 36px)",
  "grid-desktop-gap": "var(--grid-desktop-gap, 24px)",
  "border-width-default": "var(--border-width-default, 1px)",
  "radius-xs": "var(--radius-xs, 4px)",
  "radius-s": "var(--radius-s, 8px)",
  "radius-md": "var(--radius-md, 12px)",
  "radius-l": "var(--radius-l, 16px)",
  "brand-primary": "var(--brand-primary, #003e70)",
  "brand-primary-dark": "var(--brand-primary-dark, #002c50)",
  "brand-primary-hover": "var(--brand-primary-hover, #002c50)",
  "brand-primary-light": "var(--brand-primary-light, #b0c3d3)",
  "brand-primary-subtle": "var(--brand-primary-subtle, #ebeef3)",
  "brand-secondary": "var(--brand-secondary, #f26e25)",
  "brand-primary-2": "var(--brand-primary-2, #42689f)",
  "text-primary": "var(--text-primary, #333333)",
  "text-secondary": "var(--text-secondary, #828282)",
  "text-tertiary": "var(--text-tertiary, #bdbdbd)",
  "text-disabled": "var(--text-disabled, #bdbdbd)",
  "text-brand": "var(--text-brand, #002c50)",
  "text-on-primary": "var(--text-on-primary, #f2f2f2)",
  "icon-primary": "var(--icon-primary, #4f4f4f)",
  "bg-app": "var(--bg-app, #ebeef3)",
  "bg-app-secondary": "var(--bg-app-secondary, #ffffff)",
  "bg-surface": "var(--bg-surface, #f9f9f9)",
  "bg-button": "var(--bg-button, #fefefe)",
  "bg-input": "var(--bg-input, #f2f2f2)",
  "bg-disabled": "var(--bg-disabled, #e0e0e0)",
  "border-default": "var(--border-default, #e0e0e0)",
  "focus-ring": "var(--focus-ring, #cbd5e1)",
  "focus-ring-error": "var(--focus-ring-error, #fca5a5)",
  "typography-font-family-heading": "var(--typography-font-family-heading, Nunito, sans-serif)",
  "typography-font-family-number": "var(--typography-font-family-number, Montserrat, sans-serif)",
  "typography-font-family-body": "var(--typography-font-family-body, Inter, sans-serif)",
  "typography-font-weight-regular": "var(--typography-font-weight-regular, 400)",
  "typography-font-weight-medium": "var(--typography-font-weight-medium, 500)",
  "typography-font-weight-semibold": "var(--typography-font-weight-semibold, 600)",
  "typography-font-weight-bold": "var(--typography-font-weight-bold, 700)",
  "typography-font-weight-extrabold": "var(--typography-font-weight-extrabold, 800)",
  "typography-font-size-12": "var(--typography-font-size-12, 12px)",
  "typography-font-size-14": "var(--typography-font-size-14, 14px)",
  "typography-font-size-16": "var(--typography-font-size-16, 16px)",
  "typography-font-size-18": "var(--typography-font-size-18, 18px)",
  "typography-font-size-22": "var(--typography-font-size-22, 22px)",
  "typography-font-size-24": "var(--typography-font-size-24, 24px)",
  "typography-font-size-30": "var(--typography-font-size-30, 30px)",
  "typography-font-size-36": "var(--typography-font-size-36, 36px)",
  "typography-line-height-normal": "var(--typography-line-height-normal, 1)",
  "typography-letter-spacing-default": "var(--typography-letter-spacing-default, 0px)",
} as const;

export type CssVarName = keyof typeof cssVar;

export const token = {
  color: {
    primary: {
      "50": cssVar["color-primary-50"],
      "100": cssVar["color-primary-100"],
      "200": cssVar["color-primary-200"],
      "300": cssVar["color-primary-300"],
      "400": cssVar["color-primary-400"],
      "500": cssVar["color-primary-500"],
      "600": cssVar["color-primary-600"],
      "700": cssVar["color-primary-700"],
      "800": cssVar["color-primary-800"],
      "900": cssVar["color-primary-900"]
    },
    neutral: {
      "50": cssVar["color-neutral-50"],
      "100": cssVar["color-neutral-100"],
      "200": cssVar["color-neutral-200"],
      "300": cssVar["color-neutral-300"],
      "400": cssVar["color-neutral-400"],
      "500": cssVar["color-neutral-500"],
      "600": cssVar["color-neutral-600"],
      "700": cssVar["color-neutral-700"],
      "800": cssVar["color-neutral-800"],
      "900": cssVar["color-neutral-900"]
    },
    secondary: {
      "50": cssVar["color-secondary-50"],
      "100": cssVar["color-secondary-100"],
      "200": cssVar["color-secondary-200"],
      "300": cssVar["color-secondary-300"],
      "400": cssVar["color-secondary-400"],
      "500": cssVar["color-secondary-500"],
      "600": cssVar["color-secondary-600"],
      "700": cssVar["color-secondary-700"],
      "800": cssVar["color-secondary-800"],
      "900": cssVar["color-secondary-900"]
    },
    green: {
      "50": cssVar["color-green-50"],
      "100": cssVar["color-green-100"],
      "200": cssVar["color-green-200"],
      "300": cssVar["color-green-300"],
      "400": cssVar["color-green-400"],
      "500": cssVar["color-green-500"],
      "600": cssVar["color-green-600"],
      "700": cssVar["color-green-700"],
      "800": cssVar["color-green-800"],
      "900": cssVar["color-green-900"]
    },
    red: {
      "50": cssVar["color-red-50"],
      "100": cssVar["color-red-100"],
      "200": cssVar["color-red-200"],
      "300": cssVar["color-red-300"],
      "400": cssVar["color-red-400"],
      "500": cssVar["color-red-500"],
      "600": cssVar["color-red-600"],
      "700": cssVar["color-red-700"],
      "800": cssVar["color-red-800"],
      "900": cssVar["color-red-900"]
    }
  },
  feedback: {
    verdeConfirmado: cssVar["feedback-verde-confirmado"],
    naranja: cssVar["feedback-naranja"],
    error: cssVar["feedback-error"],
    deshabilitado: cssVar["feedback-deshabilitado"],
    success: cssVar["feedback-success"]
  },
  size: {
    xs: cssVar["size-xs"],
    s: cssVar["size-s"],
    md: cssVar["size-md"],
    l: cssVar["size-l"],
    xl: cssVar["size-xl"],
    xxl: cssVar["size-xxl"]
  },
  grid: {
    mobile: {
      columns: cssVar["grid-mobile-columns"],
      gutter: cssVar["grid-mobile-gutter"],
      gap: cssVar["grid-mobile-gap"]
    },
    tablet: {
      columns: cssVar["grid-tablet-columns"],
      gutter: cssVar["grid-tablet-gutter"],
      gap: cssVar["grid-tablet-gap"]
    },
    desktop: {
      columns: cssVar["grid-desktop-columns"],
      gutter: cssVar["grid-desktop-gutter"],
      gap: cssVar["grid-desktop-gap"]
    }
  },
  borderWidth: {
    default: cssVar["border-width-default"]
  },
  radius: {
    xs: cssVar["radius-xs"],
    s: cssVar["radius-s"],
    md: cssVar["radius-md"],
    l: cssVar["radius-l"]
  },
  brand: {
    primary: cssVar["brand-primary"],
    primaryDark: cssVar["brand-primary-dark"],
    primaryHover: cssVar["brand-primary-hover"],
    primaryLight: cssVar["brand-primary-light"],
    primarySubtle: cssVar["brand-primary-subtle"],
    secondary: cssVar["brand-secondary"],
    primary2: cssVar["brand-primary-2"]
  },
  text: {
    primary: cssVar["text-primary"],
    secondary: cssVar["text-secondary"],
    tertiary: cssVar["text-tertiary"],
    disabled: cssVar["text-disabled"],
    brand: cssVar["text-brand"],
    onPrimary: cssVar["text-on-primary"]
  },
  icon: {
    primary: cssVar["icon-primary"]
  },
  bg: {
    app: cssVar["bg-app"],
    appSecondary: cssVar["bg-app-secondary"],
    surface: cssVar["bg-surface"],
    button: cssVar["bg-button"],
    input: cssVar["bg-input"],
    disabled: cssVar["bg-disabled"]
  },
  border: {
    default: cssVar["border-default"]
  },
  focus: {
    ring: cssVar["focus-ring"],
    ringError: cssVar["focus-ring-error"]
  },
  typography: {
    fontFamily: {
      heading: cssVar["typography-font-family-heading"],
      number: cssVar["typography-font-family-number"],
      body: cssVar["typography-font-family-body"]
    },
    fontWeight: {
      regular: cssVar["typography-font-weight-regular"],
      medium: cssVar["typography-font-weight-medium"],
      semibold: cssVar["typography-font-weight-semibold"],
      bold: cssVar["typography-font-weight-bold"],
      extrabold: cssVar["typography-font-weight-extrabold"]
    },
    fontSize: {
      "12": cssVar["typography-font-size-12"],
      "14": cssVar["typography-font-size-14"],
      "16": cssVar["typography-font-size-16"],
      "18": cssVar["typography-font-size-18"],
      "22": cssVar["typography-font-size-22"],
      "24": cssVar["typography-font-size-24"],
      "30": cssVar["typography-font-size-30"],
      "36": cssVar["typography-font-size-36"]
    },
    lineHeight: {
      normal: cssVar["typography-line-height-normal"]
    },
    letterSpacing: {
      default: cssVar["typography-letter-spacing-default"]
    }
  }
} as const;

export type Token = typeof token;

export const typographyStyle: Record<string, CSSProperties> = {
  H0: { fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "30px", lineHeight: 1, letterSpacing: "0px" },
  H1: { fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "22px", lineHeight: 1, letterSpacing: "0px" },
  H2: { fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "18px", lineHeight: 1, letterSpacing: "0px" },
  H3: { fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "16px", lineHeight: 1, letterSpacing: "0px" },
  H4: { fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "14px", lineHeight: 1, letterSpacing: "0px" },
  H5: { fontFamily: "Nunito, sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: 1, letterSpacing: "0px" },
  H6: { fontFamily: "Nunito, sans-serif", fontWeight: 400, fontSize: "12px", lineHeight: 1, letterSpacing: "0px" },
  N1: { fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "36px", lineHeight: 1, letterSpacing: "0px" },
  N2: { fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "24px", lineHeight: 1, letterSpacing: "0px" },
  N3: { fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "14px", lineHeight: 1, letterSpacing: "0px" },
  N4: { fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: 1, letterSpacing: "0px" },
};

export const shadowValue: Record<string, string> = {
  xs: "0px 1px 2px 0px #0000000d",
  s: "0px 4px 4px 0px #00000008",
  md: "0px 4px 15px 0px #0000001a, 0px 4px 4px 0px #0000000d",
  xl: "0px 100px 80px 0px #00000012, 0px 64.815px 46.852px 0px #0000000d, 0px 38.519px 25.481px 0px #0000000a, 0px 20px 13px 0px #0000000a, 0px 8.148px 6.519px 0px #00000008, 0px 1.852px 3.148px 0px #00000005",
  ne: "0px 10px 50px 0px #f26e252e",
};
