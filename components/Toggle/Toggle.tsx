import { forwardRef, type ButtonHTMLAttributes } from "react";
import { token } from "../tokens.ts";

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onChange"> {
  /** Estado on/off. Mapea a Figma `encendido`. */
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  ariaLabel?: string;
}

/**
 * Atomo / Toggle simple.
 *
 * Figma: master `1451:7678` (51×31 px). Implementado como imagen en Figma —
 * code-side usa CSS puro (track pill + knob absoluto con transicion).
 *
 * Track colors:
 * - on  -> `brand.primary` (#003e70)
 * - off -> `text.secondary` (#828282, matches Figma "Brand / Gris3")
 *
 * Knob: circulo blanco 27×27 con sombra xs.
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  function Toggle(
    {
      checked = false,
      onCheckedChange,
      disabled = false,
      ariaLabel,
      style,
      onClick,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        {...rest}
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={(e) => {
          if (!disabled) onCheckedChange?.(!checked);
          onClick?.(e);
        }}
        style={{
          position: "relative",
          width: 51,
          height: 31,
          borderRadius: 9999,
          border: "none",
          padding: 0,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          background: checked ? token.brand.primary : token.text.secondary,
          transition: "background-color 180ms ease",
          ...style,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            width: 27,
            height: 27,
            borderRadius: "50%",
            background: "#fefefe",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)",
            transform: checked ? "translateX(20px)" : "translateX(0)",
            transition: "transform 180ms ease",
          }}
        />
      </button>
    );
  },
);
