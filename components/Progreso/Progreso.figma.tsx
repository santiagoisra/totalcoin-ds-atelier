import figma from "@figma/code-connect";
import { Progreso } from "./Progreso.tsx";

figma.connect(
  Progreso,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=47239-1101",
  {
    props: {
      value: figma.enum("progress", {
        "0": 0,
        "10": 10,
        "25": 25,
        "33": 33,
        "50": 50,
        "66": 66,
        "75": 75,
        "90": 90,
        "100": 100,
      }),
    },
    example: ({ value }) => <Progreso value={value} />,
  },
);
