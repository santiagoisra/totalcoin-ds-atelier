import type { CSSProperties, ReactNode } from "react";
import { token } from "../tokens.ts";

export type TooltipArrow = "top" | "bottom" | "none";
export type TooltipArrowAlign = "start" | "center" | "end";

export interface TooltipProps {
  children: ReactNode;
  /** Posicion de la flecha. Default `bottom` (arrow abajo = tooltip aparece arriba del target). */
  arrow?: TooltipArrow;
  /** Alineacion de la flecha dentro del tooltip. */
  arrowAlign?: TooltipArrowAlign;
  className?: string;
  style?: CSSProperties;
}

/**
 * Molecula / Tooltip simple.
 *
 * Figma: master `17647:46074` (variantes Derecha/Izquierda). En Figma la flecha
 * es imagen; en codigo se dibuja con borders triangulares CSS (cero assets).
 *
 * Componente "dumb" — solo la burbuja. El posicionamiento y show/hide on hover
 * lo maneja el consumidor con CSS, Floating UI, o Radix Tooltip. Esto mantiene
 * el DS agnostico al runtime de positioning.
 */
export function Tooltip({
  children,
  arrow = "bottom",
  arrowAlign = "center",
  className,
  style,
}: TooltipProps): JSX.Element {
  return (
    <div
      role="tooltip"
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        padding: `${token.size.s} ${token.size.l}`,
        background: token.icon.primary,
        color: token.bg.input,
        fontFamily: "Nunito, sans-serif",
        fontWeight: 400,
        fontSize: "12px",
        lineHeight: 1.2,
        borderRadius: token.radius.s,
        ...style,
      }}
    >
      {children}
      {arrow !== "none" && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            ...(arrow === "bottom"
              ? {
                  top: "100%",
                  borderTop: `7px solid ${token.icon.primary}`,
                }
              : {
                  bottom: "100%",
                  borderBottom: `7px solid ${token.icon.primary}`,
                }),
            ...(arrowAlign === "start"
              ? { left: 12 }
              : arrowAlign === "end"
                ? { right: 12 }
                : { left: "50%", transform: "translateX(-50%)" }),
          }}
        />
      )}
    </div>
  );
}
