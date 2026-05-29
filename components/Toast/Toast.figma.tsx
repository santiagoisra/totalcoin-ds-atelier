import figma from "@figma/code-connect";
import { Toast } from "./Toast.tsx";

/**
 * Code Connect mapping para Organismo / Toast (Aviso).
 * Master: 46552:1093.
 *
 * Dos variantes principales:
 *   - Con botones (actions): `Con botones` = True → acciones cancelar + confirmar
 *   - Sin botones: `Con botones` = False → solo título, descripción y X
 *
 * `onClose` se mapea desde el boton de cierre (True/False).
 */

// Toast sin botones
figma.connect(Toast, "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=46552-1093", {
  variant: { "Con botones": "False" },
  props: {
    title: figma.string("Título"),
    description: figma.string("Descripción"),
  },
  example: ({ title, description }) => (
    <Toast
      title={title}
      description={description}
      onClose={() => {}}
    />
  ),
});

// Toast con botones
figma.connect(Toast, "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=46552-1093", {
  variant: { "Con botones": "True" },
  props: {
    title: figma.string("Título"),
    description: figma.string("Descripción"),
  },
  example: ({ title, description }) => (
    <Toast
      title={title}
      description={description}
      onClose={() => {}}
      actions={{
        cancel: { label: "Cancelar", onClick: () => {} },
        confirm: { label: "Confirmar", onClick: () => {} },
      }}
    />
  ),
});
