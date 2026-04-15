import type { ReactNode } from "react";

/** Tech stack pill chiquita. Usado en la hero section. */
export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "primary" }) {
  const isPrimary = tone === "primary";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 9999,
        fontFamily: "Inter, sans-serif",
        fontSize: 12,
        fontWeight: 500,
        background: isPrimary ? "#003e70" : "var(--pg-badge-bg)",
        color: isPrimary ? "#fff" : "var(--pg-text)",
        border: `1px solid ${isPrimary ? "#003e70" : "var(--pg-badge-border)"}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
