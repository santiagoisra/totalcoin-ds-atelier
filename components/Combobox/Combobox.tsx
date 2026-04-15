import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { token } from "../tokens.ts";

export interface ComboboxOption {
  value: string;
  label: ReactNode;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  /** Controlled value. */
  value?: string;
  /** Uncontrolled default. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Molecula / desplegable con busqueda.
 *
 * Figma: master `47565:1702`. Trigger (caja de texto con chevron) + panel
 * desplegable con campo de busqueda y lista filtrada.
 *
 * Implementacion:
 * - Controlled/uncontrolled via `value` / `defaultValue`.
 * - Filter client-side — el consumidor puede precomputar el dataset.
 * - Click fuera + ESC cierran el panel.
 * - Accesible: role="combobox"/"listbox"/"option", aria-expanded, aria-selected.
 */
export function Combobox({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = "Seleccione una opción",
  searchPlaceholder = "Filtrar por nombre...",
  disabled = false,
  ariaLabel,
  className,
  style,
}: ComboboxProps): JSX.Element {
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [uncontrolled, setUncontrolled] = useState<string | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : uncontrolled;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = options.find((o) => o.value === selectedValue);
  const filtered = search
    ? options.filter((o) =>
        String(o.label).toLowerCase().includes(search.toLowerCase()) ||
        o.value.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  useEffect(() => {
    if (!open) return;

    function handleOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    requestAnimationFrame(() => searchRef.current?.focus());
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function commit(next: string) {
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
    setOpen(false);
    setSearch("");
  }

  return (
    <div
      ref={rootRef}
      className={className}
      style={{ position: "relative", width: 361, ...style }}
    >
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${uid}-listbox`}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
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
          color: selectedOption ? token.text.primary : token.text.secondary,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          textAlign: "left",
        }}
      >
        <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke={token.icon.primary}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 160ms ease",
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          id={`${uid}-listbox`}
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 100,
            background: token.bg.surface,
            border: `${token.borderWidth.default} solid ${token.border.default}`,
            borderRadius: token.radius.md,
            padding: 10,
            display: "flex",
            flexDirection: "column",
            gap: token.size.s,
            maxHeight: 240,
            overflow: "hidden",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: `${token.size.md} ${token.size.s}`,
              background: token.bg.app,
              border: `${token.borderWidth.default} solid ${token.brand.primaryLight}`,
              borderRadius: token.radius.s,
            }}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke={token.text.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                outline: "none",
                background: "transparent",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 500,
                fontSize: 14,
                color: token.text.primary,
                padding: 0,
              }}
            />
          </label>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {filtered.length === 0 && (
              <li
                style={{
                  padding: token.size.s,
                  fontFamily: "Nunito, sans-serif",
                  fontSize: 14,
                  color: token.text.tertiary,
                  textAlign: "center",
                }}
              >
                Sin resultados
              </li>
            )}
            {filtered.map((opt, i) => {
              const isSelected = opt.value === selectedValue;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => commit(opt.value)}
                  style={{
                    padding: token.size.s,
                    borderTop: i === 0 ? undefined : `${token.borderWidth.default} solid ${token.border.default}`,
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    color: isSelected ? token.brand.primary : token.text.secondary,
                    cursor: "pointer",
                    borderRadius: token.radius.s,
                    transition: "background-color 100ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = token.bg.input)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
