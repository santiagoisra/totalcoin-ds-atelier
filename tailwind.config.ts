/**
 * Tailwind config con tokens del DS de TotalCoin.
 *
 * Este archivo declara los tokens como theme tokens de Tailwind para que los
 * consumidores puedan usar `bg-brand-primary` en vez de `bg-[#003e70]`.
 *
 * AUTO-GENERADO-PARCIAL: los values los manejamos a mano por ahora. Cuando el
 * catalogo crezca, extender `scripts/generate-tokens.ts` para emitir tambien
 * este archivo desde los DTCG.
 *
 * Uso en un consumer project:
 *   import tokensConfig from "@totalcoin/ds/tailwind.config";
 *   export default { ...tokensConfig, content: [...] };
 */

import type { Config } from "tailwindcss";

export default {
  content: ["./components/**/*.{ts,tsx}", "./playground/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primitivos
        primary: {
          50: "#ebeef3", 100: "#b0c3d3", 200: "#8aa6bd", 300: "#547e9f",
          400: "#33658d", 500: "#003e70", 600: "#003866", 700: "#002c50",
          800: "#00223e", 900: "#001a2f",
        },
        neutral: {
          50: "#f3f3f3", 100: "#d8d8d8", 200: "#c6c6c6", 300: "#ababab",
          400: "#9b9b9b", 500: "#828282", 600: "#767676", 700: "#5c5c5c",
          800: "#484848", 900: "#373737",
        },
        secondary: {
          50: "#fef2ec", 100: "#fbd7c3", 200: "#f9c3a6", 300: "#f7a87d",
          400: "#f59764", 500: "#f37d3d", 600: "#dd7238", 700: "#ad592b",
          800: "#864522", 900: "#66351a",
        },
        green: {
          50: "#e6f5ed", 100: "#b0dfc8", 200: "#8acfae", 300: "#54b988",
          400: "#33ac71", 500: "#00974e", 600: "#008947", 700: "#006b37",
          800: "#00532b", 900: "#003f21",
        },
        red: {
          50: "#ffebea", 100: "#ffc2bf", 200: "#ffa4a0", 300: "#ff7b74",
          400: "#ff6159", 500: "#ff3a30", 600: "#e8352c", 700: "#b52922",
          800: "#8c201a", 900: "#6b1814",
        },

        // Semantic — usan CSS vars para que dark mode funcione
        brand: {
          primary: "var(--brand-primary, #003e70)",
          "primary-dark": "var(--brand-primary-dark, #002c50)",
          "primary-hover": "var(--brand-primary-hover, #002c50)",
          "primary-light": "var(--brand-primary-light, #b0c3d3)",
          "primary-subtle": "var(--brand-primary-subtle, #ebeef3)",
          secondary: "var(--brand-secondary, #f26e25)",
        },
        text: {
          primary: "var(--text-primary, #333333)",
          secondary: "var(--text-secondary, #828282)",
          tertiary: "var(--text-tertiary, #bdbdbd)",
          disabled: "var(--text-disabled, #bdbdbd)",
          brand: "var(--text-brand, #002c50)",
          "on-primary": "var(--text-on-primary, #f2f2f2)",
        },
        bg: {
          app: "var(--bg-app, #ebeef3)",
          "app-secondary": "var(--bg-app-secondary, #ffffff)",
          surface: "var(--bg-surface, #f9f9f9)",
          button: "var(--bg-button, #fefefe)",
          input: "var(--bg-input, #f2f2f2)",
          disabled: "var(--bg-disabled, #e0e0e0)",
        },
        border: {
          DEFAULT: "var(--border-default, #e0e0e0)",
        },
        feedback: {
          success: "var(--feedback-success, #00974e)",
          error: "var(--feedback-error, #ff3b30)",
        },
        focus: {
          ring: "var(--focus-ring, #cbd5e1)",
          "ring-error": "var(--focus-ring-error, #fca5a5)",
        },
      },

      fontFamily: {
        heading: ["Nunito", "sans-serif"],
        number: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },

      fontSize: {
        // Matchea los tokens DTCG typography.fontSize.*
        "ds-xs": ["12px", { lineHeight: "1" }],
        "ds-sm": ["14px", { lineHeight: "1" }],
        "ds-md": ["16px", { lineHeight: "1" }],
        "ds-lg": ["18px", { lineHeight: "1" }],
        "ds-xl": ["22px", { lineHeight: "1" }],
        "ds-2xl": ["24px", { lineHeight: "1" }],
        "ds-3xl": ["30px", { lineHeight: "1" }],
        "ds-4xl": ["36px", { lineHeight: "1" }],
      },

      spacing: {
        // Primitivos — el scale DTCG size.*
        "ds-xs": "4px",
        "ds-s": "8px",
        "ds-md": "12px",
        "ds-l": "16px",
        "ds-xl": "24px",
        "ds-xxl": "36px",
      },

      borderRadius: {
        "ds-xs": "4px",
        "ds-s": "8px",
        "ds-md": "12px",
        "ds-l": "16px",
      },

      boxShadow: {
        "ds-xs": "0 1px 2px rgba(0, 0, 0, 0.05)",
        "ds-s": "0 4px 4px rgba(0, 0, 0, 0.05)",
        "ds-md": "0 4px 15px rgba(0, 0, 0, 0.1), 0 4px 4px rgba(0, 0, 0, 0.05)",
        "ds-ne": "0 10px 50px rgba(242, 110, 37, 0.18)",
      },
    },
  },
} satisfies Config;
