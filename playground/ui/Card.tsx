import type { CSSProperties, ReactNode } from "react";

export interface CardProps {
  title: string;
  subtitle?: string;
  id?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

/**
 * Region card del playground. Patron: titulo grande + subtitulo gris + contenido.
 * Usa playground CSS vars (--pg-*) para light/dark.
 */
export function Card({ title, subtitle, id, children, style }: CardProps) {
  return (
    <section
      id={id}
      style={{
        scrollMarginTop: 24,
        background: "var(--pg-card-bg)",
        border: "1px solid var(--pg-card-border)",
        borderRadius: 16,
        padding: "28px 32px",
        marginBottom: 20,
        boxShadow: "var(--pg-shadow-card)",
        ...style,
      }}
    >
      <h2
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 22,
          fontWeight: 700,
          margin: 0,
          color: "var(--pg-text)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: "var(--pg-text-muted)",
            margin: "6px 0 24px",
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      )}
      <div>{children}</div>
    </section>
  );
}

export interface SubCardProps {
  title?: string;
  children: ReactNode;
  style?: CSSProperties;
}

/** Sub-seccion dentro de un Card. Label chico arriba + contenido. */
export function SubCard({ title, children, style }: SubCardProps) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {title && (
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--pg-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 12,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-start" }}>
        {children}
      </div>
    </div>
  );
}
