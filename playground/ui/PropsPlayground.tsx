import { useState, type ReactNode } from "react";
import { CodeSnippet } from "./CodeSnippet.tsx";

export type ControlType =
  | { type: "enum"; options: readonly string[]; default: string }
  | { type: "boolean"; default: boolean }
  | { type: "string"; default: string; placeholder?: string }
  | { type: "number"; default: number; min?: number; max?: number; step?: number };

export type ControlsConfig = Record<string, ControlType>;

type ValueFor<C extends ControlType> =
  C extends { type: "enum" } ? string
  : C extends { type: "boolean" } ? boolean
  : C extends { type: "string" } ? string
  : C extends { type: "number" } ? number
  : never;

export type Values<C extends ControlsConfig> = { [K in keyof C]: ValueFor<C[K]> };

export interface PropsPlaygroundProps<C extends ControlsConfig> {
  controls: C;
  preview: (values: Values<C>) => ReactNode;
  /** Genera el snippet de codigo (React) — se refresca al cambiar controls. */
  codeFor: (values: Values<C>) => string;
  previewMinHeight?: number;
}

function initialValues<C extends ControlsConfig>(controls: C): Values<C> {
  const out = {} as Values<C>;
  for (const k in controls) {
    (out as Record<string, unknown>)[k] = controls[k].default;
  }
  return out;
}

/**
 * Playground de props interactivo tipo Storybook Controls.
 *
 * Renderiza panel de controles + preview live + code snippet actualizable.
 * Cada control mapea a una prop del componente previsualizado.
 */
export function PropsPlayground<C extends ControlsConfig>({
  controls,
  preview,
  codeFor,
  previewMinHeight = 120,
}: PropsPlaygroundProps<C>): JSX.Element {
  const [values, setValues] = useState<Values<C>>(() => initialValues(controls));

  function set<K extends keyof C>(key: K, val: ValueFor<C[K]>) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function reset() {
    setValues(initialValues(controls));
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: previewMinHeight,
            padding: 24,
            background: "var(--pg-canvas)",
            border: "1px solid var(--pg-card-border)",
            borderRadius: 12,
          }}
        >
          {preview(values)}
        </div>
        <CodeSnippet code={codeFor(values)} language="tsx" />
      </div>

      <aside
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 16,
          background: "var(--pg-canvas)",
          border: "1px solid var(--pg-card-border)",
          borderRadius: 12,
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--pg-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Controls
          </span>
          <button
            type="button"
            onClick={reset}
            style={{ border: "1px solid var(--pg-card-border)", background: "var(--pg-card-bg)", color: "var(--pg-text)", borderRadius: 6, padding: "2px 8px", fontFamily: "inherit", fontSize: 11, cursor: "pointer" }}
          >
            Reset
          </button>
        </div>
        {Object.entries(controls).map(([key, ctrl]) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label htmlFor={`ctrl-${key}`} style={{ fontSize: 12, fontWeight: 500, color: "var(--pg-text)" }}>
              {key}
            </label>
            <ControlInput
              id={`ctrl-${key}`}
              control={ctrl}
              value={(values as Record<string, unknown>)[key]}
              onChange={(v) => set(key as keyof C, v as ValueFor<C[keyof C]>)}
            />
          </div>
        ))}
      </aside>
    </div>
  );
}

function ControlInput({
  id,
  control,
  value,
  onChange,
}: {
  id: string;
  control: ControlType;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const baseStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px 10px",
    background: "var(--pg-card-bg)",
    border: "1px solid var(--pg-card-border)",
    borderRadius: 6,
    fontFamily: "Inter, sans-serif",
    fontSize: 13,
    color: "var(--pg-text)",
    outline: "none",
    boxSizing: "border-box",
  };

  if (control.type === "enum") {
    return (
      <select id={id} value={value as string} onChange={(e) => onChange(e.target.value)} style={baseStyle}>
        {control.options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }
  if (control.type === "boolean") {
    return (
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input
          id={id}
          type="checkbox"
          checked={value as boolean}
          onChange={(e) => onChange(e.target.checked)}
          style={{ accentColor: "#003e70", width: 16, height: 16 }}
        />
        <span style={{ fontSize: 13, color: "var(--pg-text)" }}>{value ? "true" : "false"}</span>
      </label>
    );
  }
  if (control.type === "number") {
    return (
      <input
        id={id}
        type="number"
        value={value as number}
        min={control.min}
        max={control.max}
        step={control.step}
        onChange={(e) => onChange(Number(e.target.value))}
        style={baseStyle}
      />
    );
  }
  return (
    <input
      id={id}
      type="text"
      value={value as string}
      placeholder={control.placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={baseStyle}
    />
  );
}
