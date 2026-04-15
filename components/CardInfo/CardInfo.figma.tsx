import figma from "@figma/code-connect";
import { CardInfo } from "./CardInfo.tsx";

/**
 * Code Connect para Organismo / Card Info.
 *
 * El CardInfo no tiene variants estructurados en Figma — el contenido (rows)
 * se define por cada instance. Este mapping muestra el patron de uso con 2
 * rows de ejemplo; el dev en Dev Mode ve la estructura y reemplaza los valores.
 */
figma.connect(
  CardInfo,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=44700-96494",
  {
    example: () => (
      <CardInfo>
        <CardInfo.Row label="Razón social" value="BETWARRIOR" />
        <CardInfo.Row label="DNI / CUIT" value="284556437" />
      </CardInfo>
    ),
  },
);
