import type { CSSProperties, ReactNode } from "react";
import { token, shadowValue } from "../tokens.ts";
import { ButtonStandard } from "../ButtonStandard/ButtonStandard.tsx";
import { Icon } from "../Icon/Icon.tsx";

export interface ToastAction {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "danger";
}

export interface ToastProps {
  /** Título del aviso. */
  title: ReactNode;
  /** Descripción o mensaje del aviso. */
  description: ReactNode;
  /** Callback al clickear el ícono de cerrar (X). Si no se provee, no se muestra. */
  onClose?: () => void;
  /** Acciones opcionales: cancelar y confirmar. */
  actions?: {
    cancel?: ToastAction;
    confirm?: ToastAction;
  };
  className?: string;
  style?: CSSProperties;
}

/**
 * Organismo / Toast (Aviso).
 *
 * Figma: master `46552:1093`. Dos variantes:
 * - Con botones (actions): muestra Cancelar + Confirmar
 * - Sin botones: solo título, descripción y X de cerrar
 *
 * Contenedor con shadow doble + border-radius 12px + padding 24px 36px.
 * Posicionamiento: normalmente se usa dentro de un fixed/absolute wrapper
 * centrado o anclado (toast overlay).
 */
export function Toast({
  title,
  description,
  onClose,
  actions,
  className,
  style,
}: ToastProps): JSX.Element {
  const hasActions = actions?.cancel || actions?.confirm;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "100%",
        maxWidth: 580,
        padding: "24px 36px",
        background: token.bg.surface,
        borderRadius: token.radius.l,
        boxShadow: `${shadowValue.s}, 0px 10px 15px -3px rgba(0,0,0,0.1)`,
        ...style,
      }}
    >
      {/* Close icon */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            padding: 0,
            background: "transparent",
            border: "none",
            borderRadius: token.radius.s,
            cursor: "pointer",
            color: token.text.primary,
            transition: "background-color 100ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = token.bg.input;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <Icon name="x" size={20} />
        </button>
      )}

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <h3
          style={{
            margin: 0,
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
            fontSize: "18px",
            lineHeight: 1.4,
            color: token.text.primary,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            margin: 0,
            fontFamily: "Nunito, sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: 1.4,
            color: token.text.secondary,
          }}
        >
          {description}
        </p>
      </div>

      {/* Actions */}
      {hasActions && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 8,
          }}
        >
          {actions.cancel && (
            <ButtonStandard
              variant="outline"
              onClick={actions.cancel.onClick}
            >
              {actions.cancel.label}
            </ButtonStandard>
          )}
          {actions.confirm && (
            <ButtonStandard
              variant={actions.confirm.variant ?? "primary"}
              onClick={actions.confirm.onClick}
            >
              {actions.confirm.label}
            </ButtonStandard>
          )}
        </div>
      )}
    </div>
  );
}
