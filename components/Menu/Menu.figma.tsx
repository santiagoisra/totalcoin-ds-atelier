import figma from "@figma/code-connect";
import { Menu } from "./Menu.tsx";

/**
 * NOTA: "Organismo / Menu" (47046:1446) del DS de TotalCoin en Figma es en realidad
 * el sidebar nav de la app. Este Menu React es un dropdown generico (patron Radix).
 *
 * No mapeamos directamente al nodo de Figma porque son cosas distintas —
 * pendiente crear un componente SidebarNav separado para mappear 47046:1446.
 */
figma.connect(
  Menu,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=47046-1446",
  {
    example: () => (
      <Menu
        trigger={<button type="button">Abrir menú</button>}
        items={[
          { label: "Editar", value: "edit" },
          { label: "Duplicar", value: "duplicate" },
          { label: "Eliminar", value: "delete", destructive: true },
        ]}
        onSelect={(v) => console.log(v)}
      />
    ),
  },
);
