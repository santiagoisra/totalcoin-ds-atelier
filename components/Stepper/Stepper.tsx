import type { CSSProperties } from "react";
import { token } from "../tokens.ts";

export interface StepperProps {
  /** Cantidad total de pasos (3-9 en Figma; aca aceptamos cualquier >= 2). */
  steps: number;
  /** Indice del paso activo (0-based). */
  current: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Molecula / Stepper.
 *
 * Figma: master `43856:68600`. Dots conectados por linea de tiempo.
 * Dot activo se colorea con `brand.primary`, inactivos con `border.default`.
 */
export function Stepper({
  steps,
  current,
  className,
  style,
}: StepperProps): JSX.Element {
  const clampedCurrent = Math.max(0, Math.min(steps - 1, current));
  const dotSize = 8;

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedCurrent + 1}
      aria-valuemin={1}
      aria-valuemax={steps}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        minWidth: 160,
        height: dotSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        ...style,
      }}
    >
      {/* timeline */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: dotSize / 2,
          right: dotSize / 2,
          height: 1,
          background: token.border.default,
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />
      {Array.from({ length: steps }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: "relative",
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            background: i === clampedCurrent ? token.brand.primary : token.border.default,
            border: i === clampedCurrent ? "none" : `${token.borderWidth.default} solid ${token.border.default}`,
          }}
        />
      ))}
    </div>
  );
}
