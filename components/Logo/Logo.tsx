import type { CSSProperties } from "react";

type LogoBase = {
  /** Altura en px. El ancho se ajusta automaticamente por el viewBox del SVG. Default 40. */
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Texto alt para accesibilidad. Default "totalcoin". */
  alt?: string;
};

type FullLogoProps = LogoBase & {
  /** "full" = logotipo completo (isotipo + wordmark). Default. */
  type?: "full";
  /** "color" (institucional) | "blanco" (sobre fondos oscuros). Default "color". */
  variant?: "color" | "blanco";
  /** Muestra la bajada institucional debajo del wordmark. */
  slogan?: boolean;
};

type IsoLogoProps = LogoBase & {
  /** "iso" = solo el isotipo (simbolo sin wordmark). */
  type: "iso";
  /** "color" | "blanco" | "background" (icono con fondo azul). Default "color". */
  variant?: "color" | "blanco" | "background";
  /** No aplica en iso. */
  slogan?: never;
};

export type LogoProps = FullLogoProps | IsoLogoProps;

const LOGO_SRC: Record<string, string> = {
  "full-color": "/logos/logo-color-full.svg",
  "full-color-slogan": "/logos/logo-color-full-slogan.svg",
  "full-blanco": "/logos/logo-blanco-full.svg",
  "full-blanco-slogan": "/logos/logo-blanco-full-slogan.svg",
  "iso-color": "/logos/logo-color-iso.svg",
  "iso-blanco": "/logos/logo-blanco-iso.svg",
  "iso-background": "/logos/logo-iso-background.svg",
};

/**
 * Componente oficial para renderizar el logo de totalcoin.
 *
 * Combinaciones validas:
 * - `<Logo />`                                    full color sin slogan
 * - `<Logo variant="blanco" />`                   full blanco sin slogan
 * - `<Logo slogan />`                             full color con slogan
 * - `<Logo variant="blanco" slogan />`            full blanco con slogan
 * - `<Logo type="iso" />`                         isotipo color
 * - `<Logo type="iso" variant="blanco" />`        isotipo blanco
 * - `<Logo type="iso" variant="background" />`    isotipo con fondo
 *
 * TypeScript bloquea combinaciones invalidas:
 * - `<Logo type="iso" slogan />`                    ERROR (iso no tiene slogan)
 * - `<Logo variant="background" />`                 ERROR (background solo en iso)
 */
export function Logo(props: LogoProps): JSX.Element {
  const { size = 40, className, style, alt = "totalcoin" } = props;
  const type = props.type ?? "full";
  const variant = props.variant ?? "color";

  const key =
    type === "iso"
      ? `iso-${variant}`
      : `full-${variant}${(props as FullLogoProps).slogan ? "-slogan" : ""}`;

  const src = LOGO_SRC[key];

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ display: "block", height: size, width: "auto", ...style }}
    />
  );
}
