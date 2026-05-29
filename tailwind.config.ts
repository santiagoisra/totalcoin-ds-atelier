// AUTO-GENERATED from tokens/source/*.tokens.json — do NOT edit by hand.
// To regenerate: npm run tokens:generate
// To add/change fontFamily or content globs, edit tailwind.static.ts instead.

import type { Config } from "tailwindcss";

export default {
  content: ["./components/**/*.{ts,tsx}","./playground/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
              primary: {
                "50": "var(--color-primary-50, #ebeef3)",
                "100": "var(--color-primary-100, #b0c3d3)",
                "200": "var(--color-primary-200, #8aa6bd)",
                "300": "var(--color-primary-300, #547e9f)",
                "400": "var(--color-primary-400, #33658d)",
                "500": "var(--color-primary-500, #003e70)",
                "600": "var(--color-primary-600, #003866)",
                "700": "var(--color-primary-700, #002c50)",
                "800": "var(--color-primary-800, #00223e)",
                "900": "var(--color-primary-900, #001a2f)"
              },
              neutral: {
                "50": "var(--color-neutral-50, #f3f3f3)",
                "100": "var(--color-neutral-100, #d8d8d8)",
                "200": "var(--color-neutral-200, #c6c6c6)",
                "300": "var(--color-neutral-300, #ababab)",
                "400": "var(--color-neutral-400, #9b9b9b)",
                "500": "var(--color-neutral-500, #828282)",
                "600": "var(--color-neutral-600, #767676)",
                "700": "var(--color-neutral-700, #5c5c5c)",
                "800": "var(--color-neutral-800, #484848)",
                "900": "var(--color-neutral-900, #373737)"
              },
              secondary: {
                "50": "var(--color-secondary-50, #fef2ec)",
                "100": "var(--color-secondary-100, #fce2d3)",
                "200": "var(--color-secondary-200, #fac5a8)",
                "300": "var(--color-secondary-300, #f7a87c)",
                "400": "var(--color-secondary-400, #f58b51)",
                "500": "var(--color-secondary-500, #f26e25)",
                "600": "var(--color-secondary-600, #e55a0e)",
                "700": "var(--color-secondary-700, #c34d0c)",
                "800": "var(--color-secondary-800, #a13f0a)",
                "900": "var(--color-secondary-900, #7f3208)"
              },
              green: {
                "50": "var(--color-green-50, #e6f5ed)",
                "100": "var(--color-green-100, #b0dfc8)",
                "200": "var(--color-green-200, #8acfae)",
                "300": "var(--color-green-300, #54b988)",
                "400": "var(--color-green-400, #33ac71)",
                "500": "var(--color-green-500, #00974e)",
                "600": "var(--color-green-600, #008947)",
                "700": "var(--color-green-700, #006b37)",
                "800": "var(--color-green-800, #00532b)",
                "900": "var(--color-green-900, #003f21)"
              },
              red: {
                "50": "var(--color-red-50, #ffebea)",
                "100": "var(--color-red-100, #ffc2bf)",
                "200": "var(--color-red-200, #ffa4a0)",
                "300": "var(--color-red-300, #ff7b74)",
                "400": "var(--color-red-400, #ff6159)",
                "500": "var(--color-red-500, #ff3a30)",
                "600": "var(--color-red-600, #e8352c)",
                "700": "var(--color-red-700, #b52922)",
                "800": "var(--color-red-800, #8c201a)",
                "900": "var(--color-red-900, #6b1814)"
              },
              feedback: {
                "verde-confirmado": "var(--feedback-verde-confirmado, #00974e)",
                naranja: "var(--feedback-naranja, #f26e25)",
                error: "var(--feedback-error, #ff3b30)",
                deshabilitado: "var(--feedback-deshabilitado, #d8e6ff)",
                success: "var(--feedback-success, #00974e)"
              },
              brand: {
                primary: "var(--brand-primary, #003e70)",
                "primary-dark": "var(--brand-primary-dark, #002c50)",
                "primary-hover": "var(--brand-primary-hover, #002c50)",
                "primary-light": "var(--brand-primary-light, #b0c3d3)",
                "primary-subtle": "var(--brand-primary-subtle, #ebeef3)",
                secondary: "var(--brand-secondary, #f26e25)",
                "primary-2": "var(--brand-primary-2, #42689f)"
              },
              text: {
                primary: "var(--text-primary, #333333)",
                secondary: "var(--text-secondary, #828282)",
                tertiary: "var(--text-tertiary, #bdbdbd)",
                disabled: "var(--text-disabled, #bdbdbd)",
                brand: "var(--text-brand, #002c50)",
                "on-primary": "var(--text-on-primary, #f2f2f2)"
              },
              icon: {
                primary: "var(--icon-primary, #4f4f4f)"
              },
              bg: {
                app: "var(--bg-app, #ebeef3)",
                "app-secondary": "var(--bg-app-secondary, #ffffff)",
                surface: "var(--bg-surface, #f9f9f9)",
                button: "var(--bg-button, #fefefe)",
                input: "var(--bg-input, #f2f2f2)",
                disabled: "var(--bg-disabled, #e0e0e0)"
              },
              border: {
                default: "var(--border-default, #e0e0e0)"
              },
              focus: {
                ring: "var(--focus-ring, #cbd5e1)",
                ringError: "var(--focus-ring-error, #fca5a5)"
              }
            },
      fontFamily: {
        heading: ["Nunito","sans-serif"],
        number: ["Montserrat","sans-serif"],
        body: ["Inter","sans-serif"],
      },
      fontSize: {
              "ds-xs": ["12px", { lineHeight: "1" }],
              "ds-sm": ["14px", { lineHeight: "1" }],
              "ds-md": ["16px", { lineHeight: "1" }],
              "ds-lg": ["18px", { lineHeight: "1" }],
              "ds-xl": ["22px", { lineHeight: "1" }],
              "ds-2xl": ["24px", { lineHeight: "1" }],
              "ds-3xl": ["30px", { lineHeight: "1" }],
              "ds-4xl": ["36px", { lineHeight: "1" }]
            },
      spacing: {
              "ds-xs": "4px",
              "ds-s": "8px",
              "ds-md": "12px",
              "ds-l": "16px",
              "ds-xl": "24px",
              "ds-xxl": "36px"
            },
      borderRadius: {
              "ds-xs": "4px",
              "ds-s": "8px",
              "ds-md": "12px",
              "ds-l": "16px"
            },
      boxShadow: {
              "ds-xs": "0px 1px 2px 0px #0000000d",
              "ds-s": "0px 1px 3px 0px #0000001a, 0px 1px 2px -1px #0000001a",
              "ds-md": "0px 4px 6px -1px #0000001a, 0px 2px 4px -2px #0000001a",
              "ds-lg": "0px 10px 15px -3px #0000001a, 0px 4px 6px -4px #0000001a",
              "ds-xl": "0px 25px 50px -12px #00000040",
              "ds-brand": "0px 10px 50px 0px #f26e252e"
            },
    },
  },
} satisfies Config;
