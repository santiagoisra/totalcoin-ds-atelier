/**
 * fetch-variables.js — Extrae variables de Figma via MCP Bridge HTTP
 * y las guarda en un archivo JSON para que pull-tokens.ts las procese.
 *
 * Uso: node scripts/fetch-variables.js [output-file]
 *   output-file default: C:\Users\santi\AppData\Local\Temp\opencode\figma-variables.json
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const OUTPUT_DEFAULT = path.join(
  process.env.TEMP || process.env.TMP || "C:\\Users\\santi\\AppData\\Local\\Temp",
  "opencode",
  "figma-variables.json",
);
const outputPath = process.argv[2] || OUTPUT_DEFAULT;

const code = [
  "const variables = await figma.variables.getLocalVariablesAsync();",
  "const collections = await figma.variables.getLocalVariableCollectionsAsync();",
  "return JSON.stringify({",
  "  success: true,",
  "  timestamp: Date.now(),",
  "  fileKey: figma.fileKey || null,",
  "  variables: variables.map(v => ({",
  "    id: v.id, name: v.name, key: v.key, resolvedType: v.resolvedType,",
  "    valuesByMode: v.valuesByMode, variableCollectionId: v.variableCollectionId,",
  "    scopes: v.scopes, codeSyntax: v.codeSyntax || {},",
  "    description: v.description, hiddenFromPublishing: v.hiddenFromPublishing",
  "  })),",
  "  variableCollections: collections.map(c => ({",
  "    id: c.id, name: c.name, key: c.key,",
  "    modes: c.modes, defaultModeId: c.defaultModeId, variableIds: c.variableIds",
  "  }))",
  "});",
].join("\n");

const postData = JSON.stringify({
  channel: "EXECUTE_CODE",
  code: code,
  requestId: `fetch-variables-${Date.now()}`,
  timeout: 15000,
});

const options = {
  hostname: "::1",
  port: 9223,
  path: "/",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(postData),
  },
  timeout: 15000,
};

console.log("[fetch] Conectando a MCP Bridge en [::1]:9223...");

const req = http.request(options, (res) => {
  let body = "";
  res.on("data", (chunk) => (body += chunk));
  res.on("end", () => {
    try {
      const msg = JSON.parse(body);
      if (msg.success && msg.result) {
        // msg.result is a JSON string (we returned JSON.stringify from figma_execute)
        const parsed = JSON.parse(msg.result);
        fs.writeFileSync(outputPath, msg.result, "utf-8");
        console.log(`[fetch] Guardado en: ${outputPath}`);
        console.log(`[fetch] ${parsed.variableCollections.length} colecciones, ${parsed.variables.length} variables`);
        console.log(`[fetch] File key: ${parsed.fileKey}`);
      } else {
        console.error("[fetch] Error del Bridge:", msg.error || JSON.stringify(msg).slice(0, 500));
        process.exit(1);
      }
    } catch (e) {
      console.error("[fetch] Error parseando respuesta:", e.message);
      console.error("[fetch] Raw body:", body.slice(0, 500));
      process.exit(1);
    }
  });
});

req.on("error", (e) => {
  console.error(`[fetch] No se pudo conectar al MCP Bridge en [::1]:9223`);
  console.error(`[fetch] Error: ${e.message}`);
  console.error(`[fetch] Asegurate de tener Figma Desktop abierto con el plugin "Figma Desktop Bridge" corriendo.`);
  process.exit(1);
});

req.on("timeout", () => {
  req.destroy();
  console.error("[fetch] Timeout conectando al MCP Bridge");
  process.exit(1);
});

req.write(postData);
req.end();
