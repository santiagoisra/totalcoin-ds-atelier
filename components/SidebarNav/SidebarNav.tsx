import { useState, type CSSProperties, type ReactNode } from "react";
import { token } from "../tokens.ts";
import { Icon, type IconName } from "../Icon/Icon.tsx";

export interface SidebarNavItem {
  label: ReactNode;
  icon?: IconName | ReactNode;
  value?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface SidebarNavSection {
  title?: ReactNode;
  items: SidebarNavItem[];
}

export interface SidebarNavProps {
  /** Contenido del header — tipicamente logo. */
  header?: ReactNode;
  /** Selector contextual opcional (ej. Empresa picker). */
  contextSelector?: ReactNode;
  sections: SidebarNavSection[];
  /** Footer — tipicamente perfil + toggle collapse. */
  footer?: ReactNode;
  /** Collapsed state controlled. Si se omite, uncontrolled con toggle interno. */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Organismo / SidebarNav.
 *
 * Patron del "Organismo / Menu" del DS de TotalCoin (node 47046:1446) —
 * sidebar de navegacion de la app, con logo, selector empresa, secciones de
 * links, profile, y boton de collapse.
 *
 * Generico: el consumidor aporta los items + sections + header/footer.
 * Soporta estado `collapsed` (bar compact 80px vs extendida 280px).
 */
export function SidebarNav({
  header,
  contextSelector,
  sections,
  footer,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  className,
  style,
}: SidebarNavProps): JSX.Element {
  const [uncontrolled, setUncontrolled] = useState(false);
  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed : uncontrolled;

  function toggleCollapsed() {
    const next = !collapsed;
    if (!isControlled) setUncontrolled(next);
    onCollapsedChange?.(next);
  }

  const width = collapsed ? 80 : 280;

  return (
    <aside
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width,
        height: "100%",
        padding: `${token.size.xxl} ${token.size.l} ${token.size.md}`,
        background: token.bg.button,
        fontFamily: "Nunito, sans-serif",
        transition: "width 180ms ease",
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: token.size.xl }}>
        {header && <div style={{ height: 49 }}>{header}</div>}

        {contextSelector && (
          <div style={{ display: "flex", flexDirection: "column", gap: token.size.md, opacity: collapsed ? 0 : 1, transition: "opacity 160ms ease", pointerEvents: collapsed ? "none" : "auto" }}>
            {contextSelector}
          </div>
        )}

        <nav style={{ display: "flex", flexDirection: "column", gap: token.size.xl }}>
          {sections.map((section, si) => (
            <div key={si} style={{ display: "flex", flexDirection: "column", gap: token.size.md }}>
              {section.title && !collapsed && (
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: token.text.secondary,
                  }}
                >
                  {section.title}
                </div>
              )}
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
                {section.items.map((item, ii) => (
                  <li key={ii}>
                    <button
                      type="button"
                      onClick={item.onClick}
                      aria-current={item.active ? "page" : undefined}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                        width: "100%",
                        height: 52,
                        padding: `0 ${token.size.xl}`,
                        background: item.active ? token.bg.input : "transparent",
                        border: "none",
                        borderRadius: token.radius.md,
                        fontFamily: "inherit",
                        fontWeight: 600,
                        fontSize: 16,
                        color: token.text.primary,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background-color 120ms ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!item.active) e.currentTarget.style.backgroundColor = token.bg.surface;
                      }}
                      onMouseLeave={(e) => {
                        if (!item.active) e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {item.icon !== undefined && (
                        <span style={{ flexShrink: 0, display: "inline-flex", width: 26, height: 26 }}>
                          {typeof item.icon === "string" ? <Icon name={item.icon as IconName} size={26} /> : item.icon}
                        </span>
                      )}
                      {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: token.size.xxl }}>
        {footer}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          style={{
            alignSelf: collapsed ? "center" : "flex-end",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: token.border.default,
            border: `1px solid ${token.bg.button}`,
            color: token.bg.button,
            cursor: "pointer",
          }}
        >
          <Icon name={collapsed ? "chevron-right" : "chevron-left"} size={18} />
        </button>
      </div>
    </aside>
  );
}
