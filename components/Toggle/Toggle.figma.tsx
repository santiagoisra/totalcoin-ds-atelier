import figma from "@figma/code-connect";
import { Toggle } from "./Toggle.tsx";

figma.connect(
  Toggle,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=1451-7678",
  {
    props: {
      checked: figma.boolean("encendido"),
    },
    example: ({ checked }) => <Toggle checked={checked} />,
  },
);
