import figma from "@figma/code-connect";
import { CheckBox } from "./CheckBox.tsx";

/**
 * Code Connect mapping para Atomo / Check box.
 * Master: 18911:41938. Variante Figma `Cheked` (typo preservado).
 */
figma.connect(CheckBox, "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=18911-41938", {
  props: {
    checked: figma.boolean("Cheked"),
  },
  example: ({ checked }) => <CheckBox checked={checked} />,
});
