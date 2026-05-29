/**
 * Static overrides for the generated tailwind.config.ts.
 *
 * This is the ONLY hand-edited Tailwind surface. Everything else in
 * tailwind.config.ts is AUTO-GENERATED from tokens/source/*.tokens.json.
 *
 * Edit this file when you need to change:
 *   - content glob patterns
 *   - fontFamily definitions (heading / number / body)
 *
 * After editing, run `npm run tokens:generate` to regenerate tailwind.config.ts.
 */

export const staticOverrides = {
  content: ["./components/**/*.{ts,tsx}", "./playground/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Nunito", "sans-serif"],
        number: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
} as const;
