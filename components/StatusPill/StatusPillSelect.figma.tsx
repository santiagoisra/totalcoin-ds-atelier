import figma from "@figma/code-connect";
import { StatusPillSelect } from "./StatusPillSelect.tsx";
import type { Criticality } from "./StatusPill.tsx";

/**
 * Code Connect mapping para Atomo / Status Pill Select.
 *
 * StatusPillSelect es una abstracción de código sobre el mismo componente Figma
 * "Atomo / Status Pill" (47635:1276). Muestra el ejemplo interactivo con dropdown.
 *
 * Reuses the same Criticidad ES→EN label mapping as StatusPill.figma.tsx:
 *   Baja → low, Media → medium, Alta → high, Neutra → neutral.
 *
 * Note: `options` is provided as a representative static array in the example
 * because Figma does not expose array prop instances natively.
 * Four figma.connect calls (one per criticidad variant) to avoid nullish
 * coalescing in the example function (Code Connect AST restriction).
 */

const STATIC_OPTIONS: Array<{ value: Criticality; label: string }> = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "neutral", label: "Neutra" },
];

figma.connect(
  StatusPillSelect,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=47635-1276",
  {
    variant: { Criticidad: "Baja" },
    props: {},
    example: () => (
      <StatusPillSelect
        value="low"
        options={STATIC_OPTIONS}
        onChange={() => {}}
      />
    ),
  },
);

figma.connect(
  StatusPillSelect,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=47635-1276",
  {
    variant: { Criticidad: "Media" },
    props: {},
    example: () => (
      <StatusPillSelect
        value="medium"
        options={STATIC_OPTIONS}
        onChange={() => {}}
      />
    ),
  },
);

figma.connect(
  StatusPillSelect,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=47635-1276",
  {
    variant: { Criticidad: "Alta" },
    props: {},
    example: () => (
      <StatusPillSelect
        value="high"
        options={STATIC_OPTIONS}
        onChange={() => {}}
      />
    ),
  },
);

figma.connect(
  StatusPillSelect,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=47635-1276",
  {
    variant: { Criticidad: "Neutra" },
    props: {},
    example: () => (
      <StatusPillSelect
        value="neutral"
        options={STATIC_OPTIONS}
        onChange={() => {}}
      />
    ),
  },
);
