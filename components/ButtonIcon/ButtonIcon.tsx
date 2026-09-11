import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { token } from "../tokens.ts";
import { Icon } from "../Icon/Icon.tsx";

export interface ButtonIconProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
  /**
   * Icono del boton (slot 24x24). Mapea a la instancia swappeable del master
   * en Figma. Default: `edit-square` (Figma "Icon / Edit1"), igual que el master.
   */
  icon?: ReactNode;
  /**
   * Label accesible. Obligatorio: el boton no tiene texto visible, sin esto
   * un lector de pantalla solo anuncia "boton".
   */
  "aria-label": string;
  /** HTML button type. Default "button" (evita submit accidental). */
  type?: "button" | "submit" | "reset";
}

/**
 * Molecula / Boton Unico Simple.
 *
 * Figma: master `46290:673`. Boton cuadrado solo-icono, 44x44:
 * - bg: `bg/app-secondary` (#ebeef3)
 * - radius: `MD` (12px)
 * - padding: 10px literal en Figma (sin token) — da exactamente 44x44 con icono de 24
 * - icono: stroke `brand/primary` (#003e70), heredado via currentColor
 *
 * Sin variantes en Figma. `disabled` solo cambia el cursor: no hay estado
 * deshabilitado disenado, no se inventa uno.
 */
export function ButtonIcon({
  icon,
  type = "button",
  disabled = false,
  style,
  ...rest
}: ButtonIconProps): JSX.Element {
  const baseStyle: CSSProperties = {
    appearance: "none",
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: 44,
    height: 44,
    padding: 10,
    border: "none",
    borderRadius: token.radius.md,
    background: token.bg.appSecondary,
    color: token.brand.primary,
    cursor: disabled ? "not-allowed" : "pointer",
    ...style,
  };

  return (
    <button {...rest} type={type} disabled={disabled} style={baseStyle}>
      <span
        aria-hidden="true"
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24 }}
      >
        {icon ?? <Icon name="edit-square" size={24} />}
      </span>
    </button>
  );
}
