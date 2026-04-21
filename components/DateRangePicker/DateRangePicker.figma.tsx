import figma from "@figma/code-connect";
import { DateRangePicker } from "./DateRangePicker.tsx";

figma.connect(
  DateRangePicker,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=46128-634",
  {
    example: () => (
      <DateRangePicker
        defaultValue={{ start: "2025-01-02", end: "2025-01-10" }}
        months={1}
      />
    ),
  },
);
