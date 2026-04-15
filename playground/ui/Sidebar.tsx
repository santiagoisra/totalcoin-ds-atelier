import { useMemo, useState, type ReactNode } from "react";
import { useTheme } from "../../components/ThemeProvider/ThemeProvider.tsx";

interface NavItem {
  label: string;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { label: "Overview", href: "overview" },
      { label: "Installation", href: "installation" },
      { label: "Project Structure", href: "structure" },
    ],
  },
  {
    title: "Foundations",
    items: [
      { label: "Colors", href: "foundations-colors" },
      { label: "Typography", href: "foundations-typography" },
      { label: "Spacing & Radius", href: "foundations-spacing" },
      { label: "Shadows", href: "foundations-shadows" },
    ],
  },
  {
    title: "Atomos",
    items: [
      { label: "Icon", href: "icon" },
      { label: "Separador", href: "separador" },
      { label: "Spinner", href: "spinner" },
      { label: "CheckBox", href: "checkbox" },
      { label: "Toggle", href: "toggle" },
      { label: "RadioButton", href: "radiobutton" },
      { label: "StatusPill", href: "statuspill" },
      { label: "Progreso", href: "progreso" },
      { label: "Stepper", href: "stepper" },
    ],
  },
  {
    title: "Moleculas",
    items: [
      { label: "ButtonStandard", href: "buttonstandard" },
      { label: "TextField", href: "textfield" },
      { label: "Textarea", href: "textarea" },
      { label: "Alerta", href: "alerta" },
      { label: "Tooltip", href: "tooltip" },
      { label: "Combobox", href: "combobox" },
      { label: "Menu", href: "menu" },
    ],
  },
  {
    title: "Organismos",
    items: [
      { label: "CardInfo", href: "cardinfo" },
      { label: "Modal", href: "modal" },
      { label: "DatePicker", href: "datepicker" },
      { label: "Tabla", href: "tabla" },
      { label: "SidebarNav", href: "sidebarnav" },
    ],
  },
  {
    title: "Patterns",
    items: [
      { label: "Login screen", href: "pattern-login" },
      { label: "Transactions list", href: "pattern-transactions" },
      { label: "Settings panel", href: "pattern-settings" },
      { label: "Onboarding flow", href: "pattern-onboarding" },
    ],
  },
];

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Cambiar a light mode" : "Cambiar a dark mode"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "10px 12px",
        background: "var(--pg-card-bg)",
        border: "1px solid var(--pg-card-border)",
        borderRadius: 8,
        fontFamily: "Inter, sans-serif",
        fontSize: 12,
        fontWeight: 500,
        color: "var(--pg-text)",
        cursor: "pointer",
        marginBottom: 12,
      }}
    >
      <span>{theme === "dark" ? "🌙 Dark mode" : "☀️ Light mode"}</span>
      <span style={{ fontSize: 10, color: "var(--pg-text-muted)" }}>toggle</span>
    </button>
  );
}

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <span aria-hidden="true" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--pg-text-faint)", pointerEvents: "none" }}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="text"
        placeholder="Buscar componente..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: 34,
          padding: "0 30px 0 30px",
          background: "var(--pg-card-bg)",
          border: "1px solid var(--pg-card-border)",
          borderRadius: 8,
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          color: "var(--pg-text)",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 22, height: 22, border: "none", background: "transparent", color: "var(--pg-text-muted)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
        >
          ×
        </button>
      )}
    </div>
  );
}

export function Sidebar({ children }: { children?: ReactNode }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(NAV_SECTIONS.map((s) => [s.title, true])),
  );
  const [search, setSearch] = useState("");

  function toggle(title: string) {
    setOpenSections((p) => ({ ...p, [title]: !p[title] }));
  }

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return NAV_SECTIONS;
    return NAV_SECTIONS.map((s) => ({
      ...s,
      items: s.items.filter(
        (i) => i.label.toLowerCase().includes(q) || i.href.toLowerCase().includes(q),
      ),
    })).filter((s) => s.items.length > 0);
  }, [search]);

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: 272,
        background: "var(--pg-sidebar-bg)",
        borderRight: "1px solid var(--pg-border)",
        padding: "24px 16px",
        overflowY: "auto",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <a href="#overview" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", textDecoration: "none", marginBottom: 8 }}>
        <img
          src="/totalcoin-isologo.svg"
          alt="TotalCoin"
          width={36}
          height={36}
          style={{ display: "block", flexShrink: 0 }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--pg-text)" }}>TotalCoin DS</span>
          <span style={{ fontSize: 11, color: "var(--pg-text-muted)" }}>Atelier v0.1</span>
        </div>
      </a>

      <SearchInput value={search} onChange={setSearch} />

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {filteredSections.length === 0 && (
          <div style={{ padding: "12px 10px", fontSize: 12, color: "var(--pg-text-muted)", fontStyle: "italic" }}>
            Sin resultados para "{search}"
          </div>
        )}
        {filteredSections.map((section) => {
          const open = search ? true : openSections[section.title];
          return (
            <div key={section.title}>
              <button
                type="button"
                onClick={() => toggle(section.title)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "8px 10px",
                  background: "transparent",
                  border: "none",
                  borderRadius: 6,
                  fontFamily: "inherit",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--pg-text-muted)",
                  cursor: "pointer",
                }}
              >
                <span>{section.title}</span>
                <span style={{ fontSize: 10, color: "var(--pg-text-faint)" }}>{open ? "▾" : "▸"}</span>
              </button>
              {open && (
                <ul style={{ listStyle: "none", padding: 0, margin: "2px 0 10px" }}>
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={`#${item.href}`}
                        style={{
                          display: "block",
                          padding: "6px 10px 6px 20px",
                          borderRadius: 6,
                          textDecoration: "none",
                          fontSize: 13,
                          color: "var(--pg-text-secondary)",
                          fontWeight: 500,
                          transition: "background-color 120ms ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--pg-sidebar-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <ThemeToggle />

      <div style={{ borderTop: "1px solid var(--pg-border)", paddingTop: 12, fontSize: 11, color: "var(--pg-text-muted)" }}>
        21 componentes · 58 iconos · 132 tokens · 4 patterns
      </div>

      {children}
    </aside>
  );
}
