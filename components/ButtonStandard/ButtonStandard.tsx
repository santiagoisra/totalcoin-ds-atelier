import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { token } from "../tokens.ts";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "tertiary"
  | "danger"
  | "danger-outline";

export type ButtonSize = "small" | "medium";
export type ButtonWidth = "auto" | "full";

export interface ButtonStandardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /**
   * Variante visual. Mapeo desde Figma `Estado`:
   *   Primario -> primary, Secundario -> secondary, Outline -> outline,
   *   Terciario -> tertiary, Danger -> danger, DangerOutline -> danger-outline.
   * Estado "Apretado" se expone via `pressed`, y "Deshabilitado" via `disabled`.
   */
  variant?: ButtonVariant;
  /** 45px (medium, default) o 40px (small). Mapea a Figma `tamano`. */
  size?: ButtonSize;
  /** `full` = width 100% (Figma "grande"), `auto` = natural (Figma "chico"). */
  width?: ButtonWidth;
  /** Si true, border-radius pill (Figma `borde redondeado = true`). */
  rounded?: boolean;
  /** Estado apretado forzado (toggle buttons, etc). Sin prop, :active css. */
  pressed?: boolean;
  /** Icono a la izquierda del label. */
  leftIcon?: ReactNode;
  /** Icono a la derecha del label. */
  rightIcon?: ReactNode;
  /** HTML button type. Default "button" (evita submit accidental). */
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
}

interface Palette {
  bg: string;
  fg: string;
  border: string;
  boxShadow?: string;
}

const DISABLED_PALETTE: Palette = {
  bg: token.border.default,
  fg: token.text.tertiary,
  border: token.border.default,
};

function getPalette(variant: ButtonVariant, pressed: boolean): Palette {
  // Pressed aplica solo a variantes con fill (primary, danger).
  // Para outline/tertiary, pressed podria oscurecer el fg — mantenemos simple.
  const primaryShadow = "0px 1px 3px rgba(0, 62, 112, 0.15)";
  const neutralShadow = "0px 1px 3px rgba(0, 0, 0, 0.15)";

  switch (variant) {
    case "primary":
      return {
        bg: pressed ? token.brand.primaryDark : token.brand.primary,
        fg: token.text.onPrimary,
        border: token.border.default,
        boxShadow: primaryShadow,
      };
    case "secondary":
      return {
        bg: token.bg.button,
        fg: token.brand.primary,
        border: token.brand.primary,
        boxShadow: neutralShadow,
      };
    case "outline":
      return {
        bg: "transparent",
        fg: token.brand.primary,
        border: token.brand.primary,
        boxShadow: neutralShadow,
      };
    case "tertiary":
      return {
        bg: "transparent",
        fg: token.brand.primary,
        border: "transparent",
      };
    case "danger":
      return {
        bg: token.feedback.error,
        fg: token.text.onPrimary,
        border: "transparent",
      };
    case "danger-outline":
      return {
        bg: "transparent",
        fg: token.feedback.error,
        border: token.feedback.error,
      };
  }
}

/**
 * Molecula / Boton Standard.
 *
 * Figma: master `3692:17510`. Sistema completo:
 * - 6 variantes visuales (primary, secondary, outline, tertiary, danger, danger-outline)
 * - 2 estados adicionales (pressed, disabled) que aplican sobre cualquier variante
 * - 2 sizes (small 40px, medium 45px)
 * - 2 widths (auto, full)
 * - borde redondeado opcional (pill shape)
 * - slots para leftIcon/rightIcon
 *
 * Fonts: Nunito Bold 14 (Figma text style `Brand/H4`).
 * Padding: 10px literal — Figma lo usa asi, NO corresponde a ningun token
 * del DS (scale tiene 8 y 12, no 10). TODO: alinear en Figma o agregar token
 * `size.button-padding` si el drift molesta.
 */
export function ButtonStandard({
  variant = "primary",
  size = "medium",
  width = "auto",
  rounded = false,
  pressed = false,
  disabled = false,
  leftIcon,
  rightIcon,
  type = "button",
  children,
  style,
  ...rest
}: ButtonStandardProps): JSX.Element {
  const palette = disabled ? DISABLED_PALETTE : getPalette(variant, pressed);
  const height = size === "small" ? 40 : 45;

  const baseStyle: CSSProperties = {
    appearance: "none",
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: token.size.s,
    height,
    paddingInline: 10,
    paddingBlock: 0,
    width: width === "full" ? "100%" : undefined,
    fontFamily: "Nunito, sans-serif",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: 1,
    borderWidth: token.borderWidth.default,
    borderStyle: "solid",
    borderColor: palette.border,
    background: palette.bg,
    color: palette.fg,
    borderRadius: rounded ? 9999 : token.radius.md,
    boxShadow: palette.boxShadow,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 1 : undefined,
    transition: "background-color 120ms ease, color 120ms ease, border-color 120ms ease",
    whiteSpace: "nowrap",
    ...style,
  };

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      aria-pressed={pressed || undefined}
      style={baseStyle}
    >
      {leftIcon && (
        <span aria-hidden="true" style={{ display: "inline-flex", width: 16, height: 16 }}>
          {leftIcon}
        </span>
      )}
      {children != null && <span>{children}</span>}
      {rightIcon && (
        <span aria-hidden="true" style={{ display: "inline-flex", width: 16, height: 16 }}>
          {rightIcon}
        </span>
      )}
    </button>
  );
}
