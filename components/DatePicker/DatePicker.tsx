import { useEffect, useRef, useState, type CSSProperties } from "react";
import { token, shadowValue } from "../tokens.ts";
import { Icon } from "../Icon/Icon.tsx";

export interface DatePickerProps {
  /** Valor seleccionado (ISO `YYYY-MM-DD`). */
  value?: string;
  defaultValue?: string;
  onChange?: (iso: string) => void;
  placeholder?: string;
  /** Formato de display (default `dd/mm/yyyy`). */
  format?: (date: Date) => string;
  /** Lunes primero (default true — latam). */
  weekStartsOnMonday?: boolean;
  /** Min/max dates como ISO YYYY-MM-DD. */
  min?: string;
  max?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const WEEKDAYS_MON_FIRST = ["L", "M", "M", "J", "V", "S", "D"];
const WEEKDAYS_SUN_FIRST = ["D", "L", "M", "M", "J", "V", "S"];
const MONTHS_ES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function parseIso(iso: string | undefined): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function defaultFormat(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function addMonths(date: Date, diff: number): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + diff);
  return d;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * Organismo / DatePicker.
 *
 * Input con calendar popup. Implementacion liviana sin libs de fechas —
 * solo `Date` nativo.
 *
 * Figma: master `47208:1029`. El DatePicker real del DS tiene 4 variantes
 * (titulo/subtitulo on/off) — aca modelamos el patron core. Titulo/subtitulo
 * se componen facilmente con un `<TextField label="..."><DatePicker /></TextField>`
 * wrapper si hace falta.
 */
export function DatePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = "Seleccioná una fecha",
  format = defaultFormat,
  weekStartsOnMonday = true,
  min,
  max,
  disabled = false,
  className,
  style,
}: DatePickerProps): JSX.Element {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const selectedIso = isControlled ? controlledValue : uncontrolled;
  const selectedDate = parseIso(selectedIso);

  const [open, setOpen] = useState(false);
  const [monthCursor, setMonthCursor] = useState(() => selectedDate ?? new Date());
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const minDate = parseIso(min);
  const maxDate = parseIso(max);
  const weekdays = weekStartsOnMonday ? WEEKDAYS_MON_FIRST : WEEKDAYS_SUN_FIRST;

  // Grid de dias: 6 rows × 7 cols. Incluye dias del mes anterior/siguiente como visual fill.
  const firstOfMonth = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
  const weekdayOffset = weekStartsOnMonday ? (firstOfMonth.getDay() + 6) % 7 : firstOfMonth.getDay();
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - weekdayOffset);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  function commit(date: Date) {
    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;
    const iso = toIso(date);
    if (!isControlled) setUncontrolled(iso);
    onChange?.(iso);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={className} style={{ position: "relative", width: 280, ...style }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        aria-haspopup="dialog"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: token.size.s,
          width: "100%",
          height: 45,
          padding: "0 10px",
          background: token.bg.surface,
          border: `${token.borderWidth.default} solid ${token.border.default}`,
          borderRadius: token.radius.md,
          fontFamily: "Nunito, sans-serif",
          fontWeight: 500,
          fontSize: 14,
          color: selectedDate ? token.text.primary : token.text.secondary,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          textAlign: "left",
        }}
      >
        <span>{selectedDate ? format(selectedDate) : placeholder}</span>
        <Icon name="chevron-down" size={20} color={token.icon.primary} style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 160ms ease" }} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Seleccionar fecha"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 100,
            width: 280,
            background: token.bg.button,
            border: `${token.borderWidth.default} solid ${token.border.default}`,
            borderRadius: token.radius.md,
            boxShadow: shadowValue.s,
            padding: token.size.md,
            fontFamily: "Nunito, sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: token.size.s }}>
            <button type="button" onClick={() => setMonthCursor((d) => addMonths(d, -1))} aria-label="Mes anterior" style={{ width: 28, height: 28, border: "none", background: "transparent", color: token.icon.primary, cursor: "pointer", borderRadius: 6 }}>
              <Icon name="chevron-left" size={18} />
            </button>
            <span style={{ fontWeight: 700, fontSize: 14, color: token.text.primary }}>
              {MONTHS_ES[monthCursor.getMonth()]} {monthCursor.getFullYear()}
            </span>
            <button type="button" onClick={() => setMonthCursor((d) => addMonths(d, 1))} aria-label="Mes siguiente" style={{ width: 28, height: 28, border: "none", background: "transparent", color: token.icon.primary, cursor: "pointer", borderRadius: 6 }}>
              <Icon name="chevron-right" size={18} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {weekdays.map((w, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: token.text.tertiary, padding: 4 }}>
                {w}
              </div>
            ))}
            {days.map((d, i) => {
              const isCurrentMonth = d.getMonth() === monthCursor.getMonth();
              const isSelected = selectedDate && sameDay(d, selectedDate);
              const isToday = sameDay(d, new Date());
              const isDisabled = (minDate && d < minDate) || (maxDate && d > maxDate);

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isDisabled || false}
                  onClick={() => commit(d)}
                  aria-pressed={isSelected || undefined}
                  style={{
                    height: 32,
                    width: "100%",
                    border: isToday && !isSelected ? `1px solid ${token.brand.primary}` : "none",
                    borderRadius: 6,
                    background: isSelected ? token.brand.primary : "transparent",
                    color: isSelected ? token.text.onPrimary : isCurrentMonth ? token.text.primary : token.text.tertiary,
                    fontSize: 13,
                    fontWeight: isSelected ? 700 : 500,
                    fontFamily: "inherit",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.4 : 1,
                    padding: 0,
                  }}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
