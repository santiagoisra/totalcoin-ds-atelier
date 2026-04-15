import type { CSSProperties } from "react";
import { token } from "../tokens.ts";

export interface ProgresoProps {
  /** Valor 0-100. Se clampea al rango. */
  value: number;
  /** Color del fill. Default brand.primary. */
  color?: CSSProperties["color"];
  /** Alto en px. Default 8. */
  height?: number;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Molecula / Progreso.
 *
 * Figma: master `47239:1101`. Barra horizontal con fill lineal.
 * - Track: `border.default` (#e0e0e0)
 * - Fill: `brand.primary` por default, override con `color` prop
 * - Radius: `radius.md` (12px) — las puntas del fill heredan el radius del track
 */
export function Progreso({
  value,
  color,
  height = 8,
  ariaLabel = "Progreso",
  className,
  style,
}: ProgresoProps): JSX.Element {
  const clamped = Math.max(0, Math.min(100, value));
  const fillColor = color ?? token.brand.primary;

  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={className}
      style={{
        width: "100%",
        height,
        background: token.border.default,
        borderRadius: token.radius.md,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: "100%",
          background: fillColor,
          transition: "width 240ms ease",
        }}
      />
    </div>
  );
}
