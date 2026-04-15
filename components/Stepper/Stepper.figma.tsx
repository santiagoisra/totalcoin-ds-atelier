import figma from "@figma/code-connect";
import { Stepper } from "./Stepper.tsx";

figma.connect(
  Stepper,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=43856-68600",
  {
    props: {
      steps: figma.enum("cantidad", {
        "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
      }),
    },
    example: ({ steps }) => <Stepper steps={steps} current={2} />,
  },
);
