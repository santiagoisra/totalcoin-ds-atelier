import {
  useCallback,
  useMemo,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { token, shadowValue } from "../tokens.ts";

type SingleValue = number;
type RangeValue = readonly [number, number];

export interface SliderProps {
  /**
   * Valor. Si es un numero, renderiza single-thumb; si es tupla [min, max],
   * renderiza range-slider con dos thumbs.
   */
  value: SingleValue | RangeValue;
  /** Callback. Recibe el mismo shape que `value` (number o [number, number]). */
  onChange?: (value: number | [number, number]) => void;
  /** Minimo del rango absoluto. Default 0. */
  min?: number;
  /** Maximo del rango absoluto. Default 100. */
  max?: number;
  /** Step de incremento. Default 1. */
  step?: number;
  /** Label opcional arriba. En range, tambien acepta `labels: [left, right]`. */
  label?: string;
  /** Labels laterales (solo range). Ej: ["Min.", "Max."]. */
  labels?: readonly [string, string];
  /** Mostrar valor(es) numerico(s) debajo. Default true. */
  showValue?: boolean;
  /** Formato del valor — ej: `v => v.toLocaleString("es-AR")`. */
  formatValue?: (v: number) => string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const THUMB = 22;
const TRACK = 10;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function roundStep(v: number, step: number, min: number) {
  return Math.round((v - min) / step) * step + min;
}

/**
 * Atomo / Slider.
 *
 * Figma: nodo ilustrado en "Atomos / Slider". Track plano con fill brand/primary
 * y thumb circular brand/secondary (naranja). Soporta single y range.
 *
 * Implementacion custom con pointer events — no usa `<input type="range">` para
 * controlar 100% el estilo cross-browser. Keyboard support con arrow keys.
 */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  labels,
  showValue = true,
  formatValue,
  disabled = false,
  ariaLabel,
  className,
  style,
}: SliderProps): JSX.Element {
  const trackRef = useRef<HTMLDivElement>(null);
  const isRange = Array.isArray(value);
  const fmt = formatValue ?? ((v: number) => v.toLocaleString("es-AR"));

  const [lo, hi] = isRange ? (value as RangeValue) : [value as number, value as number];
  const loPct = ((lo - min) / (max - min)) * 100;
  const hiPct = ((hi - min) / (max - min)) * 100;
  const fillLeft = isRange ? loPct : 0;
  const fillRight = isRange ? hiPct : loPct;

  const commit = useCallback(
    (next: number, thumb: "lo" | "hi" | "single") => {
      if (disabled) return;
      const snapped = clamp(roundStep(next, step, min), min, max);
      if (isRange) {
        if (thumb === "lo") {
          onChange?.([Math.min(snapped, hi), hi]);
        } else {
          onChange?.([lo, Math.max(snapped, lo)]);
        }
      } else {
        onChange?.(snapped);
      }
    },
    [disabled, isRange, lo, hi, min, max, step, onChange],
  );

  const valueFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return min;
    const rect = track.getBoundingClientRect();
    const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
    return min + pct * (max - min);
  }, [min, max]);

  const startDrag = useCallback(
    (thumb: "lo" | "hi" | "single") => (e: ReactPointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      const onMove = (ev: PointerEvent) => {
        commit(valueFromClientX(ev.clientX), thumb);
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      commit(valueFromClientX(e.clientX), thumb);
    },
    [commit, valueFromClientX, disabled],
  );

  const onKey = useCallback(
    (thumb: "lo" | "hi" | "single") => (e: ReactKeyboardEvent) => {
      if (disabled) return;
      const cur = thumb === "hi" ? hi : lo;
      const delta =
        e.key === "ArrowRight" || e.key === "ArrowUp"
          ? step
          : e.key === "ArrowLeft" || e.key === "ArrowDown"
            ? -step
            : e.key === "Home"
              ? min - cur
              : e.key === "End"
                ? max - cur
                : e.key === "PageUp"
                  ? step * 10
                  : e.key === "PageDown"
                    ? -step * 10
                    : null;
      if (delta === null) return;
      e.preventDefault();
      commit(cur + delta, thumb);
    },
    [commit, hi, lo, min, max, step, disabled],
  );

  const thumb = (pos: number, thumbKey: "lo" | "hi" | "single"): ReactNode => (
    <div
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel ?? label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={thumbKey === "hi" ? hi : lo}
      aria-orientation="horizontal"
      aria-disabled={disabled || undefined}
      onPointerDown={startDrag(thumbKey)}
      onKeyDown={onKey(thumbKey)}
      style={{
        position: "absolute",
        top: "50%",
        left: `${pos}%`,
        transform: "translate(-50%, -50%)",
        width: THUMB,
        height: THUMB,
        borderRadius: "50%",
        background: token.brand.secondary,
        boxShadow: shadowValue.xs,
        cursor: disabled ? "not-allowed" : "grab",
        touchAction: "none",
        outline: "none",
      }}
      onFocus={(e) => {
        if (!disabled) e.currentTarget.style.boxShadow = `0 0 0 3px ${token.focus.ring}, ${shadowValue.xs}`;
      }}
      onBlur={(e) => { e.currentTarget.style.boxShadow = shadowValue.xs ?? "none"; }}
    />
  );

  return (
    <div className={className} style={{ width: "100%", opacity: disabled ? 0.5 : 1, ...style }}>
      {(label || (labels && labels.length === 2)) && (
        <div
          style={{
            display: "flex",
            justifyContent: labels ? "space-between" : "flex-start",
            fontFamily: "Nunito, sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: token.text.secondary,
            marginBottom: 16,
          }}
        >
          {labels ? (
            <>
              <span>{labels[0]}</span>
              <span>{labels[1]}</span>
            </>
          ) : (
            <span>{label}</span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        style={{
          position: "relative",
          width: "100%",
          height: TRACK,
          background: token.border.default,
          borderRadius: 9999,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${fillLeft}%`,
            right: `${100 - fillRight}%`,
            background: token.brand.primary,
            borderRadius: 9999,
          }}
        />
        {isRange ? (
          <>
            {thumb(loPct, "lo")}
            {thumb(hiPct, "hi")}
          </>
        ) : (
          thumb(loPct, "single")
        )}
      </div>

      {showValue && (
        <div
          style={{
            position: "relative",
            height: 20,
            marginTop: 8,
            fontFamily: "Nunito, sans-serif",
            fontSize: 13,
            color: token.text.secondary,
          }}
        >
          {isRange ? (
            <>
              <span style={{ position: "absolute", left: `${loPct}%`, transform: "translateX(-50%)" }}>{fmt(lo)}</span>
              <span style={{ position: "absolute", left: `${hiPct}%`, transform: "translateX(-50%)" }}>{fmt(hi)}</span>
            </>
          ) : (
            <span style={{ position: "absolute", left: `${loPct}%`, transform: "translateX(-50%)" }}>{fmt(lo)}</span>
          )}
        </div>
      )}
    </div>
  );
}
