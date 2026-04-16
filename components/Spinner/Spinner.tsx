import { useEffect, useRef, type CSSProperties } from "react";
import { token } from "../tokens.ts";

export interface SpinnerProps {
  /** Tamaño en pixeles o CSS length. Default 108 (match Figma). */
  size?: number | string;
  /** Color del arco. Default token.brand.primary. */
  color?: CSSProperties["color"];
  /** Grosor del anillo en px. Default = size/10 (min 2px). */
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
 * el code-side usa **Web Animations API** sobre un SVG con `stroke-linecap="round"`
 * para que los extremos del arco queden redondeados (match Figma).
 *
 * Por que Web Animations y no `@keyframes`:
 * - Autocontenido: no requiere stylesheet global ni import extra.
 * - Pausable/cancelable en tests via `getAnimations()` / `cancel()`.
 * - Honra `prefers-reduced-motion` cuando el browser lo aplica a animations.
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
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const anim = el.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
      { duration, iterations: Infinity, easing: "linear" },
    );
    return () => anim.cancel();
  }, [duration]);

  const sizeNum = typeof size === "number" ? size : 108;
  const sizeValue = typeof size === "number" ? `${size}px` : size;
  const strokePx = thickness ?? Math.max(2, sizeNum / 10);
  const vbStroke = (strokePx * 100) / sizeNum;
  const r = 50 - vbStroke / 2;
  const circumference = 2 * Math.PI * r;
  const arc = circumference * 0.25;
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
      <svg
        ref={ref}
        aria-hidden="true"
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{ display: "block", willChange: "transform", transformOrigin: "center" }}
      >
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={spinnerColor as string}
          strokeWidth={vbStroke}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
        />
      </svg>
    </div>
  );
}
