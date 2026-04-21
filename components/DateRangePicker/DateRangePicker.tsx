import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cssVar, token, shadowValue } from "../tokens.ts";
import { Icon } from "../Icon/Icon.tsx";

export interface DateRangeValue {
  start?: string;
  end?: string;
}

export interface DateRangePickerProps {
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  onChange?: (range: DateRangeValue) => void;
  placeholder?: { start?: string; end?: string };
  format?: (date: Date) => string;
  /** Default false (DOM primero) — match con el diseño del DS. */
  weekStartsOnMonday?: boolean;
  /** 1 = single, 2 = dual-month side by side. Default 1. */
  months?: 1 | 2;
  min?: string;
  max?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Slot opcional que se renderiza al pie del popover (presets, links, etc). */
  footer?: ReactNode;
}

const WEEKDAYS_SUN_FIRST = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
const WEEKDAYS_MON_FIRST = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];
const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const MONTHS_ES_SHORT = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const RANGE_BG = cssVar["color-primary-100"]; // #b0c3d3

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

function maskDdmmyyyy(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const parts: string[] = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));
  return parts.join("/");
}

function parseDdmmyyyy(raw: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(raw.trim());
  if (!match) return null;
  const d = Number(match[1]);
  const mo = Number(match[2]);
  const y = Number(match[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  return date;
}

function addMonths(date: Date, diff: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + diff, 1);
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBetween(day: Date, a: Date, b: Date): boolean {
  const t = day.getTime();
  const lo = Math.min(a.getTime(), b.getTime());
  const hi = Math.max(a.getTime(), b.getTime());
  return t >= lo && t <= hi;
}

const navBtn: CSSProperties = {
  width: 28,
  height: 28,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  borderRadius: 6,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};

interface MonthGridProps {
  cursor: Date;
  weekStartsOnMonday: boolean;
  start: Date | null;
  end: Date | null;
  hover: Date | null;
  minDate: Date | null;
  maxDate: Date | null;
  onPick: (d: Date) => void;
  onHover: (d: Date | null) => void;
  onPrev: () => void;
  onNext: () => void;
  onCursorChange: (d: Date) => void;
}

function MonthGrid({
  cursor,
  weekStartsOnMonday,
  start,
  end,
  hover,
  minDate,
  maxDate,
  onPick,
  onHover,
  onPrev,
  onNext,
  onCursorChange,
}: MonthGridProps): JSX.Element {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(cursor.getFullYear());

  useEffect(() => {
    if (pickerOpen) setPickerYear(cursor.getFullYear());
  }, [pickerOpen, cursor]);

  const weekdays = weekStartsOnMonday ? WEEKDAYS_MON_FIRST : WEEKDAYS_SUN_FIRST;

  const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const weekdayOffset = weekStartsOnMonday
    ? (firstOfMonth.getDay() + 6) % 7
    : firstOfMonth.getDay();
  const lastOfMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const totalDays = lastOfMonth.getDate();

  const cells: Array<Date | null> = [];
  for (let i = 0; i < weekdayOffset; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  const previewEnd = end ?? (start && hover ? hover : null);

  function handleMonthPick(monthIdx: number) {
    onCursorChange(new Date(pickerYear, monthIdx, 1));
    setPickerOpen(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: token.size.s, width: 280 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={() => setPickerOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={pickerOpen}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            border: "none",
            background: "transparent",
            padding: "4px 6px",
            margin: "-4px -6px",
            borderRadius: 6,
            cursor: "pointer",
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: token.text.primary,
          }}
        >
          <span>{MONTHS_ES[cursor.getMonth()]} {cursor.getFullYear()}</span>
          <Icon
            name="chevron-right"
            size={14}
            color={token.brand.primary}
            style={{ transform: pickerOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 140ms ease" }}
          />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: token.size.xs }}>
          <button type="button" onClick={onPrev} aria-label="Mes anterior" style={navBtn}>
            <Icon name="chevron-left" size={18} color={token.brand.primary} />
          </button>
          <button type="button" onClick={onNext} aria-label="Mes siguiente" style={navBtn}>
            <Icon name="chevron-right" size={18} color={token.brand.primary} />
          </button>
        </div>
      </div>

      {pickerOpen ? (
        <div style={{ display: "flex", flexDirection: "column", gap: token.size.s }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button type="button" onClick={() => setPickerYear((y) => y - 1)} aria-label="Año anterior" style={navBtn}>
              <Icon name="chevron-left" size={18} color={token.brand.primary} />
            </button>
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 14, color: token.text.primary }}>
              {pickerYear}
            </span>
            <button type="button" onClick={() => setPickerYear((y) => y + 1)} aria-label="Año siguiente" style={navBtn}>
              <Icon name="chevron-right" size={18} color={token.brand.primary} />
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
            {MONTHS_ES_SHORT.map((m, i) => {
              const isCurrent = cursor.getFullYear() === pickerYear && cursor.getMonth() === i;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMonthPick(i)}
                  style={{
                    padding: "10px 0",
                    border: "none",
                    borderRadius: token.radius.md,
                    background: isCurrent ? RANGE_BG : "transparent",
                    color: token.text.primary,
                    fontFamily: "Nunito, sans-serif",
                    fontSize: 14,
                    fontWeight: isCurrent ? 700 : 500,
                    cursor: "pointer",
                  }}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: 2 }}>
          {weekdays.map((w) => (
            <div
              key={w}
              style={{
                textAlign: "center",
                fontFamily: "Nunito, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: token.text.tertiary,
                padding: "6px 0",
                letterSpacing: "0.04em",
              }}
            >
              {w}
            </div>
          ))}

          {cells.map((d, i) => {
            if (!d) return <div key={`empty-${i}`} />;

            const isDisabled = (minDate && d < minDate) || (maxDate && d > maxDate);
            const isStart = Boolean(start && sameDay(d, start));
            const isEnd = Boolean(previewEnd && sameDay(d, previewEnd));
            const inRange = start && previewEnd ? isBetween(d, start, previewEnd) : isStart;

            const col = i % 7;
            const prevCell = col === 0 ? null : cells[i - 1];
            const nextCell = col === 6 ? null : cells[i + 1];
            const prevInRange = prevCell && start && previewEnd && isBetween(prevCell, start, previewEnd);
            const nextInRange = nextCell && start && previewEnd && isBetween(nextCell, start, previewEnd);

            const leftEdge = inRange && !prevInRange;
            const rightEdge = inRange && !nextInRange;
            const borderRadius = inRange
              ? `${leftEdge ? 9999 : 0}px ${rightEdge ? 9999 : 0}px ${rightEdge ? 9999 : 0}px ${leftEdge ? 9999 : 0}px`
              : 0;

            return (
              <button
                key={i}
                type="button"
                disabled={isDisabled || false}
                onMouseEnter={() => onHover(d)}
                onMouseLeave={() => onHover(null)}
                onClick={() => !isDisabled && onPick(d)}
                aria-pressed={(isStart || isEnd) || undefined}
                style={{
                  height: 36,
                  width: "100%",
                  padding: 0,
                  border: "none",
                  background: inRange ? RANGE_BG : "transparent",
                  borderRadius,
                  color: isDisabled ? token.text.disabled : token.text.primary,
                  fontFamily: "Nunito, sans-serif",
                  fontSize: 14,
                  fontWeight: isStart || isEnd ? 700 : 500,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.4 : 1,
                }}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface TriggerProps {
  startDate: Date | null;
  endDate: Date | null;
  startDraft: string;
  endDraft: string;
  placeholder: { start?: string; end?: string };
  disabled: boolean;
  compact?: boolean;
  /** Si true, no permite editar — muestra spans en vez de inputs. */
  readOnly?: boolean;
  /** Si true, no se estira al ancho del flex container padre. */
  fitContent?: boolean;
  format: (date: Date) => string;
  onStartChange: (raw: string) => void;
  onEndChange: (raw: string) => void;
  onStartCommit: () => void;
  onEndCommit: () => void;
  onOpenToggle: () => void;
}

function Trigger({
  startDate,
  endDate,
  startDraft,
  endDraft,
  placeholder,
  disabled,
  compact,
  readOnly,
  fitContent,
  format,
  onStartChange,
  onEndChange,
  onStartCommit,
  onEndCommit,
  onOpenToggle,
}: TriggerProps): JSX.Element {
  const textStyle: CSSProperties = {
    width: 92,
    fontFamily: "Nunito, sans-serif",
    fontWeight: 400,
    fontSize: 14,
    color: token.text.primary,
    textAlign: "center",
  };
  const inputStyle: CSSProperties = {
    ...textStyle,
    border: "none",
    outline: "none",
    background: "transparent",
    padding: 0,
  };
  const spanStyle: CSSProperties = {
    ...textStyle,
    display: "inline-block",
    color: startDate || endDate ? token.text.primary : token.text.secondary,
  };

  return (
    <div
      role="group"
      aria-label="Rango de fechas"
      onClick={onOpenToggle}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: fitContent ? "flex-start" : undefined,
        gap: 10,
        minWidth: 240,
        padding: compact ? "8px 12px" : "10px 12px",
        background: token.bg.surface,
        border: `${token.borderWidth.default} solid ${cssVar["color-neutral-300"]}`,
        borderRadius: token.radius.md,
        cursor: disabled ? "not-allowed" : readOnly ? "pointer" : "text",
        opacity: disabled ? 0.5 : 1,
        whiteSpace: "nowrap",
      }}
    >
      {readOnly ? (
        <span style={spanStyle}>{startDate ? format(startDate) : (placeholder.start ?? "DD/MM/AAAA")}</span>
      ) : (
        <input
          type="text"
          inputMode="numeric"
          disabled={disabled}
          placeholder={placeholder.start ?? "DD/MM/AAAA"}
          value={startDraft}
          onChange={(e) => onStartChange(maskDdmmyyyy(e.target.value))}
          onBlur={onStartCommit}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onStartCommit();
            }
          }}
          maxLength={10}
          aria-label="Fecha de inicio"
          style={inputStyle}
        />
      )}
      <Icon name="chevron-right" size={20} color={token.brand.primary} />
      {readOnly ? (
        <span style={spanStyle}>{endDate ? format(endDate) : (placeholder.end ?? "DD/MM/AAAA")}</span>
      ) : (
        <input
          type="text"
          inputMode="numeric"
          disabled={disabled}
          placeholder={placeholder.end ?? "DD/MM/AAAA"}
          value={endDraft}
          onChange={(e) => onEndChange(maskDdmmyyyy(e.target.value))}
          onBlur={onEndCommit}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onEndCommit();
            }
          }}
          maxLength={10}
          aria-label="Fecha de fin"
          style={inputStyle}
        />
      )}
    </div>
  );
}

/**
 * Organismo / DateRangePicker.
 *
 * Trigger dual editable (start > end) + calendar popup con selección por rango.
 * `months={1}` = single month, `months={2}` = dos meses lado a lado.
 *
 * Inputs aceptan `dd/mm/aaaa` y validan en blur/Enter. Header del mes abre
 * un picker de mes/año con nav de año.
 *
 * Figma: trigger `46128:634`. Usa `color-primary-100` como fill del range
 * y chevrons `brand/primary`.
 */
export function DateRangePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = { start: "DD/MM/AAAA", end: "DD/MM/AAAA" },
  format = defaultFormat,
  weekStartsOnMonday = false,
  months = 1,
  min,
  max,
  disabled = false,
  className,
  style,
  footer,
}: DateRangePickerProps): JSX.Element {
  const [uncontrolled, setUncontrolled] = useState<DateRangeValue>(defaultValue ?? {});
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? (controlledValue ?? {}) : uncontrolled;

  const startDate = useMemo(() => parseIso(value.start), [value.start]);
  const endDate = useMemo(() => parseIso(value.end), [value.end]);

  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<Date | null>(null);
  const [cursor, setCursor] = useState(() => startDate ?? new Date());
  const [startDraft, setStartDraft] = useState(startDate ? format(startDate) : "");
  const [endDraft, setEndDraft] = useState(endDate ? format(endDate) : "");
  const rootRef = useRef<HTMLDivElement>(null);

  // Mantener los drafts sincronizados con value externo.
  useEffect(() => {
    setStartDraft(startDate ? format(startDate) : "");
  }, [value.start, format, startDate]);
  useEffect(() => {
    setEndDraft(endDate ? format(endDate) : "");
  }, [value.end, format, endDate]);

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

  function emit(next: DateRangeValue) {
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
  }

  function withinBounds(d: Date): boolean {
    if (minDate && d < minDate) return false;
    if (maxDate && d > maxDate) return false;
    return true;
  }

  function handlePick(d: Date) {
    if (!startDate || (startDate && endDate)) {
      emit({ start: toIso(d) });
      setHover(null);
      return;
    }
    if (d < startDate) {
      emit({ start: toIso(d), end: toIso(startDate) });
    } else {
      emit({ start: toIso(startDate), end: toIso(d) });
    }
    setHover(null);
    setOpen(false);
  }

  function commitStartDraft() {
    if (startDraft === "") {
      if (value.start !== undefined) emit({ ...(value.end !== undefined ? { end: value.end } : {}) });
      return;
    }
    const parsed = parseDdmmyyyy(startDraft);
    if (!parsed || !withinBounds(parsed)) {
      setStartDraft(startDate ? format(startDate) : "");
      return;
    }
    const next: DateRangeValue = { start: toIso(parsed) };
    if (endDate && parsed <= endDate) next.end = toIso(endDate);
    emit(next);
    setCursor(parsed);
  }

  function commitEndDraft() {
    if (endDraft === "") {
      if (value.end !== undefined) emit({ ...(value.start !== undefined ? { start: value.start } : {}) });
      return;
    }
    const parsed = parseDdmmyyyy(endDraft);
    if (!parsed || !withinBounds(parsed)) {
      setEndDraft(endDate ? format(endDate) : "");
      return;
    }
    if (startDate && parsed < startDate) {
      emit({ start: toIso(parsed), end: toIso(startDate) });
    } else {
      const next: DateRangeValue = { end: toIso(parsed) };
      if (startDate) next.start = toIso(startDate);
      emit(next);
    }
  }

  const leftCursor = cursor;
  const rightCursor = addMonths(cursor, 1);

  return (
    <div ref={rootRef} className={className} style={{ position: "relative", display: "inline-block", ...style }}>
      <Trigger
        startDate={startDate}
        endDate={endDate}
        startDraft={startDraft}
        endDraft={endDraft}
        placeholder={placeholder}
        disabled={disabled}
        readOnly
        format={format}
        onStartChange={setStartDraft}
        onEndChange={setEndDraft}
        onStartCommit={commitStartDraft}
        onEndCommit={commitEndDraft}
        onOpenToggle={() => !disabled && setOpen((p) => !p)}
      />

      {open && (
        <div
          role="dialog"
          aria-label="Seleccionar rango de fechas"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 100,
            width: "fit-content",
            background: token.bg.button,
            border: `${token.borderWidth.default} solid ${token.border.default}`,
            borderRadius: token.radius.l,
            boxShadow: shadowValue.md,
            padding: token.size.l,
            fontFamily: "Nunito, sans-serif",
            display: "flex",
            flexDirection: "column",
            gap: token.size.l,
          }}
        >
          <Trigger
            startDate={startDate}
            endDate={endDate}
            startDraft={startDraft}
            endDraft={endDraft}
            placeholder={placeholder}
            disabled={disabled}
            compact
            fitContent
            format={format}
            onStartChange={setStartDraft}
            onEndChange={setEndDraft}
            onStartCommit={commitStartDraft}
            onEndCommit={commitEndDraft}
            onOpenToggle={() => { /* no-op dentro del popover */ }}
          />

          <div style={{ display: "flex", gap: token.size.xxl, alignItems: "flex-start" }}>
            <MonthGrid
              cursor={leftCursor}
              weekStartsOnMonday={weekStartsOnMonday}
              start={startDate}
              end={endDate}
              hover={hover}
              minDate={minDate}
              maxDate={maxDate}
              onPick={handlePick}
              onHover={setHover}
              onPrev={() => setCursor((c) => addMonths(c, -1))}
              onNext={() => setCursor((c) => addMonths(c, 1))}
              onCursorChange={setCursor}
            />
            {months === 2 && (
              <MonthGrid
                cursor={rightCursor}
                weekStartsOnMonday={weekStartsOnMonday}
                start={startDate}
                end={endDate}
                hover={hover}
                minDate={minDate}
                maxDate={maxDate}
                onPick={handlePick}
                onHover={setHover}
                onPrev={() => setCursor((c) => addMonths(c, -1))}
                onNext={() => setCursor((c) => addMonths(c, 1))}
                onCursorChange={(d) => setCursor(addMonths(d, -1))}
              />
            )}
          </div>

          {footer && (
            <Fragment>
              <div style={{ height: 1, background: token.border.default }} />
              <div style={{ fontFamily: "Nunito, sans-serif", fontSize: 14, color: token.text.secondary }}>{footer}</div>
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
}
