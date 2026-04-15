import type { CSSProperties, ReactNode } from "react";
import { token, shadowValue } from "../tokens.ts";

export interface CardInfoProps {
  /** Rows declarados como data. Coexiste con children (ambos se renderizan). */
  rows?: Array<{ label: ReactNode; value: ReactNode }>;
  /** Children para rows custom (ej. con ReactNodes en el value). */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface CardInfoRowProps {
  label: ReactNode;
  value: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Row de key/value dentro de un CardInfo. Usable como child directo:
 *
 *   <CardInfo>
 *     <CardInfo.Row label="Razón social" value="BETWARRIOR" />
 *     <CardInfo.Row label="DNI / CUIT" value="284556437" />
 *   </CardInfo>
 *
 * Label: Nunito SemiBold 16, brand/primary.
 * Value: Nunito Bold 14, text/secondary.
 */
export function CardInfoRow({
  label,
  value,
  className,
  style,
}: CardInfoRowProps): JSX.Element {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: token.size.s,
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: "Nunito, sans-serif",
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: 1,
          color: token.brand.primary,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "Nunito, sans-serif",
          fontWeight: 700,
          fontSize: "14px",
          lineHeight: 1,
          color: token.text.secondary,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Organismo / Card Info.
 *
 * Figma: master `44700:96494`. Primer organismo del DS — container con
 * shadow-s + border + rows de key/value.
 *
 * Composicion flexible: aceptar `rows` data-driven, `children` manual, o ambos.
 */
function CardInfoRoot({
  rows,
  children,
  className,
  style,
}: CardInfoProps): JSX.Element {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        maxWidth: 420,
        padding: `${token.size.s} ${token.size.md}`,
        background: token.bg.surface,
        border: `${token.borderWidth.default} solid ${token.border.default}`,
        borderRadius: token.radius.s,
        boxShadow: shadowValue.s,
        ...style,
      }}
    >
      {rows?.map((row, i) => (
        <CardInfoRow key={i} label={row.label} value={row.value} />
      ))}
      {children}
    </div>
  );
}

type CardInfoComponent = typeof CardInfoRoot & { Row: typeof CardInfoRow };

export const CardInfo = Object.assign(CardInfoRoot, {
  Row: CardInfoRow,
}) as CardInfoComponent;
