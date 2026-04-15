import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { token, shadowValue } from "../tokens.ts";

export interface ModalProps {
  /** Controla visibilidad. */
  open: boolean;
  /** Callback al cerrar (click backdrop, ESC, boton X). */
  onClose: () => void;
  /** Titulo en el header. */
  title?: ReactNode;
  /** Si true muestra el boton X. Default true. */
  showClose?: boolean;
  /** Content body del modal. */
  children: ReactNode;
  /** Footer con acciones (tipicamente botones). */
  footer?: ReactNode;
  /** Ancho del modal en px o CSS length. Default 401 (match Figma). */
  width?: number | string;
  /** Si false no renderiza el backdrop oscuro. Default true. */
  backdrop?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Organismo / Modal con header.
 *
 * Figma: master `47279:1608`. Overlay + card con header (titulo + cerrar) +
 * body + footer (botones).
 *
 * - Se renderiza via React Portal en document.body.
 * - ESC cierra. Click en backdrop cierra.
 * - Trapea focus? — NO por ahora. Agregar focus-trap-react cuando sea
 *   necesario para forms accesibles complejos.
 */
export function Modal({
  open,
  onClose,
  title,
  showClose = true,
  children,
  footer,
  width = 401,
  backdrop = true,
  className,
  style,
}: ModalProps): JSX.Element | null {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const content = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: token.size.l,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && backdrop) onClose();
      }}
    >
      {backdrop && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
          }}
        />
      )}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
        className={className}
        style={{
          position: "relative",
          width,
          maxWidth: "100%",
          maxHeight: "100%",
          display: "flex",
          flexDirection: "column",
          background: token.bg.button,
          borderRadius: token.radius.s,
          boxShadow: shadowValue.s,
          overflow: "hidden",
          ...style,
        }}
      >
        {(title || showClose) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: token.bg.input,
              borderBottom: `${token.borderWidth.default} solid ${token.border.default}`,
              padding: "20px 25px",
            }}
          >
            <div id="modal-title" style={{ flex: 1, textAlign: "center" }}>
              <span
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 700,
                  fontSize: "22px",
                  lineHeight: 1,
                  color: "#001944",
                }}
              >
                {title}
              </span>
            </div>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                style={{
                  width: 24,
                  height: 24,
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: token.icon.primary,
                  flexShrink: 0,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div style={{ flex: 1, padding: "30px 30px 20px", overflowY: "auto" }}>
          {children}
        </div>

        {footer && (
          <div
            style={{
              display: "flex",
              gap: 15,
              padding: "0 30px 30px",
              justifyContent: "center",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
