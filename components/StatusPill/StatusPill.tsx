import type { CSSProperties, ReactNode } from "react";
import { token } from "../tokens.ts";

export type Criticality = "low" | "medium" | "high" | "neutral";

export interface StatusPillProps {
  /**
   * Nivel de criticidad. Determina los colores bg/text.
   * Mapeo desde Figma `criticidad`:
   * - `Baja`   -> `low`     (verde)
   * - `Media`  -> `medium`  (naranja)
   * - `Alta`   -> `high`    (rojo)
   * - `Neutra` -> `neutral` (azul brand)
   */
  level: Criticality;
  /** Label del pill. Ej: "Bajo", "Medio", "Crítico", "Neutro". */
  children: ReactNode;
  /** Icono opcional (a la derecha). 16x16 recomendado. */
  icon?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

interface PillPalette {
  bg: string;
  fg: string;
}

const palette: Record<Criticality, PillPalette> = {
  low:     { bg: `color-mix(in srgb, ${token.feedback.success} 15%, white)`, fg: token.feedback.success },
  medium:  { bg: token.Brand.colorSecondary50,                                fg: token.Brand.colorSecondary500 },
  high:    { bg: `color-mix(in srgb, ${token.feedback.error} 15%, white)`,   fg: token.feedback.error },
  neutral: { bg: token.Brand.colorPrimary50,                                  fg: token.brand.primary },
};

/**
 * Atomo / Status Pill.
 *
 * Figma: master `47635:1276`. 4 criticidades x 2 (con/sin icono) = 8 variantes.
 *
 * Los colores usan tokens semánticos del DS Semantic Layer:
 * - low   → feedback.success  (confirm, verde)
 * - medium → brand.secondary  (naranja, con escala 50/500)
 * - high  → feedback.error    (error, rojo)
 * - neutral → brand.primary   (azul, con escala 50/500)
 */
export function StatusPill({
  level,
  children,
  icon,
  className,
  style,
}: StatusPillProps): JSX.Element {
  const { bg, fg } = palette[level];

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingInline: token.size.md,
        paddingBlock: 6,
        borderRadius: 9999,
        background: bg,
        color: fg,
        fontFamily: "Nunito, sans-serif",
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span>{children}</span>
      {icon && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            width: 16,
            height: 16,
            color: fg,
          }}
        >
          {icon}
        </span>
      )}
    </span>
  );
}
