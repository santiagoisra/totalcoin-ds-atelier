import figma from "@figma/code-connect";
import { Logo } from "./Logo.tsx";

/**
 * Code Connect mapping para Fundacion / Logo.
 *
 * Figma node: 48309-1413 (Logo).
 * Two figma.connect calls because Logo uses a discriminated union on `type`:
 *   - "full": variant color|blanco, optional slogan
 *   - "iso":  variant color|blanco|background, no slogan
 *
 * Update figma.enum keys ("Variante", "Slogan") if actual Figma property
 * names differ.
 */

// Full logo (isotipo + wordmark)
figma.connect(
  Logo,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=48309-1413",
  {
    props: {
      variant: figma.enum("Variante", {
        Color: "color" as const,
        Blanco: "blanco" as const,
      }),
      slogan: figma.boolean("Slogan"),
    },
    example: (props: { variant: "color" | "blanco"; slogan: boolean }) => {
      const { variant, slogan } = props;
      return (
        <Logo
          type="full"
          variant={variant}
          {...(slogan ? { slogan: true } : {})}
        />
      );
    },
  },
);

// Iso logo (isotipo solo)
figma.connect(
  Logo,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=48309-1413",
  {
    props: {
      variant: figma.enum("Variante", {
        Color: "color" as const,
        Blanco: "blanco" as const,
        Background: "background" as const,
      }),
    },
    example: (props: { variant: "color" | "blanco" | "background" }) => {
      const { variant } = props;
      return <Logo type="iso" variant={variant} />;
    },
  },
);
