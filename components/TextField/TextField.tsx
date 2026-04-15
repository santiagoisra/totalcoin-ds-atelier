import {
  forwardRef,
  useId,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { token } from "../tokens.ts";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Label grande arriba (Nunito Bold 18). Mapea a Figma `label = true`. */
  label?: ReactNode;
  /** Sublabel chico debajo (Nunito Medium 14, icon/primary color). Mapea a Figma `sublabel = true`. */
  sublabel?: ReactNode;
  /** Si true, borde visible alrededor del input. Figma `borde = true`. Default true. */
  border?: boolean;
  /** Icono a la izquierda del input. */
  leftIcon?: ReactNode;
  /** Icono a la derecha (ej. chevron para combo). */
  rightIcon?: ReactNode;
  /** Fuerza el estado visual "seleccionado" (borde primary). Figma `selected = true`. */
  selected?: boolean;
}

/**
 * Atomo / Caja de texto.
 *
 * Figma: master `44938:74026` (frame `44959:74139` contiene showcase de las 19
 * variantes). Usa tokens de la era original del DS (Nunito, border/default,
 * text/primary). Para inputs mas modernos con focus ring, ver Textarea.
 *
 * La variante Figma con `url = true` NO esta soportada — es un caso
 * especializado (input partido con prefijo https://). Si hace falta, componer
 * dos TextField juntos con el patron side-by-side.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      sublabel,
      border = true,
      leftIcon,
      rightIcon,
      selected = false,
      disabled = false,
      id: idProp,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const id = idProp ?? `tf-${autoId}`;

    const borderColor =
      !border ? "transparent" : selected ? token.brand.primary : token.border.default;

    const wrapperStyle: CSSProperties = {
      display: "flex",
      flexDirection: "column",
      gap: token.size.xs,
      width: "100%",
    };

    const fieldStyle: CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: token.size.s,
      height: 45,
      padding: "0 10px",
      background: token.bg.surface,
      border: `${token.borderWidth.default} solid ${borderColor}`,
      borderRadius: token.radius.md,
      opacity: disabled ? 0.5 : 1,
    };

    const inputStyle: CSSProperties = {
      flex: 1,
      minWidth: 0,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "Nunito, sans-serif",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: 1,
      color: token.text.primary,
      padding: 0,
    };

    return (
      <div className={className} style={{ ...wrapperStyle, ...style }}>
        {label && (
          <label
            htmlFor={id}
            style={{
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              lineHeight: 1,
              color: token.text.primary,
            }}
          >
            {label}
          </label>
        )}
        <div style={fieldStyle}>
          {leftIcon && (
            <span aria-hidden="true" style={{ display: "inline-flex", width: 24, height: 24, color: token.icon.primary }}>
              {leftIcon}
            </span>
          )}
          <input
            {...rest}
            ref={ref}
            id={id}
            disabled={disabled}
            style={inputStyle}
          />
          {rightIcon && (
            <span aria-hidden="true" style={{ display: "inline-flex", width: 24, height: 24, color: token.icon.primary }}>
              {rightIcon}
            </span>
          )}
        </div>
        {sublabel && (
          <span
            style={{
              fontFamily: "Nunito, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: 1,
              color: token.icon.primary,
            }}
          >
            {sublabel}
          </span>
        )}
      </div>
    );
  },
);
