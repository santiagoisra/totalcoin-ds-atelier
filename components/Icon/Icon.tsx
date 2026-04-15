import type { CSSProperties, SVGProps } from "react";
import { ICON_PATHS, type IconName } from "./icons.ts";

export type { IconName };

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  /** Nombre del icono del catalogo. */
  name: IconName;
  /** Tamaño en px. Default 24. Aplica a width + height. */
  size?: number;
  /** Color (via currentColor). Default inherited. */
  color?: CSSProperties["color"];
  /** Grosor del stroke. Default 2. */
  strokeWidth?: number;
}

/**
 * Meta-componente para el icon system.
 *
 * Figma: el DS tiene ~175 iconos (ver inventario en
 * `totalcoin/design-system/inventory`). Este componente renderiza paths
 * inline para los ~28 mas usados; extenderlo agregando entradas a
 * `components/Icon/icons.ts`.
 *
 * Uso: `<Icon name="check" size={24} color={token.brand.primary} />`
 *
 * `currentColor` hace que el icono herede el color del parent — facilita
 * uso dentro de botones/links sin override manual.
 */
export function Icon({
  name,
  size = 24,
  color,
  strokeWidth = 2,
  style,
  ...rest
}: IconProps): JSX.Element {
  const d = ICON_PATHS[name];

  return (
    <svg
      {...rest}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color, display: "inline-block", flexShrink: 0, ...style }}
      aria-hidden={rest["aria-label"] ? undefined : true}
      role={rest["aria-label"] ? "img" : undefined}
    >
      <path d={d} />
    </svg>
  );
}
