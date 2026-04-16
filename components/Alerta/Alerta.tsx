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
  /** Label textual a la derecha (ej. "Solicitar"). Se renderiza underlined + bold (tipo link/accion). */
  rightLabel?: ReactNode;
  /** Callback opcional — si esta definido, el rightLabel se renderiza como boton clickeable. */
  onRightAction?: () => void;
  /**
   * Si esta definido, TODA la card es clickeable. Variante "card-as-link":
   * auto-agrega chevron-right a la derecha, y el rightLabel (si existe) se
   * muestra sin underline/bold.
   */
  onClick?: () => void;
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

function ChevronRightIcon({ color }: { color: string }) {
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
      <path d="M9 18l6-6-6-6" />
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
  onRightAction,
  onClick,
  className,
  style,
}: AlertaProps): JSX.Element {
  const stripColor = STRIP_COLOR[color];
  // En variante card-as-link: auto-chevron. Sino: lo que pase el consumidor.
  const resolvedRightIcon = rightIcon ?? (onClick ? <ChevronRightIcon color={stripColor} /> : undefined);
  const hasRight = resolvedRightIcon || rightLabel;

  return (
    <div
      role={onClick ? "button" : "alert"}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      className={className}
      style={{
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        maxWidth: 361,
        background: stripColor,
        border: `${token.borderWidth.default} solid ${token.border.default}`,
        borderRadius: 12,
        padding: "1px 1px 1px 8px",
        cursor: onClick ? "pointer" : undefined,
        outline: "none",
        ...style,
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: `10px ${token.size.md}`,
          background: token.bg.button,
          border: `${token.borderWidth.default} solid ${token.border.default}`,
          borderRadius: 10,
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
        {hasRight && (() => {
          // Si es card-as-link (onClick), label normal + chevron. Sino, label underlined+bold (action).
          const labelStyle: CSSProperties = onClick
            ? {
                fontFamily: "Nunito, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: stripColor,
              }
            : {
                fontFamily: "Nunito, sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "underline",
                color: stripColor,
              };
          const wrapStyle: CSSProperties = {
            display: "inline-flex",
            alignItems: "center",
            gap: token.size.xs,
            whiteSpace: "nowrap",
            flexShrink: 0,
          };
          const LabelEl = onRightAction && !onClick ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRightAction(); }}
              style={{ ...labelStyle, background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
            >
              {rightLabel}
            </button>
          ) : (
            rightLabel && <span style={labelStyle}>{rightLabel}</span>
          );

          return (
            <span style={wrapStyle}>
              {LabelEl}
              {resolvedRightIcon && (
                <span aria-hidden="true" style={{ display: "inline-flex", width: 24, height: 24, color: stripColor }}>
                  {resolvedRightIcon}
                </span>
              )}
            </span>
          );
        })()}
      </div>
    </div>
  );
}
