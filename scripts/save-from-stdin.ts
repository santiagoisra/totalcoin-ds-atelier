/**
 * save-from-stdin.ts — Lee JSON de stdin y lo guarda en un archivo
 * Uso: echo '{"success":true,...}' | npx tsx scripts/save-from-stdin.ts [output-path]
 */
import fs from "node:fs";
import { Readable } from "node:stream";

const outputPath = process.argv[2] ?? "C:/Users/santi/AppData/Local/Temp/opencode/figma-variables.json";

async function readStdin(): Promise<string> {
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

async function main() {
  const raw = await readStdin();
  const parsed = JSON.parse(raw);

  // If it's the full figma_execute result, extract just .result
  let jsonData: string;
  if (parsed.success !== undefined && parsed.result !== undefined && typeof parsed.result === "string") {
    jsonData = parsed.result;
  } else {
    jsonData = raw;
  }

  fs.writeFileSync(outputPath, jsonData, "utf-8");

  const data = JSON.parse(jsonData);
  console.log(`[save] ${data.variableCollections?.length ?? 0} collections, ${data.variables?.length ?? 0} variables`);
  console.log(`[save] Saved to: ${outputPath}`);
}

main().catch((e: unknown) => {
  console.error("[save] Error:", e);
  process.exit(1);
});
