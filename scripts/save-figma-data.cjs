/**
 * save-figma-data.cjs — Helper para guardar datos de Figma extraídos via MCP
 *
 * Uso: Este script es llamado internamente por el workflow de tokens.
 * No se usa directamente — los datos se obtienen via figma_execute (MCP tool)
 * y se guardan manualmente o via script en el archivo de entrada.
 *
 * Workflow recomendado:
 *   1. Usar figma_execute (MCP tool) con el código FETCH_VARIABLES_CODE
 *   2. Guardar el resultado JSON en un archivo
 *   3. Ejecutar: npx tsx scripts/pull-tokens.ts --input <archivo>
 *
 * Si tenés el JSON en el clipboard o en un archivo resultado de figma_execute:
 *   node scripts/save-figma-data.cjs < input.json
 *   node scripts/save-figma-data.cjs input.json
 */

const fs = require("fs");
const path = require("path");

const OUTPUT_DEFAULT = path.join(
  process.env.TEMP || process.env.TMP || "C:\\Users\\santi\\AppData\\Local\\Temp",
  "opencode",
  "figma-variables.json",
);
const outputPath = process.argv[2] || OUTPUT_DEFAULT;

/**
 * Código JavaScript que se ejecuta DENTRO del plugin de Figma
 * para leer todas las variables locales y devolverlas como JSON.
 *
 * Copiar esto a figma_execute (MCP tool) para extraer los datos.
 */
const FETCH_VARIABLES_CODE = `
const variables = await figma.variables.getLocalVariablesAsync();
const collections = await figma.variables.getLocalVariableCollectionsAsync();

return JSON.stringify({
  success: true,
  timestamp: Date.now(),
  fileKey: figma.fileKey || null,
  variables: variables.map(v => ({
    id: v.id,
    name: v.name,
    key: v.key,
    resolvedType: v.resolvedType,
    valuesByMode: v.valuesByMode,
    variableCollectionId: v.variableCollectionId,
    scopes: v.scopes,
    codeSyntax: v.codeSyntax || {},
    description: v.description,
    hiddenFromPublishing: v.hiddenFromPublishing
  })),
  variableCollections: collections.map(c => ({
    id: c.id,
    name: c.name,
    key: c.key,
    modes: c.modes,
    defaultModeId: c.defaultModeId,
    variableIds: c.variableIds
  }))
});
`;

function printInstructions() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Figma Variables Extraction Helper");
  console.log("═══════════════════════════════════════════════════════════");
  console.log();
  console.log("El MCP Bridge no permite ejecución directa desde Node.js.");
  console.log("Usá este código en figma_execute (MCP tool) y guardá el resultado:");
  console.log();
  console.log("--- CUT HERE ---");
  console.log(FETCH_VARIABLES_CODE);
  console.log("--- CUT HERE ---");
  console.log();
  console.log("Luego guardá el resultado en un archivo JSON y ejecutá:");
  console.log(`  npx tsx scripts/pull-tokens.ts --input ${outputPath}`);
  console.log();
  console.log("Alternativa con REST API (requiere Enterprise):");
  console.log("  npx tsx scripts/pull-tokens.ts --rest");
}

// Si se pasa un archivo como argumento, procesarlo
if (process.argv.length > 2 && fs.existsSync(process.argv[2])) {
  const inputPath = process.argv[2];
  const raw = fs.readFileSync(inputPath, "utf-8");

  try {
    const parsed = JSON.parse(raw);

    // Si es el resultado completo de figma_execute, extraer solo .result
    if (parsed.success && parsed.result && typeof parsed.result === "string") {
      fs.writeFileSync(outputPath, parsed.result, "utf-8");
      const data = JSON.parse(parsed.result);
      console.log(`[save] Datos extraídos y guardados en: ${outputPath}`);
      console.log(`[save] ${data.variableCollections?.length ?? "?"} colecciones, ${data.variables?.length ?? "?"} variables`);
    } else if (parsed.variables && parsed.variableCollections) {
      // Ya es el formato correcto
      fs.writeFileSync(outputPath, raw, "utf-8");
      console.log(`[save] Datos guardados en: ${outputPath}`);
      console.log(`[save] ${parsed.variableCollections.length} colecciones, ${parsed.variables.length} variables`);
    } else {
      console.error("[save] Formato de JSON no reconocido");
      process.exit(1);
    }
  } catch (e) {
    console.error(`[save] Error parseando JSON: ${e.message}`);
    process.exit(1);
  }
} else if (!process.stdin.isTTY) {
  // Leer de stdin
  let input = "";
  process.stdin.on("data", (chunk) => (input += chunk));
  process.stdin.on("end", () => {
    try {
      const parsed = JSON.parse(input);
      if (parsed.success && parsed.result && typeof parsed.result === "string") {
        fs.writeFileSync(outputPath, parsed.result, "utf-8");
        const data = JSON.parse(parsed.result);
        console.log(`[save] ${data.variableCollections?.length ?? "?"} colecciones, ${data.variables?.length ?? "?"} variables`);
      } else if (parsed.variables && parsed.variableCollections) {
        fs.writeFileSync(outputPath, input, "utf-8");
        console.log(`[save] ${parsed.variableCollections.length} colecciones, ${parsed.variables.length} variables`);
      } else {
        console.error("[save] Formato no reconocido");
        process.exit(1);
      }
      console.log(`[save] Guardado en: ${outputPath}`);
    } catch (e) {
      console.error(`[save] Error: ${e.message}`);
      process.exit(1);
    }
  });
} else {
  printInstructions();
}
