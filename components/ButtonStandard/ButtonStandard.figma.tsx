import figma from "@figma/code-connect";
import { ButtonStandard } from "./ButtonStandard.tsx";

/**
 * Code Connect mapping para Molecula / Boton Standard.
 * Master: 3692:17510. 8 estados x 2 tamaños x 2 anchos x 2 rounded x 3 icon
 * positions = ~192 variantes en Figma, todas reducidas a UN componente React
 * con 5 props + 1 children.
 *
 * Mapeo multi-prop desde la misma variante Figma `Estado`:
 *   - `variant` recibe la variante visual (primary, danger, etc.)
 *   - `pressed` es true solo cuando Estado=Apretado
 *   - `disabled` es true solo cuando Estado=Deshabilitado
 */
figma.connect(
  ButtonStandard,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=3692-17510",
  {
    props: {
      variant: figma.enum("Estado", {
        Primario: "primary",
        Apretado: "primary",
        Deshabilitado: "primary",
        Secundario: "secondary",
        Outline: "outline",
        Terciario: "tertiary",
        Danger: "danger",
        DangerOutline: "danger-outline",
      }),
      pressed: figma.enum("Estado", {
        Apretado: true,
        Primario: false,
        Deshabilitado: false,
        Secundario: false,
        Outline: false,
        Terciario: false,
        Danger: false,
        DangerOutline: false,
      }),
      disabled: figma.enum("Estado", {
        Deshabilitado: true,
        Primario: false,
        Apretado: false,
        Secundario: false,
        Outline: false,
        Terciario: false,
        Danger: false,
        DangerOutline: false,
      }),
      size: figma.enum("Tamaño", {
        mediano: "medium",
        chico: "small",
      }),
      width: figma.enum("Ancho", {
        grande: "full",
        chico: "auto",
      }),
      rounded: figma.boolean("borde redondeado"),
      leftIcon: figma.enum("Icono posicion", {
        izquierdo: <span />,
        derecho: undefined,
        False: undefined,
      }),
      rightIcon: figma.enum("Icono posicion", {
        derecho: <span />,
        izquierdo: undefined,
        False: undefined,
      }),
    },
    example: ({ variant, pressed, disabled, size, width, rounded, leftIcon, rightIcon }) => (
      <ButtonStandard
        variant={variant}
        pressed={pressed}
        disabled={disabled}
        size={size}
        width={width}
        rounded={rounded}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
      >
        Boton
      </ButtonStandard>
    ),
  },
);
