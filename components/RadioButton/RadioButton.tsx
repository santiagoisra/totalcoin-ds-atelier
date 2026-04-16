import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
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
 * Figma: master `397:957`. 25×25 px. 4 estados: unchecked/checked × default/disabled.
 * El DS reutiliza el patron visual del CheckBox (check icon en vez de dot) — atipico
 * pero intencional. Focus visible con borde negro grueso al hacer Tab.
 *
 * Disabled:
 * - unchecked: circulo gris relleno sin borde.
 * - checked:   circulo gris con check blanco (no brand primary).
 */
export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  function RadioButton(
    { size = 25, checked, disabled = false, ariaLabel, id: idProp, className, style, onFocus, onBlur, ...rest },
    ref,
  ) {
    const autoId = useId();
    const id = idProp ?? `rb-${autoId}`;
    const [focused, setFocused] = useState(false);

    let bg: string;
    let borderColor: string;
    let borderWidth: number;

    if (disabled) {
      bg = checked ? "#bdbdbd" : "#e5e5e5";
      borderColor = "transparent";
      borderWidth = 0;
    } else if (checked) {
      bg = token.brand.primary as string;
      borderColor = token.brand.primary as string;
      borderWidth = 1;
    } else {
      bg = "transparent";
      borderColor = focused ? (token.text.primary as string) : (token.border.default as string);
      borderWidth = focused ? 2 : 1;
    }

    return (
      <label
        htmlFor={id}
        aria-label={ariaLabel}
        className={className}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
          borderRadius: "50%",
          border: `${borderWidth}px solid ${borderColor}`,
          background: bg,
          color: "#ffffff",
          cursor: disabled ? "not-allowed" : "pointer",
          boxShadow: focused && checked && !disabled ? `0 0 0 3px ${token.focus.ring}` : "none",
          transition: "border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease",
          flexShrink: 0,
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
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
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
