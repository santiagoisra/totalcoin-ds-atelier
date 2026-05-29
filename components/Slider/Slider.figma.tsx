import figma from "@figma/code-connect";
import { Slider } from "./Slider.tsx";

/**
 * Code Connect mapping para Atomo / Slider.
 *
 * Figma node: 48026-1345 (Molecula / Slider)
 * Update figma.enum keys if the actual Figma property names differ.
 */
figma.connect(
  Slider,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=48026-1345",
  {
    props: {
      disabled: figma.enum("Estado", {
        Activo: false,
        Deshabilitado: true,
      }),
      hasLabel: figma.enum("Etiqueta", {
        True: true,
        False: false,
      }),
    },
    example: (props: { disabled: boolean; hasLabel: boolean }) => {
      const { disabled, hasLabel } = props;
      return (
        <Slider
          value={50}
          min={0}
          max={100}
          disabled={disabled}
          {...(hasLabel ? { label: "Monto" } : {})}
        />
      );
    },
  },
);
