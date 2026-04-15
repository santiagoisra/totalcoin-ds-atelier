import figma from "@figma/code-connect";
import { Spinner } from "./Spinner.tsx";

/**
 * Code Connect mapping para Atomo / Spinner.
 * Master node: 47558:1236. No tiene variantes en Figma.
 */
figma.connect(Spinner, "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=47558-1236", {
  example: () => <Spinner />,
});
