import figma from "@figma/code-connect";
import { StatusPill } from "./StatusPill.tsx";

/**
 * Code Connect mapping para Atomo / Status Pill.
 * Master: 47635:1276.
 *
 * 4 criticidades x 2 (con/sin icono) = 8 variantes. Figma usa spanish labels,
 * mapeamos a ingles en el codigo:
 *   Baja -> low, Media -> medium, Alta -> high, Neutra -> neutral.
 *
 * La prop `icon` de Figma es enum "True"/"False". La mapeamos a un ReactNode
 * (un placeholder cuando "True", undefined cuando "False") para que Dev Mode
 * muestre el patron real.
 */
figma.connect(StatusPill, "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=47635-1276", {
  props: {
    level: figma.enum("Criticidad", {
      Baja: "low",
      Media: "medium",
      Alta: "high",
      Neutra: "neutral",
    }),
    icon: figma.enum("Icon", {
      True: <span />,
      False: undefined,
    }),
  },
  example: ({ level, icon }) => (
    <StatusPill level={level} icon={icon}>
      Label
    </StatusPill>
  ),
});
