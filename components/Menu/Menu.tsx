import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { token, shadowValue } from "../tokens.ts";

export interface MenuItem {
  /** Label visible. */
  label: ReactNode;
  /** Valor devuelto al seleccionar. */
  value?: string;
  /** Icono opcional al izquierdo (16-24 px). */
  icon?: ReactNode;
  /** Handler custom — si se provee, override de onSelect del Menu. */
  onClick?: () => void;
  /** Destructive visual (rojo). */
  destructive?: boolean;
  /** Deshabilitado. */
  disabled?: boolean;
}

export interface MenuProps {
  /** Trigger: cualquier ReactNode clickeable. Normalmente un ButtonStandard o un icon button. */
  trigger: ReactNode;
  items: MenuItem[];
  /** Callback cuando se selecciona un item (si no tiene onClick propio). */
  onSelect?: (value: string | undefined) => void;
  /** Posicion del panel respecto del trigger. */
  align?: "start" | "end";
  /** Ancho minimo del panel en px. */
  minWidth?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Menu dropdown generico (patron Radix/shadcn).
 *
 * NOTA: El "Organismo / Menu" del DS de TotalCoin en Figma en realidad es el
 * SIDEBAR de navegacion de la app (con logo, selector empresa, lista de
 * secciones, profile, collapse). Un sidebar nav completo es un patron distinto
 * del dropdown menu — se modelaria como `SidebarNav` en un futuro commit.
 *
 * Este Menu es el patron generico: trigger clickable + panel flotante con lista
 * de items seleccionables. Util para:
 *   - Menu contextual (click derecho, tres puntos)
 *   - Acciones en una tabla
 *   - Selector de opciones no-input
 */
export function Menu({
  trigger,
  items,
  onSelect,
  align = "start",
  minWidth = 200,
  className,
  style,
}: MenuProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleItemClick(item: MenuItem) {
    if (item.disabled) return;
    item.onClick?.();
    if (!item.onClick) onSelect?.(item.value);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={className} style={{ position: "relative", display: "inline-block", ...style }}>
      <div onClick={() => setOpen((p) => !p)} aria-haspopup="menu" aria-expanded={open} style={{ cursor: "pointer", display: "inline-flex" }}>
        {trigger}
      </div>
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            [align]: 0,
            zIndex: 100,
            minWidth,
            background: token.bg.button,
            border: `${token.borderWidth.default} solid ${token.border.default}`,
            borderRadius: token.radius.md,
            boxShadow: shadowValue.s,
            padding: token.size.xs,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {items.map((item, i) => {
            const color = item.disabled
              ? token.text.tertiary
              : item.destructive
                ? token.feedback.error
                : token.text.primary;
            return (
              <button
                key={i}
                type="button"
                role="menuitem"
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: token.size.s,
                  padding: `${token.size.s} ${token.size.md}`,
                  background: "transparent",
                  border: "none",
                  borderRadius: token.radius.s,
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  color,
                  cursor: item.disabled ? "not-allowed" : "pointer",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  transition: "background-color 100ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!item.disabled) e.currentTarget.style.backgroundColor = token.bg.input;
                }}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {item.icon && (
                  <span aria-hidden="true" style={{ display: "inline-flex", width: 18, height: 18, color }}>
                    {item.icon}
                  </span>
                )}
                <span style={{ flex: 1 }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
