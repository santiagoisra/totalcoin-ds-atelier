import figma from "@figma/code-connect";
import { Tabla } from "./Tabla.tsx";

figma.connect(
  Tabla,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=46088-1379",
  {
    example: () => (
      <Tabla
        columns={[
          { key: "id", header: "ID", width: "60px" },
          { key: "name", header: "Nombre" },
          { key: "amount", header: "Monto", align: "right" },
        ]}
        data={[
          { id: 1, name: "Juan Perez", amount: "$ 1.230" },
          { id: 2, name: "Maria Garcia", amount: "$ 4.500" },
        ]}
      />
    ),
  },
);
