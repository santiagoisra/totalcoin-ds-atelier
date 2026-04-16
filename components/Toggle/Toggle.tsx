import { forwardRef, type ButtonHTMLAttributes } from "react";
import { token, shadowValue } from "../tokens.ts";

export type ToggleSize = "sm" | "md" | "lg";

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onChange"> {
  /** Estado on/off. Mapea a Figma `encendido`. */
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Tamaño. sm=34×20, md=51×31 (default, match Figma), lg=68×41. */
  size?: ToggleSize;
  ariaLabel?: string;
}

const SIZES: Record<ToggleSize, { w: number; h: number; knob: number; pad: number }> = {
  sm: { w: 34, h: 20, knob: 16, pad: 2 },
  md: { w: 51, h: 31, knob: 27, pad: 2 },
  lg: { w: 68, h: 41, knob: 36, pad: 2.5 },
};

/**
 * Atomo / Toggle.
 *
 * Figma: master `1451:7678` (base 51×31 px). Code-side usa CSS puro — track pill
 * con knob absoluto transicionando 180ms, con variantes de tamaño escalables.
 *
 * Track colors:
 * - on  -> `brand.primary` (#003e70)
 * - off -> `text.secondary` (#828282, Brand / Gris3)
 *
 * Knob: circulo blanco con shadow.xs. Focus-visible con ring brand/primary.
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  function Toggle(
    {
      checked = false,
      onCheckedChange,
      disabled = false,
      size = "md",
      ariaLabel,
      style,
      onClick,
      ...rest
    },
    ref,
  ) {
    const dims = SIZES[size];
    const travel = dims.w - dims.knob - dims.pad * 2;

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
          width: dims.w,
          height: dims.h,
          borderRadius: 9999,
          border: "none",
          padding: 0,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          background: checked ? token.brand.primary : token.text.secondary,
          transition: "background-color 180ms ease, box-shadow 180ms ease",
          outline: "none",
          boxShadow: "none",
          flexShrink: 0,
          ...style,
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.currentTarget.style.boxShadow = `0 0 0 3px ${token.focus.ring}`;
          }
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
          rest.onBlur?.(e);
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: dims.pad,
            left: dims.pad,
            width: dims.knob,
            height: dims.knob,
            borderRadius: "50%",
            background: "#fefefe",
            boxShadow: shadowValue.xs,
            transform: checked ? `translateX(${travel}px)` : "translateX(0)",
            transition: "transform 180ms ease",
          }}
        />
      </button>
    );
  },
);
