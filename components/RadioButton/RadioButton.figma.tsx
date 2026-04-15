import figma from "@figma/code-connect";
import { RadioButton } from "./RadioButton.tsx";

figma.connect(
  RadioButton,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=397-957",
  {
    props: {
      // Figma preserva el typo "Cheked" en una variante similar al CheckBox,
      // pero en RadioButton la prop es "chekeado" (dos palabras). Verificado
      // via design context — la variable local es `chekeado: boolean`.
      checked: figma.boolean("chekeado"),
      disabled: figma.boolean("enabled", { true: false, false: true }),
    },
    example: ({ checked, disabled }) => <RadioButton checked={checked} disabled={disabled} />,
  },
);
