import type { CSSProperties, ReactNode } from "react";
import { token } from "../tokens.ts";

export type AlertColor = "warning" | "success" | "error" | "info";

export interface AlertaProps {
  /**
   * Variante semantica. Mapeo desde Figma `color`:
   *   Naranja -> warning, Verde -> success, Rojo -> error, Azul -> info.
   */
  color?: AlertColor;
  /** Cuerpo de la alerta. */
  children: ReactNode;
  /** Si false, no se renderiza icono izquierdo. Default true. */
  showLeftIcon?: boolean;
  /** Icono izquierdo custom. Si undefined & showLeftIcon=true, se usa AlertTriangle default. */
  leftIcon?: ReactNode;
  /** Icono derecho (ej. chevron hacia accion). */
  rightIcon?: ReactNode;
  /** Label textual a la derecha (ej. "Solicitar"). */
  rightLabel?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const STRIP_COLOR: Record<AlertColor, string> = {
  warning: token.brand.secondary,
  success: token.feedback.success,
  error: token.feedback.error,
  info: token.brand.primary,
};

function DefaultAlertIcon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <circle cx="12" cy="17" r="0.5" fill={color} />
    </svg>
  );
}

/**
 * Molecula / Alerta.
 *
 * Figma: master `4041:21616` (showcase de 20+ variantes segun color + iconos).
 *
 * Layout: strip vertical coloreado a la izquierda (9px) + contenido con icono
 * izquierdo opcional + texto + trailing content opcional (icono o label).
 *
 * Decisiones:
 * - Figma renderiza el strip como imagen PNG coloreada — code-side lo hace con
 *   un `<div>` con background-color del token. Identico visual, zero assets.
 * - El icono izquierdo default es un AlertTriangle. Para suprimirlo, pasar
 *   `leftIcon={null}`. Para custom, pasar cualquier ReactNode.
 * - Font: Nunito Medium 14, color matcheando el strip (cohesion visual).
 */
export function Alerta({
  color = "warning",
  children,
  showLeftIcon = true,
  leftIcon,
  rightIcon,
  rightLabel,
  className,
  style,
}: AlertaProps): JSX.Element {
  const stripColor = STRIP_COLOR[color];
  const hasRight = rightIcon || rightLabel;

  return (
    <div
      role="alert"
      className={className}
      style={{
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        maxWidth: 361,
        background: token.bg.button,
        border: `${token.borderWidth.default} solid ${token.border.default}`,
        borderRadius: token.radius.s,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 9,
          flexShrink: 0,
          background: stripColor,
          margin: "-1px 0 -1px -1px",
          borderTopLeftRadius: token.radius.s,
          borderBottomLeftRadius: token.radius.s,
        }}
      />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: `10px ${token.size.md} 10px ${token.size.md}`,
        }}
      >
        {showLeftIcon && (
          <span aria-hidden="true" style={{ display: "inline-flex", width: 24, height: 24, color: stripColor, flexShrink: 0 }}>
            {leftIcon ?? <DefaultAlertIcon color={stripColor} />}
          </span>
        )}
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: "Nunito, sans-serif",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: 1.3,
            color: stripColor,
          }}
        >
          {children}
        </span>
        {hasRight && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: token.size.xs,
              color: stripColor,
              fontFamily: "Nunito, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {rightLabel}
            {rightIcon && (
              <span aria-hidden="true" style={{ display: "inline-flex", width: 24, height: 24 }}>
                {rightIcon}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
