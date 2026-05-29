/**
 * pull-tokens.ts — Agent-bridge Figma dump → DTCG transform.
 *
 * IMPORTANT: This script does NOT call the Figma MCP directly. It reads a
 * pre-written dump file (tokens/.figma-dump.json) that the AI agent produces
 * by calling `get_variable_defs` + `get_design_context` in a live Figma
 * session, then writing the result to disk.
 *
 * Usage:
 *   tsx scripts/pull-tokens.ts [--dump <path>]
 *
 * Defaults to reading from tokens/.figma-dump.json.
 * Exits 1 if the dump file is missing or malformed.
 * Exits 0 (warn-and-write) even if token values drifted.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  type DtcgTokenTree,
  type FigmaDump,
  parseFigmaVariables,
  parseFigmaTextStyles,
  diffTokenTrees,
} from "./lib/dtcg.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TOKENS_DIR = path.join(ROOT, "tokens", "source");
const DEFAULT_DUMP = path.join(ROOT, "tokens", ".figma-dump.json");
const DTCG_SCHEMA = "https://schemas.designtokens.org/draft/v0.0/design-tokens.json";

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

function parseDumpPath(): string {
  const args = process.argv.slice(2);
  const idx = args.indexOf("--dump");
  const customPath = idx !== -1 ? args[idx + 1] : undefined;
  if (customPath !== undefined) {
    // resolve relative to cwd
    return path.isAbsolute(customPath)
      ? customPath
      : path.resolve(process.cwd(), customPath);
  }
  return DEFAULT_DUMP;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateDump(raw: unknown): asserts raw is FigmaDump {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Dump file must be a JSON object.");
  }
  const obj = raw as Record<string, unknown>;
  if (!("variables" in obj)) {
    throw new Error(
      "Dump is missing the 'variables' section. " +
        "The agent must call get_variable_defs and include the result under the 'variables' key.",
    );
  }
  if (!("textStyles" in obj)) {
    throw new Error(
      "Dump is missing the 'textStyles' section. " +
        "The agent must call get_design_context on the typography frame and include the result under 'textStyles'.",
    );
  }
  if (!("meta" in obj)) {
    throw new Error(
      "Dump is missing the 'meta' section ({ fileKey, extractedAt }).",
    );
  }
}

// ---------------------------------------------------------------------------
// File I/O helpers
// ---------------------------------------------------------------------------

function readExistingTree(filePath: string): DtcgTokenTree {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(content) as Record<string, unknown>;
    // Strip $schema and $description before diffing
    const tree: DtcgTokenTree = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (!k.startsWith("$")) {
        tree[k] = v as DtcgTokenTree;
      }
    }
    return tree;
  } catch {
    return {};
  }
}

function writeDtcgFile(
  filePath: string,
  tree: DtcgTokenTree,
  description?: string,
): void {
  const output: Record<string, unknown> = {
    $schema: DTCG_SCHEMA,
  };
  if (description) {
    output.$description = description;
  }
  for (const [k, v] of Object.entries(tree)) {
    output[k] = v;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(output, null, 2) + "\n", "utf-8");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const dumpPath = parseDumpPath();

  // Step 1: Verify dump exists
  if (!fs.existsSync(dumpPath)) {
    process.stderr.write(
      `[pull] No dump found at ${dumpPath}.\n` +
        "[pull] Ask the agent to run Figma MCP extraction first:\n" +
        "[pull]   1. Call get_variable_defs with the Figma file key\n" +
        "[pull]   2. Call get_design_context on the typography frame\n" +
        "[pull]   3. Write the combined result to tokens/.figma-dump.json\n" +
        "[pull]      { variables: <get_variable_defs output>, textStyles: <get_design_context output>, meta: { fileKey, extractedAt } }\n",
    );
    process.exit(1);
  }

  // Step 2: Parse dump
  let dump: FigmaDump;
  try {
    const raw: unknown = JSON.parse(fs.readFileSync(dumpPath, "utf-8"));
    validateDump(raw);
    dump = raw;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`[pull] ERROR: malformed dump file — ${msg}\n`);
    process.exit(1);
  }

  const fileKey = dump.meta.fileKey;
  console.log(`[pull] Figma file: ${fileKey}`);

  // Step 3: Transform variables → DTCG trees
  let collectionTrees: Record<string, DtcgTokenTree>;
  try {
    collectionTrees = parseFigmaVariables(dump);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`[pull] ERROR parsing variables: ${msg}\n`);
    process.exit(1);
  }

  let totalTokensWritten = 0;
  let totalDrifts = 0;

  // Step 4: Write one file per collection (variables)
  for (const [collKey, tree] of Object.entries(collectionTrees)) {
    const outFile = path.join(TOKENS_DIR, `${collKey}.tokens.json`);

    // Diff against existing
    const existing = readExistingTree(outFile);
    const drifts = diffTokenTrees(existing, tree);
    for (const drift of drifts) {
      console.log(`[drift] ${drift.path}: ${String(drift.oldVal)} → ${String(drift.newVal)}`);
    }
    totalDrifts += drifts.length;

    // Count tokens in tree
    const tokenCount = countTokens(tree);
    totalTokensWritten += tokenCount;

    writeDtcgFile(
      outFile,
      tree,
      `${collKey} tokens. Auto-extracted from Figma file ${fileKey} at ${dump.meta.extractedAt}.`,
    );
    console.log(`[pull] Wrote ${outFile} (${tokenCount} tokens)`);
  }

  // Step 5: Transform textStyles → typography DTCG
  let typographyTree: DtcgTokenTree | null;
  try {
    typographyTree = parseFigmaTextStyles(dump);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`[pull] WARN: failed to parse text styles — ${msg}\n`);
    typographyTree = null;
  }

  if (typographyTree === null) {
    process.stderr.write(
      "[pull] WARN: typography frame not found — skipping typography.tokens.json\n",
    );
  } else {
    const typographyFile = path.join(TOKENS_DIR, "typography.tokens.json");
    const existing = readExistingTree(typographyFile);
    const drifts = diffTokenTrees(existing, typographyTree);
    for (const drift of drifts) {
      console.log(`[drift] ${drift.path}: ${String(drift.oldVal)} → ${String(drift.newVal)}`);
    }
    totalDrifts += drifts.length;

    const tokenCount = countTokens(typographyTree);
    totalTokensWritten += tokenCount;

    writeDtcgFile(
      typographyFile,
      typographyTree,
      `Typography tokens. Auto-extracted from Figma file ${fileKey} at ${dump.meta.extractedAt}.`,
    );
    console.log(`[pull] Wrote ${typographyFile} (${tokenCount} tokens)`);
  }

  console.log(
    `[pull] Done: ${totalTokensWritten} tokens written, ${totalDrifts} drifts detected`,
  );
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function countTokens(tree: unknown): number {
  if (typeof tree !== "object" || tree === null) return 0;
  let count = 0;
  for (const [key, val] of Object.entries(tree as Record<string, unknown>)) {
    if (key.startsWith("$")) continue;
    if (
      typeof val === "object" &&
      val !== null &&
      "$value" in val &&
      !Array.isArray(val)
    ) {
      count++;
    } else {
      count += countTokens(val);
    }
  }
  return count;
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`[pull] FATAL: ${msg}\n`);
  process.exit(1);
});
