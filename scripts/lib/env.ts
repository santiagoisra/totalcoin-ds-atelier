import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const ENV_FILE = path.join(ROOT, ".env");

const DEFAULT_FILE_KEY = "y3zmw15iLpdpYwLKSMCpP9";

// --------------------------------------------------------------
// .env loader — minimal, sin dependencias externas
// --------------------------------------------------------------

let envLoaded = false;

function loadEnv(): void {
  if (envLoaded) return;

  if (!fs.existsSync(ENV_FILE)) {
    // No hay .env, las variables deben venir del entorno del sistema
    envLoaded = true;
    return;
  }

  const content = fs.readFileSync(ENV_FILE, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    // Saltar comentarios y líneas vacías
    if (trimmed === "" || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    // Quitar comillas opcionales
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Solo setear si no existe ya en el entorno (el entorno real gana)
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }

  envLoaded = true;
}

// --------------------------------------------------------------
// Public API
// --------------------------------------------------------------

export interface FigmaEnv {
  accessToken: string;
  fileKey: string;
}

export function requireFigmaEnv(): FigmaEnv {
  loadEnv();

  const accessToken = process.env.FIGMA_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error(
      `FIGMA_ACCESS_TOKEN no esta definido. Generalo en Figma Settings -> Security y ponelo en ${ENV_FILE}`,
    );
  }

  const fileKey = process.env.FIGMA_FILE_KEY ?? DEFAULT_FILE_KEY;
  return { accessToken, fileKey };
}
