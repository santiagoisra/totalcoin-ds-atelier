import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { token } from "../tokens.ts";

export interface RadioButtonProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Tamaño en px. Default 25 (match Figma). */
  size?: number;
  ariaLabel?: string;
}

/**
 * Atomo / RadioButton.
 *
 * Figma: master `397:957`. Variantes: `Chekeado` (typo original) × `Enabled`.
 * 25×25 px. Circulo con check icon cuando checked (curioso — no es un dot
 * clasico de radio; el DS eligio reutilizar el patron visual del CheckBox).
 *
 * Implementado como `<input type="radio">` nativo + label visual wrapper para
 * keyboard nav + form integration. Agrupa con `name`.
 */
export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  function RadioButton(
    { size = 25, checked, disabled = false, ariaLabel, id: idProp, className, style, ...rest },
    ref,
  ) {
    const autoId = useId();
    const id = idProp ?? `rb-${autoId}`;

    const borderColor = disabled
      ? token.text.tertiary
      : checked
        ? token.brand.primary
        : token.border.default;
    const bgColor = checked && !disabled ? token.brand.primary : "transparent";

    return (
      <label
        htmlFor={id}
        aria-label={ariaLabel}
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
          borderRadius: "50%",
          border: `${token.borderWidth.default} solid ${borderColor}`,
          background: bgColor,
          color: token.text.onPrimary,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "border-color 120ms ease, background-color 120ms ease",
          ...style,
        }}
      >
        <input
          {...rest}
          ref={ref}
          type="radio"
          id={id}
          checked={checked}
          disabled={disabled}
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        />
        {checked && (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width={size * 0.52}
            height={size * 0.52}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12l4.5 4.5L19 7" />
          </svg>
        )}
      </label>
    );
  },
);
