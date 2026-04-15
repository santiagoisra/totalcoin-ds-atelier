import figma from "@figma/code-connect";
import { TextField } from "./TextField.tsx";

/**
 * Code Connect para Atomo / Caja de texto.
 * Master node: 44938:74026 (frame padre 44959:74139 contiene las 19 variantes).
 *
 * Props Figma -> React:
 *   label: boolean    -> label?: ReactNode
 *   sublabel: boolean -> sublabel?: ReactNode
 *   borde: boolean    -> border: boolean
 *   icono: boolean    -> rightIcon?: ReactNode (chevron por default)
 *   selected: boolean -> selected: boolean
 *   url: boolean      -> NO mapeado (caso especializado, ver README)
 */
figma.connect(
  TextField,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=44938-74026",
  {
    props: {
      label: figma.boolean("label", { true: "Texto de la caja", false: undefined }),
      sublabel: figma.boolean("sublabel", { true: "Subtexto de la caja", false: undefined }),
      border: figma.boolean("borde"),
      selected: figma.boolean("selected"),
      rightIcon: figma.boolean("icono", { true: <span />, false: undefined }),
    },
    example: ({ label, sublabel, border, selected, rightIcon }) => (
      <TextField
        label={label}
        sublabel={sublabel}
        border={border}
        selected={selected}
        rightIcon={rightIcon}
        placeholder="Caja de texto"
      />
    ),
  },
);
