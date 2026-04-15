/**
 * Auto-generador DTCG -> components/tokens.ts.
 *
 * Lee todos los `tokens/source/*.tokens.json`, fusiona sus arboles, resuelve
 * referencias `{path.to.token}`, y emite un archivo TypeScript con:
 *   - `cssVar`: mapa plano kebab-name -> `var(--name, <fallback>)`
 *   - `token`: arbol anidado ergonomico (token.color.primary[500])
 *   - `typographyStyle`: estilos compuestos H0..H6 / N1..N4 como CSSProperties
 *   - `shadowValue`: strings CSS box-shadow validos (single + compound)
 *
 * Ejecutar: `npx tsx scripts/generate-tokens.ts` o via `npm run tokens:generate`.
 *
 * NO ejecuta side effects sobre Figma — pura transformacion de archivos.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TOKENS_DIR = path.join(ROOT, "tokens", "source");
const OUTPUT = path.join(ROOT, "components", "tokens.ts");

// --------------------------------------------------------------
// Types
// --------------------------------------------------------------

interface DTCGToken {
  $type?: string;
  $value: unknown;
  $description?: string;
}

type TokenTree = { [key: string]: TokenTree | DTCGToken };

function isToken(val: unknown): val is DTCGToken {
  return (
    typeof val === "object" &&
    val !== null &&
    "$value" in val &&
    !Array.isArray(val)
  );
}

// --------------------------------------------------------------
// Load + merge all DTCG files
// --------------------------------------------------------------

function loadAllTokens(): TokenTree {
  const merged: TokenTree = {};
  const files = fs
    .readdirSync(TOKENS_DIR)
    .filter((f) => f.endsWith(".tokens.json"))
    .sort();

  for (const file of files) {
    const content = JSON.parse(
      fs.readFileSync(path.join(TOKENS_DIR, file), "utf-8"),
    );
    for (const key of Object.keys(content)) {
      if (key.startsWith("$")) continue;
      if (key in merged) {
        mergeDeep(merged[key] as TokenTree, content[key]);
      } else {
        merged[key] = content[key];
      }
    }
  }
  return merged;
}

function mergeDeep(target: TokenTree, source: TokenTree): void {
  for (const key of Object.keys(source)) {
    if (key.startsWith("$")) continue;
    const srcVal = source[key];
    const tgtVal = target[key];
    if (
      tgtVal &&
      typeof tgtVal === "object" &&
      typeof srcVal === "object" &&
      !isToken(tgtVal) &&
      !isToken(srcVal)
    ) {
      mergeDeep(tgtVal as TokenTree, srcVal as TokenTree);
    } else {
      target[key] = srcVal as TokenTree | DTCGToken;
    }
  }
}

// --------------------------------------------------------------
// Reference resolution — `{path.to.token}` -> final value
// --------------------------------------------------------------

function resolveRef(refStr: string, tree: TokenTree, seen = new Set<string>()): unknown {
  if (seen.has(refStr)) throw new Error(`Cycle detected at ${refStr}`);
  seen.add(refStr);

  const p = refStr.slice(1, -1).split(".");
  let cur: unknown = tree;
  for (const seg of p) {
    if (typeof cur !== "object" || cur === null) {
      throw new Error(`Broken ref ${refStr} at segment ${seg}`);
    }
    cur = (cur as Record<string, unknown>)[seg];
  }
  if (cur === undefined) throw new Error(`Unresolved ref ${refStr}`);

  if (isToken(cur)) return resolveValue(cur.$value, tree, seen);
  return cur;
}

function resolveValue(val: unknown, tree: TokenTree, seen = new Set<string>()): unknown {
  if (
    typeof val === "string" &&
    val.startsWith("{") &&
    val.endsWith("}")
  ) {
    return resolveRef(val, tree, seen);
  }
  if (Array.isArray(val)) {
    return val.map((v) => resolveValue(v, tree, seen));
  }
  if (typeof val === "object" && val !== null) {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(val)) {
      out[k] = resolveValue((val as Record<string, unknown>)[k], tree, seen);
    }
    return out;
  }
  return val;
}

// --------------------------------------------------------------
// Path utilities
// --------------------------------------------------------------

function toKebab(segments: string[]): string {
  return segments
    .map((s) =>
      s
        .replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
        .replace(/^-/, "")
        .replace(/[^a-zA-Z0-9]+/g, "-"),
    )
    .join("-")
    .toLowerCase();
}

function toTsKey(segment: string): string {
  // If pure numeric, use quoted key (obj["50"] y obj[50] funcionan igual en runtime,
  // quoted es mas explicito).
  if (/^\d+$/.test(segment)) return `"${segment}"`;
  // kebab-case -> camelCase for ergonomic TS access:
  //   "on-primary"    -> onPrimary
  //   "primary-dark"  -> primaryDark
  //   "primary-2"     -> primary2
  const camel = segment.replace(/-([a-zA-Z0-9])/g, (_, c) => c.toUpperCase());
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(camel)) return camel;
  return JSON.stringify(camel);
}

// --------------------------------------------------------------
// Collect atomic tokens (primitives we can turn into CSS vars)
// --------------------------------------------------------------

interface AtomicToken {
  pathSegments: string[];
  cssVarName: string;
  fallback: string;
  type: string | undefined;
}

interface CompoundToken {
  pathSegments: string[];
  type: string;
  value: Record<string, unknown>;
}

const ATOMIC_TYPES = new Set([
  "color",
  "dimension",
  "fontFamily",
  "fontWeight",
  "number",
  "duration",
  "cubicBezier",
  // undefined: treat as atomic if $value is primitive
]);

function collect(tree: TokenTree): { atomic: AtomicToken[]; compound: CompoundToken[] } {
  const atomic: AtomicToken[] = [];
  const compound: CompoundToken[] = [];

  function walk(node: unknown, prefix: string[]): void {
    if (isToken(node)) {
      const type = node.$type;
      const resolved = resolveValue(node.$value, tree);

      if (type === "typography" || type === "shadow") {
        compound.push({
          pathSegments: prefix,
          type,
          value: resolved as Record<string, unknown>,
        });
        return;
      }

      // Atomic: try to stringify as CSS-usable value
      const fallback = stringifyAtomic(resolved, type);
      if (fallback !== null) {
        atomic.push({
          pathSegments: prefix,
          cssVarName: toKebab(prefix),
          fallback,
          type,
        });
      }
      return;
    }

    if (typeof node === "object" && node !== null) {
      for (const k of Object.keys(node)) {
        if (k.startsWith("$")) continue;
        walk((node as TokenTree)[k], [...prefix, k]);
      }
    }
  }

  walk(tree, []);
  return { atomic, compound };
}

/**
 * Convierte un fontFamily DTCG (string o array) a un string CSS valido.
 * Array: quote cada familia con espacios, deja genericos sin comillas.
 *   ["Nunito", "sans-serif"] -> "Nunito, sans-serif"
 *   ["Open Sans", "serif"]   -> "'Open Sans', serif"
 */
function fontFamilyToCss(val: unknown): string | null {
  const GENERIC = new Set(["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-serif", "ui-sans-serif", "ui-monospace", "ui-rounded"]);
  const quote = (s: string): string => {
    if (GENERIC.has(s)) return s;
    return s.includes(" ") ? `'${s}'` : s;
  };
  if (typeof val === "string") return val;
  if (Array.isArray(val)) {
    return val.filter((x): x is string => typeof x === "string").map(quote).join(", ");
  }
  return null;
}

function stringifyAtomic(val: unknown, type: string | undefined): string | null {
  if (typeof val === "string") return val;
  if (typeof val === "number") {
    // fontWeight / number / opacity
    return String(val);
  }
  if (Array.isArray(val)) {
    // fontFamily array — reuse the same CSS conversion
    if (type === "fontFamily") {
      return fontFamilyToCss(val) ?? null;
    }
  }
  return null;
}

// --------------------------------------------------------------
// Emit tokens.ts
// --------------------------------------------------------------

function emit(atomic: AtomicToken[], compound: CompoundToken[]): string {
  const lines: string[] = [];

  lines.push(`/**`);
  lines.push(` * AUTO-GENERATED from tokens/source/*.tokens.json`);
  lines.push(` * Do NOT edit by hand. Run \`npm run tokens:generate\`.`);
  lines.push(` *`);
  lines.push(` * Exports:`);
  lines.push(` *   cssVar          — flat map { "kebab-name": "var(--kebab-name, fallback)" }`);
  lines.push(` *   token           — nested ergonomic tree (token.color.primary[500])`);
  lines.push(` *   typographyStyle — compound typography as CSSProperties objects`);
  lines.push(` *   shadowValue     — CSS box-shadow strings`);
  lines.push(` */`);
  lines.push(``);
  lines.push(`import type { CSSProperties } from "react";`);
  lines.push(``);

  // --- cssVar flat map ---
  lines.push(`export const cssVar = {`);
  for (const t of atomic) {
    lines.push(`  ${JSON.stringify(t.cssVarName)}: "var(--${t.cssVarName}, ${t.fallback})",`);
  }
  lines.push(`} as const;`);
  lines.push(``);
  lines.push(`export type CssVarName = keyof typeof cssVar;`);
  lines.push(``);

  // --- token nested tree ---
  lines.push(`export const token = ${emitNestedObject(atomic)} as const;`);
  lines.push(``);
  lines.push(`export type Token = typeof token;`);
  lines.push(``);

  // --- typographyStyle ---
  const typography = compound.filter((c) => c.type === "typography");
  if (typography.length > 0) {
    lines.push(`export const typographyStyle: Record<string, CSSProperties> = {`);
    for (const c of typography) {
      const key = c.pathSegments.slice(-1)[0] ?? "unknown";
      lines.push(`  ${toTsKey(key)}: ${emitTypographyStyle(c.value)},`);
    }
    lines.push(`};`);
    lines.push(``);
  }

  // --- shadowValue ---
  const shadows = compound.filter((c) => c.type === "shadow");
  if (shadows.length > 0) {
    lines.push(`export const shadowValue: Record<string, string> = {`);
    for (const c of shadows) {
      const key = c.pathSegments.slice(-1)[0] ?? "unknown";
      lines.push(`  ${toTsKey(key)}: ${JSON.stringify(emitShadow(c.value))},`);
    }
    lines.push(`};`);
    lines.push(``);
  }

  return lines.join("\n");
}

function emitNestedObject(atomic: AtomicToken[]): string {
  type Node = { children: Map<string, Node>; cssVarName?: string };
  const root: Node = { children: new Map() };

  for (const t of atomic) {
    let cur = root;
    for (const seg of t.pathSegments) {
      if (!cur.children.has(seg)) cur.children.set(seg, { children: new Map() });
      cur = cur.children.get(seg)!;
    }
    cur.cssVarName = t.cssVarName;
  }

  function emitNode(node: Node, indent: number): string {
    if (node.cssVarName && node.children.size === 0) {
      return `cssVar[${JSON.stringify(node.cssVarName)}]`;
    }
    const pad = "  ".repeat(indent);
    const innerPad = "  ".repeat(indent + 1);
    const parts: string[] = [];
    for (const [key, child] of node.children) {
      parts.push(`${innerPad}${toTsKey(key)}: ${emitNode(child, indent + 1)}`);
    }
    return `{\n${parts.join(",\n")}\n${pad}}`;
  }

  return emitNode(root, 0);
}

function emitTypographyStyle(val: Record<string, unknown>): string {
  const parts: string[] = [];
  const ff = val.fontFamily;
  const ffString = fontFamilyToCss(ff);
  if (ffString) {
    parts.push(`fontFamily: ${JSON.stringify(ffString)}`);
  }
  const fw = val.fontWeight;
  if (fw !== undefined) {
    const n = typeof fw === "number" ? fw : parseInt(String(fw), 10);
    if (!Number.isNaN(n)) parts.push(`fontWeight: ${n}`);
  }
  const fs = val.fontSize;
  if (typeof fs === "string") {
    parts.push(`fontSize: ${JSON.stringify(fs)}`);
  }
  const lh = val.lineHeight;
  if (lh !== undefined) {
    const n = typeof lh === "number" ? lh : parseFloat(String(lh));
    if (!Number.isNaN(n)) parts.push(`lineHeight: ${n}`);
  }
  const ls = val.letterSpacing;
  if (typeof ls === "string") {
    parts.push(`letterSpacing: ${JSON.stringify(ls)}`);
  }
  return `{ ${parts.join(", ")} }`;
}

function emitShadow(val: Record<string, unknown> | Array<Record<string, unknown>>): string {
  const layers = Array.isArray(val) ? val : [val];
  return layers
    .map((layer) => {
      const x = layer.offsetX ?? "0";
      const y = layer.offsetY ?? "0";
      const blur = layer.blur ?? "0";
      const spread = layer.spread ?? "0";
      const color = layer.color ?? "transparent";
      return `${x} ${y} ${blur} ${spread} ${color}`;
    })
    .join(", ");
}

// --------------------------------------------------------------
// Main
// --------------------------------------------------------------

function main(): void {
  const tree = loadAllTokens();
  const { atomic, compound } = collect(tree);

  const output = emit(atomic, compound);
  fs.writeFileSync(OUTPUT, output, "utf-8");

  console.log(`Generated ${OUTPUT}`);
  console.log(`  atomic tokens:   ${atomic.length}`);
  console.log(`  typography:      ${compound.filter((c) => c.type === "typography").length}`);
  console.log(`  shadow:          ${compound.filter((c) => c.type === "shadow").length}`);
}

main();
