import figma from "@figma/code-connect";
import { Modal } from "./Modal.tsx";

figma.connect(
  Modal,
  "https://www.figma.com/design/y3zmw15iLpdpYwLKSMCpP9/?node-id=47279-1608",
  {
    example: () => (
      <Modal open onClose={() => {}} title="Ingresá el PIN">
        <p>Ingresá tu PIN para entrar a la mesa</p>
      </Modal>
    ),
  },
);
