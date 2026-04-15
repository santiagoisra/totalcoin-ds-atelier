import figma from "@figma/code-connect";
import { Alerta } from "./Alerta.tsx";

figma.connect(
  Alerta,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=4041-21616",
  {
    props: {
      color: figma.enum("color", {
        Naranja: "warning",
        Verde: "success",
        Rojo: "error",
        Azul: "info",
      }),
      showLeftIcon: figma.boolean("icono izquierdo"),
      rightIcon: figma.boolean("icono derecho", {
        true: <span />,
        false: undefined,
      }),
      rightLabel: figma.boolean("icono texto", {
        true: "Solicitar",
        false: undefined,
      }),
    },
    example: ({ color, showLeftIcon, rightIcon, rightLabel }) => (
      <Alerta
        color={color}
        showLeftIcon={showLeftIcon}
        rightIcon={rightIcon}
        rightLabel={rightLabel}
      >
        ¡Ya podes solicitar tu tarjeta prepaga totalcoin sin cargo!
      </Alerta>
    ),
  },
);
