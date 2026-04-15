import { useEffect, useRef, type CSSProperties } from "react";
import { token } from "../tokens.ts";

export interface SpinnerProps {
  /** Tamaño en pixeles o CSS length. Default 108 (match Figma). */
  size?: number | string;
  /** Color del arco. Default token.brand.primary. */
  color?: CSSProperties["color"];
  /** Grosor del anillo. Default = size/10 (min 2px). */
  thickness?: number;
  /** Duracion de una vuelta en ms. Default 800. */
  duration?: number;
  /** Label accesible. Default "Cargando". */
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Atomo / Spinner.
 *
 * Figma: master node `47558:1236`. Implementado como PNG estatico en Figma —
 * el code-side usa **Web Animations API** (sin keyframes CSS, sin libs).
 *
 * Por que Web Animations y no `@keyframes`:
 * - Autocontenido: no requiere un stylesheet global ni import extra.
 * - Pausable/cancelable en tests via `getAnimations()` / `cancel()`.
 * - Honra `prefers-reduced-motion` automaticamente cuando el browser lo aplica a
 *   animations. Si el usuario lo tiene on, se pausa sin codigo extra.
 */
export function Spinner({
  size = 108,
  color,
  thickness,
  duration = 800,
  ariaLabel = "Cargando",
  className,
  style,
}: SpinnerProps): JSX.Element {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const anim = el.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
      { duration, iterations: Infinity, easing: "linear" },
    );
    return () => anim.cancel();
  }, [duration]);

  const sizePx = typeof size === "number" ? size : undefined;
  const sizeValue = typeof size === "number" ? `${size}px` : size;
  const borderW = thickness ?? Math.max(2, (sizePx ?? 108) / 10);
  const spinnerColor = color ?? token.brand.primary;

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={className}
      style={{
        display: "inline-block",
        width: sizeValue,
        height: sizeValue,
        ...style,
      }}
    >
      <span
        ref={ref}
        aria-hidden="true"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: `${borderW}px solid transparent`,
          borderTopColor: spinnerColor,
          boxSizing: "border-box",
          willChange: "transform",
        }}
      />
    </div>
  );
}
