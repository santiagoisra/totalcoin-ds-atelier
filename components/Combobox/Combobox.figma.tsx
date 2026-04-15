import figma from "@figma/code-connect";
import { Combobox } from "./Combobox.tsx";

figma.connect(
  Combobox,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=47565-1702",
  {
    example: () => (
      <Combobox
        options={[
          { value: "1", label: "Opción del filtro 1" },
          { value: "2", label: "Opción del filtro 2" },
          { value: "3", label: "Opción del filtro 3" },
        ]}
      />
    ),
  },
);
