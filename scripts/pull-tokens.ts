/**
 * pull-tokens.ts — Sincroniza variables de Figma → tokens/source/*.tokens.json
 *
 * Acepta datos de Figma como JSON (stdin o archivo) y los transforma
 * a formato W3C DTCG. La extracción se hace por fuera (ej: figma_execute
 * en el MCP bridge), este script solo transforma y escribe.
 *
 * Flujo completo:
 *   1. Extraer variables de Figma (via MCP bridge, REST API, o manual)
 *   2. Guardar JSON resultado en archivo o pipear a stdin
 *   3. Este script lee el JSON, transforma a DTCG, escribe .tokens.json
 *
 * Flags:
 *   --dry-run       No escribe archivos, solo muestra qué cambiaría
 *   --mode NAME     Usa un modo específico en vez del default de cada colección
 *   --input FILE    Lee JSON desde archivo (si no se pasa, lee stdin)
 *   --rest          Lee desde REST API directamente (requiere FIGMA_ACCESS_TOKEN + Enterprise)
 *   --bridge        Lee desde Desktop Bridge (localhost:9223) — default si no hay --input ni pipe
 *
 * Uso:
 *   # Desde Desktop Bridge (default):
 *   npx tsx scripts/pull-tokens.ts
 *
 *   # Desde archivo JSON:
 *   npx tsx scripts/pull-tokens.ts --input figma-variables.json
 *
 *   # Desde stdin:
 *   cat figma-variables.json | npx tsx scripts/pull-tokens.ts
 *
 *   # Dry run:
 *   npx tsx scripts/pull-tokens.ts --input figma-variables.json --dry-run
 *
 *   # Modo específico:
 *   npx tsx scripts/pull-tokens.ts --input figma-variables.json --mode Dark
 *
 *   # REST API directo (Enterprise):
 *   npx tsx scripts/pull-tokens.ts --rest
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";

import { requireFigmaEnv } from "./lib/env.ts";
import {
  transformFigmaToDTCG,
  collectionToFileName,
  type FigmaVariablesResponse,
  type FigmaCollection,
  type FigmaVariable,
  type DTCGTree,
} from "./lib/figma-to-dtcg.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TOKENS_DIR = path.join(ROOT, "tokens", "source");
const DTCG_SCHEMA = "https://schemas.designtokens.org/draft/v0.0/design-tokens.json";

// --------------------------------------------------------------
// CLI args parsing
// --------------------------------------------------------------

interface CliArgs {
  dryRun: boolean;
  mode: string | undefined;
  input: string | undefined;
  forceRest: boolean;
  forceBridge: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);

  const inputRaw = args.find((a) => a.startsWith("--input="))?.split("=")[1]
    ?? (args.includes("--input") ? args[args.indexOf("--input") + 1] : undefined);

  const modeRaw = args.find((a) => a.startsWith("--mode="))?.split("=")[1]
    ?? (args.includes("--mode") ? args[args.indexOf("--mode") + 1] : undefined);

  return {
    dryRun: args.includes("--dry-run"),
    mode: modeRaw ?? undefined,
    input: inputRaw ?? undefined,
    forceRest: args.includes("--rest"),
    forceBridge: args.includes("--bridge"),
  };
}

// --------------------------------------------------------------
// Read JSON input (file or stdin)
// --------------------------------------------------------------

async function readJsonFromStdin(): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of Readable.toWeb(process.stdin) as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const combined = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(combined);
}

// --------------------------------------------------------------
// Bridge format → FigmaVariablesResponse
// --------------------------------------------------------------

interface BridgeVariable {
  id: string;
  name: string;
  key: string;
  resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  valuesByMode: Record<string, unknown>;
  variableCollectionId: string;
  scopes?: string[];
  description?: string;
  hiddenFromPublishing?: boolean;
  codeSyntax?: Record<string, string>;
}

interface BridgeCollection {
  id: string;
  name: string;
  key: string;
  modes: Array<{ name: string; modeId: string }>;
  defaultModeId: string;
  variableIds: string[];
}

interface BridgeData {
  success: boolean;
  timestamp?: number;
  fileKey?: string | null;
  variables: BridgeVariable[];
  variableCollections: BridgeCollection[];
}

/**
 * Convierte el formato del Bridge (arrays) al formato de la REST API (records por ID).
 * Así reutilizamos transformFigmaToDTCG sin cambios.
 */
function bridgeToApiResponse(data: BridgeData): FigmaVariablesResponse {
  const variableCollections: Record<string, FigmaCollection> = {};
  const variables: Record<string, FigmaVariable> = {};

  for (const c of data.variableCollections) {
    variableCollections[c.id] = {
      id: c.id,
      name: c.name,
      // Bridge uses { name, modeId }, API uses { name, id }
      modes: c.modes.map((m) => ({ name: m.name, id: m.modeId })),
      defaultModeId: c.defaultModeId,
    };
  }

  for (const v of data.variables) {
    variables[v.id] = {
      id: v.id,
      name: v.name,
      resolvedType: v.resolvedType,
      variableCollectionId: v.variableCollectionId,
      valuesByMode: v.valuesByMode as Record<string, import("./lib/figma-to-dtcg.ts").FigmaModeValue>,
      description: v.description || undefined,
      scopes: v.scopes ?? undefined,
      hiddenFromPublishing: v.hiddenFromPublishing ?? undefined,
    };
  }

  return {
    meta: { variableCollections, variables },
    status: 200,
    error: false,
  };
}

// --------------------------------------------------------------
// Parse input: auto-detect format (Bridge vs REST API)
// --------------------------------------------------------------

function parseInputJson(raw: string): FigmaVariablesResponse {
  const parsed: unknown = JSON.parse(raw);

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("El JSON de entrada no es un objeto válido");
  }

  const obj = parsed as Record<string, unknown>;

  // Detectar formato Bridge: tiene "variables" (array) y "variableCollections" (array)
  if (Array.isArray(obj["variables"]) && Array.isArray(obj["variableCollections"])) {
    console.log("[pull] Formato detectado: Desktop Bridge (arrays)");
    return bridgeToApiResponse(obj as unknown as BridgeData);
  }

  // Detectar formato REST API: tiene "meta.variableCollections" y "meta.variables" (records)
  if (obj["meta"] && typeof obj["meta"] === "object") {
    const meta = obj["meta"] as Record<string, unknown>;
    if (meta["variableCollections"] && meta["variables"]) {
      console.log("[pull] Formato detectado: REST API (meta record)");
      return parsed as FigmaVariablesResponse;
    }
  }

  throw new Error(
    "No se pudo detectar el formato del JSON.\n" +
    "Se espera formato Bridge { variables: [], variableCollections: [] }\n" +
    "o formato REST API { meta: { variableCollections: {}, variables: {} } }",
  );
}

// --------------------------------------------------------------
// Transport: REST API (Enterprise)
// --------------------------------------------------------------

async function fetchViaRestApi(
  fileKey: string,
  accessToken: string,
): Promise<FigmaVariablesResponse> {
  const url = `https://api.figma.com/v1/files/${fileKey}/variables/local`;
  console.log(`[pull] Fetching REST API ${url} ...`);

  const res = await fetch(url, {
    method: "GET",
    headers: { "X-Figma-Token": accessToken },
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 403) {
      throw new Error(
        `REST API 403 — Requiere plan Enterprise con scope file_variables:read.\n` +
        `Usá el Desktop Bridge o --input en vez de --rest.`,
      );
    }
    throw new Error(`Figma API ${res.status} ${res.statusText}: ${body.slice(0, 500)}`);
  }

  const data = (await res.json()) as FigmaVariablesResponse;

  if (data.error) {
    throw new Error(`Figma API devolvió error: ${JSON.stringify(data)}`);
  }

  if (!data.meta?.variableCollections || !data.meta?.variables) {
    throw new Error(
      `Respuesta inesperada de Figma — no se encontraron variableCollections/variables.`,
    );
  }

  return data;
}

// --------------------------------------------------------------
// Transport: Desktop Bridge (localhost:9223)
// --------------------------------------------------------------

const FETCH_CODE = [
  'const variables = await figma.variables.getLocalVariablesAsync();',
  'const collections = await figma.variables.getLocalVariableCollectionsAsync();',
  'return JSON.stringify({',
  '  success: true,',
  '  timestamp: Date.now(),',
  '  fileKey: figma.fileKey || null,',
  '  variables: variables.map(v => ({',
  '    id: v.id, name: v.name, key: v.key, resolvedType: v.resolvedType,',
  '    valuesByMode: v.valuesByMode, variableCollectionId: v.variableCollectionId,',
  '    scopes: v.scopes, codeSyntax: v.codeSyntax || {},',
  '    description: v.description, hiddenFromPublishing: v.hiddenFromPublishing',
  '  })),',
  '  variableCollections: collections.map(c => ({',
  '    id: c.id, name: c.name, key: c.key,',
  '    modes: c.modes, defaultModeId: c.defaultModeId, variableIds: c.variableIds',
  '  }))',
  '});',
].join("\n");

async function fetchViaBridge(): Promise<FigmaVariablesResponse> {
  const host = "::1";
  const port = 9223;
  const url = `http://[${host}]:${port}/`;

  console.log(`[pull] Conectando a Desktop Bridge en [${host}]:${port}...`);

  const postData = JSON.stringify({
    channel: "EXECUTE_CODE",
    code: FETCH_CODE,
    requestId: `pull-tokens-${Date.now()}`,
    timeout: 15000,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData).toString(),
    },
    body: postData,
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`Bridge HTTP ${res.status}: ${res.statusText}`);
  }

  const msg = await res.json() as Record<string, unknown>;

  if (!msg.success || !msg.result) {
    throw new Error(`Bridge error: ${JSON.stringify(msg.error ?? msg).slice(0, 500)}`);
  }

  const raw = JSON.parse(msg.result as string);
  console.log(`[pull] Bridge conectado — ${raw.variableCollections.length} colecciones, ${raw.variables.length} variables`);

  return bridgeToApiResponse({
    success: true,
    timestamp: raw.timestamp,
    fileKey: raw.fileKey,
    variables: raw.variables,
    variableCollections: raw.variableCollections,
  });
}

// --------------------------------------------------------------
// Diff: comparar contra archivos existentes
// --------------------------------------------------------------

interface DiffResult {
  fileName: string;
  status: "new" | "unchanged" | "changed";
  addedTokens: number;
  removedTokens: number;
  changedTokens: number;
}

function countTokens(tree: DTCGTree): number {
  let count = 0;
  for (const val of Object.values(tree)) {
    if (typeof val === "object" && val !== null && "$value" in val) {
      count++;
    } else if (typeof val === "object" && val !== null) {
      count += countTokens(val as DTCGTree);
    }
  }
  return count;
}

function diffAgainstDisk(
  fileName: string,
  newTree: DTCGTree,
): DiffResult {
  const filePath = path.join(TOKENS_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return {
      fileName,
      status: "new",
      addedTokens: countTokens(newTree),
      removedTokens: 0,
      changedTokens: 0,
    };
  }

  try {
    const existingRaw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const { $schema: _s, $description: _d, ...existing } = existingRaw;

    const existingJson = JSON.stringify(existing, null, 2);
    const newJson = JSON.stringify(newTree, null, 2);

    if (existingJson === newJson) {
      return {
        fileName,
        status: "unchanged",
        addedTokens: 0,
        removedTokens: 0,
        changedTokens: 0,
      };
    }

    const existingCount = countTokens(existing as DTCGTree);
    const newCount = countTokens(newTree);

    return {
      fileName,
      status: "changed",
      addedTokens: Math.max(0, newCount - existingCount),
      removedTokens: Math.max(0, existingCount - newCount),
      changedTokens: 1,
    };
  } catch {
    return {
      fileName,
      status: "changed",
      addedTokens: countTokens(newTree),
      removedTokens: 0,
      changedTokens: 0,
    };
  }
}

// --------------------------------------------------------------
// Write DTCG file con $schema + $description
// --------------------------------------------------------------

function writeTokenFile(
  fileName: string,
  tree: DTCGTree,
  collectionName: string,
  modeName: string,
  fileKey: string,
): void {
  const filePath = path.join(TOKENS_DIR, fileName);

  const output = {
    $schema: DTCG_SCHEMA,
    $description: `Tokens from Figma collection "${collectionName}" (mode: ${modeName}). File: ${fileKey}. Pulled on ${new Date().toISOString().slice(0, 10)}.`,
    ...tree,
  };

  if (!fs.existsSync(TOKENS_DIR)) {
    fs.mkdirSync(TOKENS_DIR, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(output, null, 2) + "\n", "utf-8");
}

// --------------------------------------------------------------
// Main
// --------------------------------------------------------------

async function main(): Promise<void> {
  const { dryRun, mode, input, forceRest } = parseArgs();

  if (dryRun) console.log("[pull] DRY RUN — no se escribirán archivos");
  if (mode) console.log(`[pull] Modo forzado: ${mode}`);
  console.log();

  // 1. Obtener datos de Figma
  let response: FigmaVariablesResponse;

  if (forceRest) {
    // Transport: REST API (Enterprise)
    console.log("[pull] Modo REST API");
    const env = requireFigmaEnv();
    response = await fetchViaRestApi(env.fileKey, env.accessToken);
  } else if (input) {
    // Transport: archivo JSON
    console.log(`[pull] Leyendo desde archivo: ${input}`);
    const raw = fs.readFileSync(input, "utf-8");
    response = parseInputJson(raw);
  } else if (!process.stdin.isTTY) {
    // Transport: stdin (pipe)
    console.log("[pull] Leyendo desde stdin...");
    const raw = await readJsonFromStdin();
    response = parseInputJson(raw);
  } else if (forceBridge || !input) {
    // Transport: Desktop Bridge (default cuando no hay --input ni pipe)
    console.log("[pull] Modo Desktop Bridge");
    response = await fetchViaBridge();
  } else {
    console.error(
      "\n[pull] ERROR: No se proporcionaron datos de Figma.\n\n" +
      "Opciones:\n" +
      "  1. Desktop Bridge (default): npx tsx scripts/pull-tokens.ts\n" +
      "  2. Archivo JSON:             npx tsx scripts/pull-tokens.ts --input data.json\n" +
      "  3. Pipear JSON:              cat data.json | npx tsx scripts/pull-tokens.ts\n" +
      "  4. REST API (Enterprise):    npx tsx scripts/pull-tokens.ts --rest\n",
    );
    process.exit(1);
  }

  const collCount = Object.keys(response.meta.variableCollections).length;
  const varCount = Object.keys(response.meta.variables).length;
  console.log(`[pull] Recibido: ${collCount} colecciones, ${varCount} variables`);
  console.log();

  // 2. Transformar a DTCG
  const outputs = transformFigmaToDTCG(response, mode);

  if (outputs.length === 0) {
    console.log("[pull] No se encontraron variables para transformar. Verifica las colecciones en Figma.");
    return;
  }

  // 3. Mostrar diff y escribir
  console.log("─".repeat(60));
  console.log(" Diff contra tokens/source/ actual");
  console.log("─".repeat(60));

  const env = requireFigmaEnv();

  for (const output of outputs) {
    const diff = diffAgainstDisk(output.fileName, output.tree);

    const statusIcon =
      diff.status === "new" ? "✚" :
      diff.status === "unchanged" ? "✔" :
      "●";

    console.log(
      `  ${statusIcon} ${output.fileName} (${output.collectionName} / ${output.modeName}) — ${diff.status}`,
    );

    if (diff.status === "changed") {
      console.log(
        `      tokens: ${output.stats.total} total, ${output.stats.aliases} aliases, ${output.stats.colors} colors, ${output.stats.numbers} numbers`,
      );
    } else if (diff.status === "new") {
      console.log(
        `      ${output.stats.total} tokens nuevos (${output.stats.colors} colors, ${output.stats.numbers} numbers, ${output.stats.aliases} aliases)`,
      );
    }

    if (!dryRun && diff.status !== "unchanged") {
      writeTokenFile(
        output.fileName,
        output.tree,
        output.collectionName,
        output.modeName,
        env.fileKey,
      );
    }
  }

  console.log("─".repeat(60));

  if (dryRun) {
    console.log("\n[pull] DRY RUN completado. No se escribieron archivos.");
    console.log("[pull] Ejecutá sin --dry-run para aplicar los cambios.");
  } else {
    const changed = outputs.filter(
      (o) => diffAgainstDisk(o.fileName, o.tree).status !== "unchanged",
    );
    if (changed.length === 0) {
      console.log("\n[pull] Todo al día — no hay cambios.");
    } else {
      console.log(`\n[pull] ${changed.length} archivo(s) actualizado(s).`);
      console.log("[pull] Ahora ejecutá `npm run tokens:generate` para regenerar components/tokens.ts");
    }
  }
}

main().catch((err: unknown) => {
  console.error("[pull] Error:", err);
  process.exit(1);
});
