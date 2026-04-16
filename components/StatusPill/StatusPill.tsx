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
  low:     { bg: token.color.green[50],     fg: token.color.green[500] },
  medium:  { bg: token.color.secondary[50], fg: token.color.secondary[500] },
  high:    { bg: token.color.red[50],       fg: token.color.red[500] },
  neutral: { bg: token.color.primary[50],   fg: token.brand.primary },
};

/**
 * Atomo / Status Pill.
 *
 * Figma: master `47635:1276`. 4 criticidades x 2 (con/sin icono) = 8 variantes.
 *
 * Los colores de cada criticidad mapean a primitivos del DS (green/secondary/
 * red/primary scales). Se uso `color.*.50` y `color.*.500` en vez de layers
 * semantic porque el DS no expone tokens semantic especificos para "status
 * pill" — los pills usan las primitivas directo.
 *
 * Drift notado: el Pill Neutra en Figma tiene bg `#e6ecf1` (style legacy
 * "Color-primary / color-primary-50") mientras que color-primary-50 como
 * variable es `#ebeef3`. Aca usamos el canonico `color.primary.50`.
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
