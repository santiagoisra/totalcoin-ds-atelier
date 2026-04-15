import { requireFigmaEnv } from "./lib/env.ts";

async function main(): Promise<void> {
  const env = requireFigmaEnv();

  console.log(`[push] Figma file: ${env.fileKey}`);
  console.log("[push] Pendiente: leer tokens/source/*.tokens.json y enviar diffs hacia Figma");
  console.log("[push] TODO:");
  console.log("       1. Leer todos los archivos en tokens/source/");
  console.log("       2. Fetch variables remotos y calcular diff");
  console.log("       3. POST /v1/files/:file_key/variables con acciones create/update/delete");
  console.log("       4. Requiere confirmacion explicita antes de escribir (flag --confirm)");
  console.log("[push] Alternativa: usar el MCP de Figma (use_figma) para escrituras mas expresivas");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
