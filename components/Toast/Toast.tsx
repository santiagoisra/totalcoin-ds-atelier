import type { CSSProperties, ReactNode } from "react";
import { token } from "../tokens.ts";
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
 * Fondo #fefefe (token.bg.button).
 * Botón Cancelar: fondo #fefefe, borde #bdbdbd, texto #4f4f4f.
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
        gap: 7,
        width: "100%",
        maxWidth: 580,
        padding: "24px 36px",
        background: "#fefefe",
        borderRadius: 12,
        boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)",
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
      <div style={{ display: "flex", flexDirection: "column", gap: 7, paddingBottom: 16 }}>
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
          }}
        >
          {actions.cancel && (
            <button
              type="button"
              onClick={actions.cancel.onClick}
              style={{
                appearance: "none",
                boxSizing: "border-box",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                height: 45,
                paddingInline: 10,
                paddingBlock: 0,
                fontFamily: "Nunito, sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: 1,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#bdbdbd",
                background: "#fefefe",
                color: "#4f4f4f",
                borderRadius: 8,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {actions.cancel.label}
            </button>
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
