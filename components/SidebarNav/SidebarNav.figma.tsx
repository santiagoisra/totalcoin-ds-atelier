import figma from "@figma/code-connect";
import { SidebarNav } from "./SidebarNav.tsx";

figma.connect(
  SidebarNav,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=47046-1446",
  {
    props: {
      collapsed: figma.enum("Propiedad 1", {
        extendido: false,
        Contraido: true,
      }),
    },
    example: ({ collapsed }) => (
      <SidebarNav
        collapsed={collapsed}
        sections={[
          {
            title: "Servicios",
            items: [
              { label: "Inicio", icon: "home" },
              { label: "Movimientos", icon: "transfer", active: true },
              { label: "Transferencias", icon: "share" },
            ],
          },
          {
            title: "Administrá",
            items: [
              { label: "Mi comercio", icon: "settings" },
              { label: "Cuentas bancarias", icon: "credit-card" },
            ],
          },
        ]}
      />
    ),
  },
);
