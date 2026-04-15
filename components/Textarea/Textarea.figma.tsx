import figma from "@figma/code-connect";
import { Textarea } from "./Textarea.tsx";

/**
 * Code Connect para Atomo / Textarea.
 * Master: 47277:3018. 7 estados × 2 roundness = 14 variantes.
 *
 * Los estados Focus y Error Focus son runtime en React (:focus/:active via
 * onFocus/onBlur con useState). Code Connect los mapea a props para preview
 * pero en uso real React los maneja solo cuando el user enfoca.
 *
 * Para el preview en Dev Mode, Focus -> autoFocus, Error -> error=true.
 */
figma.connect(
  Textarea,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=47277-3018",
  {
    props: {
      roundness: figma.enum("roundness", {
        Default: "default",
        Round: "round",
      }),
      resizable: figma.boolean("show resizable"),
      error: figma.enum("state", {
        Empty: false,
        Placeholder: false,
        Value: false,
        Focus: false,
        Error: true,
        "Error Focus": true,
        Disabled: false,
      }),
      disabled: figma.enum("state", {
        Empty: false,
        Placeholder: false,
        Value: false,
        Focus: false,
        Error: false,
        "Error Focus": false,
        Disabled: true,
      }),
      autoFocus: figma.enum("state", {
        Empty: false,
        Placeholder: false,
        Value: false,
        Focus: true,
        Error: false,
        "Error Focus": true,
        Disabled: false,
      }),
      defaultValue: figma.enum("state", {
        Empty: undefined,
        Placeholder: undefined,
        Value: "Valor",
        Focus: undefined,
        Error: "Valor",
        "Error Focus": "Valor",
        Disabled: undefined,
      }),
      placeholder: figma.enum("state", {
        Placeholder: "Escribí tu mensaje acá.",
        Empty: undefined,
        Value: undefined,
        Focus: undefined,
        Error: undefined,
        "Error Focus": undefined,
        Disabled: undefined,
      }),
    },
    example: ({ roundness, resizable, error, disabled, autoFocus, defaultValue, placeholder }) => (
      <Textarea
        roundness={roundness}
        resizable={resizable}
        error={error}
        disabled={disabled}
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    ),
  },
);
