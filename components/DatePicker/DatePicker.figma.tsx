import figma from "@figma/code-connect";
import { DatePicker } from "./DatePicker.tsx";

figma.connect(
  DatePicker,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=47208-1029",
  {
    example: () => <DatePicker placeholder="Seleccioná una fecha" />,
  },
);
