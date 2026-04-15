import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "totalcoin-ds-theme";

function getInitial(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

/**
 * ThemeProvider — aplica `data-theme="light|dark"` al <html> + publica contexto.
 *
 * El DS de TotalCoin tiene tokens `Dark/*` (Dark/color-realce, Dark/color-surface,
 * Dark/color-bg-primario, Dark/color-bg-secondary, Dark/color-text-primary,
 * Dark/color-text-secondary) que aun NO estan en nuestros DTCG. Cuando se
 * agreguen, un ThemeProvider + data-theme sobreescribe las CSS variables con
 * los values dark sin tocar el codigo de los componentes.
 *
 * Por ahora este provider solo trackea el estado — la aplicacion visual de dark
 * mode requiere extender los tokens + agregar un stylesheet con las
 * sobreescrituras de CSS vars en [data-theme="dark"].
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitial);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore storage failures (incognito, etc.)
    }
  }, [theme]);

  const value: ThemeContextValue = {
    theme,
    setTheme: setThemeState,
    toggle: () => setThemeState((t) => (t === "light" ? "dark" : "light")),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
