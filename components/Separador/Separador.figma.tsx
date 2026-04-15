import figma from "@figma/code-connect";
import { Separador } from "./Separador.tsx";

/**
 * Code Connect mapping para Atomo / Separador.
 *
 * Mapea el component de Figma (master 256:685) a la referencia React.
 * La variante `texto` en Figma tiene dos valores: "No" (linea sola) y
 * "Sí" (linea con texto centrado). Los mapeamos a la prop `text` de React:
 * - "No" -> undefined
 * - "Sí" -> un string de ejemplo (el consumidor real pasa el suyo)
 */
figma.connect(Separador, "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=256-685", {
  props: {
    text: figma.enum("texto", {
      No: undefined,
      Sí: "Etiqueta",
    }),
  },
  example: ({ text }) => <Separador text={text} />,
});
