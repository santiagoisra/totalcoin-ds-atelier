import figma from "@figma/code-connect";
import { ButtonIcon } from "./ButtonIcon.tsx";

/**
 * Code Connect mapping para Molecula / Boton Unico Simple.
 * Master: 46290:673. Sin variantes — solo la instancia de icono swappeable
 * ("Edit Icon"), que se mapea al prop `icon`.
 */
figma.connect(
  ButtonIcon,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=46290-673",
  {
    props: {
      icon: figma.children("Edit Icon"),
    },
    example: ({ icon }) => <ButtonIcon icon={icon} aria-label="Editar" />,
  },
);
