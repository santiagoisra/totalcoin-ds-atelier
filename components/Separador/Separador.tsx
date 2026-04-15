import type { CSSProperties, ReactNode } from "react";
import { token } from "../tokens.ts";

export interface SeparadorProps {
  /**
   * Si se provee, el separador se corta al medio y muestra el label centrado.
   * Mapea a la variante Figma `texto = "Sí"`. Si se omite, corresponde a
   * `texto = "No"` (linea continua sin texto).
   */
  text?: ReactNode;

  /**
   * Padding vertical (eje y). Default: `size.s` = 8px a cada lado (16px total).
   * Figma usa py-[10px]. Mantenemos token por coherencia del DS; si el drift
   * visual molesta, cambiar a un token nuevo `size.separadorGap = 10px` o
   * ajustar la escala.
   */
  gap?: keyof typeof token.size;

  className?: string;
  style?: CSSProperties;
}

/**
 * Atomo / Separador.
 *
 * Linea horizontal divisora con opcional label centrado.
 *
 * Figma: https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9 nodeId 256:685
 * (el master component; 45689:20843 es una instance).
 *
 * Nota de diseno: Figma lo implementa como imagen raster (PNG de una linea).
 * En codigo lo resolvemos con `border-top`, lo cual renderiza identico pero
 * escala sin perder resolucion y respeta el token de color.
 */
export function Separador({
  text,
  gap = "s",
  className,
  style,
}: SeparadorProps): JSX.Element {
  const paddingY = token.size[gap];

  const baseStyle: CSSProperties = {
    paddingTop: paddingY,
    paddingBottom: paddingY,
    width: "100%",
    ...style,
  };

  if (!text) {
    return (
      <div className={className} style={baseStyle} role="separator" aria-orientation="horizontal">
        <div
          style={{
            height: 0,
            borderTop: `${token.borderWidth.default} solid ${token.border.default}`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        ...baseStyle,
        display: "flex",
        alignItems: "center",
        gap: token.size.md,
      }}
      role="separator"
      aria-orientation="horizontal"
    >
      <div
        aria-hidden="true"
        style={{
          flex: 1,
          height: 0,
          borderTop: `${token.borderWidth.default} solid ${token.border.default}`,
        }}
      />
      <span
        style={{
          color: token.text.secondary,
          fontFamily: "Nunito, sans-serif",
          fontSize: "12px",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
      <div
        aria-hidden="true"
        style={{
          flex: 1,
          height: 0,
          borderTop: `${token.borderWidth.default} solid ${token.border.default}`,
        }}
      />
    </div>
  );
}
