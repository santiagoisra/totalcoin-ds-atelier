import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { ThemeProvider } from "../components/ThemeProvider/ThemeProvider.tsx";
import { PasswordGate } from "./ui/PasswordGate.tsx";
import "./ui/shiki-overrides.css";
import "./ui/theme.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("#root not found");
createRoot(rootEl).render(
  <StrictMode>
    <PasswordGate>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </PasswordGate>
  </StrictMode>,
);
