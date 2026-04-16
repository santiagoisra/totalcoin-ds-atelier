import type { CSSProperties } from "react";
import { PHOSPHOR_ICONS, type PhosphorIconName } from "./phosphor-map.ts";
import { FIGMA_ICONS, type FigmaIconName } from "./figma-icons.ts";

export type IconName = PhosphorIconName | FigmaIconName;

export interface IconProps {
  /** Nombre del icono. Union de Phosphor (genericos) y FIGMA_ICONS (dominio TotalCoin). */
  name: IconName;
  /** Tamanio en px. Default 24. */
  size?: number;
  /** Color (via currentColor). Default: inherit. */
  color?: CSSProperties["color"];
  /**
   * Weight de Phosphor. Default "regular" — matchea el stroke 1.5 del DS.
   * Ignorado para iconos Figma custom (tienen stroke fijo 1.5).
   */
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

/**
 * Meta-componente para el icon system.
 *
 * Dos fuentes:
 * 1. **Phosphor** (`@phosphor-icons/react`) para iconos genericos — check, close,
 *    arrow-*, heart, user, house, etc. Tree-shaken, 58 actualmente mapeados.
 * 2. **Figma-extracted** (`figma-icons.ts`) para dominio-especifico de TotalCoin —
 *    money-in, loan, credit-adjust, arrows-transfer-*, hand-totalcoin, pay-button.
 *    SVGs inline extraidos via MCP desde el DS en Figma (file y3zmw...).
 *
 * El color se hereda via `currentColor` — util dentro de botones/links sin override.
 */
export function Icon({
  name,
  size = 24,
  color,
  weight = "regular",
  className,
  style,
  ...rest
}: IconProps): JSX.Element {
  const wrapStyle: CSSProperties = {
    color,
    display: "inline-block",
    flexShrink: 0,
    ...style,
  };

  // 1. Try Phosphor
  const PhosphorIcon = PHOSPHOR_ICONS[name as PhosphorIconName];
  if (PhosphorIcon) {
    return (
      <PhosphorIcon
        size={size}
        weight={weight}
        className={className}
        style={wrapStyle}
        aria-label={rest["aria-label"]}
        aria-hidden={rest["aria-label"] ? undefined : true}
      />
    );
  }

  // 2. Try Figma-extracted SVG
  const inner = FIGMA_ICONS[name as FigmaIconName];
  if (inner) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        className={className}
        style={wrapStyle}
        aria-label={rest["aria-label"]}
        aria-hidden={rest["aria-label"] ? undefined : true}
        role={rest["aria-label"] ? "img" : undefined}
        dangerouslySetInnerHTML={{ __html: inner }}
      />
    );
  }

  // 3. Unknown name — render empty box (visible in dev) + console warn
  if (typeof console !== "undefined") {
    console.warn(`[Icon] Unknown icon name: "${name}"`);
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={wrapStyle}
    >
      <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2,2" />
    </svg>
  );
}
