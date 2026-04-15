import figma from "@figma/code-connect";
import { Icon } from "./Icon.tsx";

/**
 * Code Connect para la familia Icon / *.
 *
 * NOTA: el DS de TotalCoin tiene ~175 iconos en Figma, cada uno un master
 * component separado (Icon / Check, Icon / Close, Icon / ChevronDown, etc.).
 * No los mapeamos uno por uno — eso requeriria ~175 figma.connect calls.
 *
 * Este mapping apunta a un nodo representativo (Icon / Check) como anchor.
 * Los devs que necesiten el icono especifico usan `name` con el valor
 * correspondiente (ver `components/Icon/icons.ts` para la lista completa).
 */
figma.connect(
  Icon,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=Icon-Check",
  {
    example: () => <Icon name="check" size={24} />,
  },
);
