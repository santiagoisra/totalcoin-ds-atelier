import {
  forwardRef,
  useState,
  type CSSProperties,
  type TextareaHTMLAttributes,
} from "react";
import { token, shadowValue } from "../tokens.ts";

export type TextareaRoundness = "default" | "round";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** `default` = radius s (8px, mas cuadrado); `round` = radius l (16px, mas blando). */
  roundness?: TextareaRoundness;
  /** Estado de error (borde rojo + focus ring rojo cuando enfocado). */
  error?: boolean;
  /** Permitir redimensionar. Default true. */
  resizable?: boolean;
}

/**
 * Atomo / Textarea.
 *
 * Figma: master `47277:3018`. Pertenece a la era **nueva** del DS
 * (Inter font, focus ring visible, shadow-xs sutil). Conforme DS-en-transicion,
 * otros inputs (Caja de texto) todavia usan la era antigua (Nunito, sin focus ring).
 *
 * Estados manejados:
 * - idle (empty/placeholder/value): borde bg/input, shadow-xs
 * - focus: borde text/secondary, focus ring spread 3px
 * - error: borde feedback/error
 * - error + focus: borde error + focus ring error
 * - disabled: opacity 0.3, cursor not-allowed
 *
 * El focus se detecta con onFocus/onBlur + useState (no :focus-visible CSS pseudo)
 * porque todo el componente usa inline styles — mantenemos ese patron.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      roundness = "default",
      error = false,
      resizable = true,
      disabled = false,
      rows = 3,
      onFocus,
      onBlur,
      style,
      className,
      ...rest
    },
    ref,
  ) {
    const [focused, setFocused] = useState(false);

    const borderColor = error
      ? token.feedback.error
      : focused
        ? token.text.secondary
        : token.bg.input;

    const focusRingColor = error ? token.focus.ringError : token.focus.ring;
    const focusRing = focused ? `, 0 0 0 3px ${focusRingColor}` : "";
    const boxShadow = disabled ? undefined : `${shadowValue.xs}${focusRing}`;

    const finalStyle: CSSProperties = {
      display: "block",
      width: "100%",
      minHeight: 76,
      boxSizing: "border-box",
      padding: token.size.s,
      fontFamily: "Inter, sans-serif",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "21px",
      letterSpacing: "0.5px",
      color: token.icon.primary,
      background: token.bg.surface,
      border: `${token.borderWidth.default} solid ${borderColor}`,
      borderRadius: roundness === "round" ? token.radius.l : token.radius.s,
      boxShadow,
      outline: "none",
      resize: resizable && !disabled ? "both" : "none",
      opacity: disabled ? 0.3 : 1,
      cursor: disabled ? "not-allowed" : "text",
      transition: "border-color 120ms ease, box-shadow 120ms ease",
      ...style,
    };

    return (
      <textarea
        {...rest}
        ref={ref}
        rows={rows}
        disabled={disabled}
        aria-invalid={error || undefined}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className={className}
        style={finalStyle}
      />
    );
  },
);
