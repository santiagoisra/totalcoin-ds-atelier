import figma from "@figma/code-connect";
import { Tooltip } from "./Tooltip.tsx";

figma.connect(
  Tooltip,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=17647-46074",
  {
    props: {
      arrowAlign: figma.enum("posicion", {
        Derecha: "end",
        Izquierda: "start",
      }),
    },
    example: ({ arrowAlign }) => (
      <Tooltip arrowAlign={arrowAlign}>Este es un tooltip simple</Tooltip>
    ),
  },
);
