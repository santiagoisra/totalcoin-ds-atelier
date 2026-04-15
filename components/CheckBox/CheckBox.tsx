import type { CSSProperties } from "react";
import { token } from "../tokens.ts";

export interface CheckBoxProps {
  /** Estado marcado. Mapea a la variante Figma `Cheked` (sic). */
  checked?: boolean;
  /** Callback al cambiar. Si se omite, el check queda estatico (display-only). */
  onChange?: (checked: boolean) => void;
  /** Deshabilita el check. */
  disabled?: boolean;
  /** Label accesible. Requerido si no esta envuelto en un `<label>`. */
  ariaLabel?: string;
  /** Tamanio en px. Default 21 (match Figma). */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Atomo / Check box.
 *
 * Figma: master `18911:41938` (variantes `Cheked=false/true`). El typo "Cheked"
 * lo preserva Figma — en codigo usamos `checked` (correcto).
 *
 * Decisiones de diseno:
 * - Inline SVG para el check (Figma usa PNG; SVG escala y respeta currentColor).
 * - `<button type="button">` por default; accesible via aria-pressed.
 */
export function CheckBox({
  checked = false,
  onChange,
  disabled = false,
  ariaLabel,
  size = 21,
  className,
  style,
}: CheckBoxProps): JSX.Element {
  const isInteractive = Boolean(onChange) && !disabled;

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={isInteractive ? () => onChange!(!checked) : undefined}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        padding: 0,
        borderRadius: token.radius.xs,
        border: `${token.borderWidth.default} solid ${checked ? token.brand.primary : token.text.tertiary}`,
        background: checked ? token.brand.primary : "transparent",
        color: token.text.onPrimary,
        cursor: isInteractive ? "pointer" : disabled ? "not-allowed" : "default",
        opacity: disabled ? 0.5 : 1,
        transition: "background-color 150ms ease, border-color 150ms ease",
        ...style,
      }}
    >
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
    </button>
  );
}
