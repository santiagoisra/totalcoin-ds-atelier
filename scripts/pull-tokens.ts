import { requireFigmaEnv } from "./lib/env.ts";

async function main(): Promise<void> {
  const env = requireFigmaEnv();

  console.log(`[pull] Figma file: ${env.fileKey}`);
  console.log("[pull] Pendiente: leer variables locales del archivo y regenerar tokens/source/*.tokens.json");
  console.log("[pull] TODO:");
  console.log("       1. Fetch /v1/files/:file_key/variables/local (Figma REST API)");
  console.log("       2. Transformar respuesta a formato W3C DTCG (helpers en scripts/lib/)");
  console.log("       3. Escribir un archivo por collection o por categoria en tokens/source/");
  console.log("       4. Mostrar diff resumido contra el estado actual en disco");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
