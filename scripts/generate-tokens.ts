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

import { staticOverrides } from "../tailwind.static.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TOKENS_DIR = path.join(ROOT, "tokens", "source");
const OUTPUT = path.join(ROOT, "components", "tokens.ts");
const TAILWIND_OUTPUT = path.join(ROOT, "tailwind.config.ts");

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
  // Keys under "shadow.*" use the last segment (xs, s, md, lg, xl).
  // Keys outside (ej. "glow.brand") use the full path camelCased (glowBrand).
  const shadows = compound.filter((c) => c.type === "shadow");
  if (shadows.length > 0) {
    lines.push(`export const shadowValue: Record<string, string> = {`);
    for (const c of shadows) {
      const segs = c.pathSegments;
      const key =
        segs[0] === "shadow" && segs.length === 2 && segs[1] !== undefined
          ? segs[1]
          : segs
              .map((s, i) => (i === 0 || s.length === 0 ? s : s[0]!.toUpperCase() + s.slice(1)))
              .join("");
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
// emitTailwind — generates tailwind.config.ts from token tree
// --------------------------------------------------------------

/**
 * Converts an atomic token's path + fallback value to a Tailwind theme value.
 * For colors, the value is a CSS var reference; for dimensions it's the raw px.
 */
function tailwindValue(t: AtomicToken): string {
  if (t.type === "color") {
    return `var(--${t.cssVarName}, ${t.fallback})`;
  }
  return t.fallback;
}

/**
 * Builds a nested plain-object string (for codegen) from a path array and value.
 * E.g. ["primary", "500"] -> { primary: { "500": value } }
 * Returns the accumulated result in the `out` map.
 */
function deepSet(
  out: Map<string, unknown>,
  segments: string[],
  value: string,
): void {
  let cur: Map<string, unknown> = out;
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i];
    if (seg === undefined) continue;
    if (!cur.has(seg)) {
      cur.set(seg, new Map<string, unknown>());
    }
    const child = cur.get(seg);
    if (!(child instanceof Map)) {
      // Conflict: leaf exists where we expect a group — skip
      return;
    }
    cur = child;
  }
  const last = segments[segments.length - 1];
  if (last !== undefined) {
    cur.set(last, value);
  }
}

/** Quotes a JS object key if it requires quoting (hyphens, digits-first, etc.). */
function quoteKey(key: string): string {
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) return key;
  return JSON.stringify(key);
}

/** Serializes a Map/string tree to a formatted JS object literal string. */
function serializeMap(m: Map<string, unknown>, indentLevel: number): string {
  const pad = "  ".repeat(indentLevel);
  const inner = "  ".repeat(indentLevel + 1);
  const parts: string[] = [];
  for (const [key, val] of m) {
    const k = quoteKey(key);
    if (val instanceof Map) {
      parts.push(`${inner}${k}: ${serializeMap(val, indentLevel + 1)}`);
    } else {
      parts.push(`${inner}${k}: ${JSON.stringify(val as string)}`);
    }
  }
  return `{\n${parts.join(",\n")}\n${pad}}`;
}

/**
 * Emitts the full tailwind.config.ts from the token tree.
 * - Colors: all atomic tokens of type "color" (color.* and feedback.*)
 * - Spacing: atomic tokens of type "dimension" where path starts with "size"
 * - BorderRadius: atomic tokens where path starts with "radius"
 * - BoxShadow: compound shadow tokens (shadow.* and glow.*)
 * - FontSize: atomic tokens of type "dimension" where path starts with "typography.fontSize"
 * - staticOverrides (fontFamily, content) deep-merged over generated theme.extend
 */
function emitTailwind(atomic: AtomicToken[], compound: CompoundToken[]): void {
  // --- Colors ---
  // Strip the leading "color" segment from primitive tokens so
  // "color.primary.50" becomes "primary.50" in the Tailwind theme
  // (matching the original hand-maintained structure).
  // Semantic tokens (feedback.*, brand.*, text.*, etc.) keep their path as-is.
  const colors = new Map<string, unknown>();
  for (const t of atomic) {
    if (t.type !== "color") continue;
    const segs =
      t.pathSegments[0] === "color"
        ? t.pathSegments.slice(1)
        : t.pathSegments;
    if (segs.length === 0) continue;
    deepSet(colors, segs, tailwindValue(t));
  }

  // --- Spacing (size.*) ---
  const spacing = new Map<string, unknown>();
  for (const t of atomic) {
    if (t.type !== "dimension") continue;
    if (t.pathSegments[0] !== "size") continue;
    // Key: "ds-xs", "ds-s", etc. — use "ds-" prefix + last segment
    const seg = t.pathSegments[t.pathSegments.length - 1];
    if (seg !== undefined) {
      spacing.set(`ds-${seg}`, t.fallback);
    }
  }

  // --- BorderRadius (radius.*) ---
  const borderRadius = new Map<string, unknown>();
  for (const t of atomic) {
    if (t.type !== "dimension") continue;
    if (t.pathSegments[0] !== "radius") continue;
    const seg = t.pathSegments[t.pathSegments.length - 1];
    if (seg !== undefined) {
      borderRadius.set(`ds-${seg}`, t.fallback);
    }
  }

  // --- BoxShadow (compound shadow tokens) ---
  const boxShadow = new Map<string, unknown>();
  for (const c of compound) {
    if (c.type !== "shadow") continue;
    const segs = c.pathSegments;
    // Key strategy: "shadow.xs" -> "ds-xs"; "glow.brand" -> "ds-ne" (compat) or "glow-brand"
    let key: string;
    if (segs[0] === "shadow" && segs.length === 2 && segs[1] !== undefined) {
      key = `ds-${segs[1]}`;
    } else if (segs[0] === "glow" && segs[1] !== undefined) {
      key = `ds-${segs[1]}`;
    } else {
      key = segs.map((s, i) => (i === 0 ? s : s[0] !== undefined ? s[0].toUpperCase() + s.slice(1) : s)).join("");
    }
    boxShadow.set(key, emitShadow(c.value));
  }

  // --- FontSize (typography.fontSize.*) ---
  // Build a map like ds-xs / ds-sm etc. from the existing ds-* naming convention.
  // The token paths are "typography.fontSize.12", "typography.fontSize.14" etc.
  // We map the pixel value to the existing ds-* alias names.
  const pxToDsAlias: Record<string, string> = {
    "12px": "ds-xs",
    "14px": "ds-sm",
    "16px": "ds-md",
    "18px": "ds-lg",
    "22px": "ds-xl",
    "24px": "ds-2xl",
    "30px": "ds-3xl",
    "36px": "ds-4xl",
  };

  const fontSize = new Map<string, unknown>();
  for (const t of atomic) {
    if (t.type !== "dimension") continue;
    if (t.pathSegments[0] !== "typography" || t.pathSegments[1] !== "fontSize") continue;
    const alias = pxToDsAlias[t.fallback];
    const key = alias ?? `ds-${t.pathSegments[t.pathSegments.length - 1]}`;
    // Tailwind fontSize expects [size, { lineHeight }] tuple
    fontSize.set(key, [t.fallback, { lineHeight: "1" }]);
  }

  // --- Static overrides (fontFamily, content) ---
  const staticFontFamily = staticOverrides.theme.extend.fontFamily;
  const content = staticOverrides.content;

  // --- Build the config string ---
  const lines: string[] = [];

  lines.push(`// AUTO-GENERATED from tokens/source/*.tokens.json — do NOT edit by hand.`);
  lines.push(`// To regenerate: npm run tokens:generate`);
  lines.push(`// To add/change fontFamily or content globs, edit tailwind.static.ts instead.`);
  lines.push(``);
  lines.push(`import type { Config } from "tailwindcss";`);
  lines.push(``);
  lines.push(`export default {`);
  lines.push(`  content: ${JSON.stringify(Array.from(content))},`);
  lines.push(`  theme: {`);
  lines.push(`    extend: {`);

  // colors
  lines.push(`      colors: ${indent(serializeMap(colors, 3), 3)},`);

  // fontFamily (from static overrides)
  lines.push(`      fontFamily: {`);
  for (const [name, families] of Object.entries(staticFontFamily)) {
    lines.push(`        ${name}: ${JSON.stringify(families)},`);
  }
  lines.push(`      },`);

  // fontSize
  if (fontSize.size > 0) {
    lines.push(`      fontSize: ${indent(serializeFontSize(fontSize), 3)},`);
  }

  // spacing
  if (spacing.size > 0) {
    lines.push(`      spacing: ${indent(serializeMap(spacing, 3), 3)},`);
  }

  // borderRadius
  if (borderRadius.size > 0) {
    lines.push(`      borderRadius: ${indent(serializeMap(borderRadius, 3), 3)},`);
  }

  // boxShadow
  if (boxShadow.size > 0) {
    lines.push(`      boxShadow: ${indent(serializeMap(boxShadow, 3), 3)},`);
  }

  lines.push(`    },`);
  lines.push(`  },`);
  lines.push(`} satisfies Config;`);
  lines.push(``);

  fs.writeFileSync(TAILWIND_OUTPUT, lines.join("\n"), "utf-8");
}

/** Indents a multiline string by N levels (2-space each) after the first line. */
function indent(str: string, levels: number): string {
  const pad = "  ".repeat(levels);
  return str.replace(/\n/g, `\n${pad}`);
}

/** Serializes a fontSize Map where values are [px, { lineHeight }] tuples. */
function serializeFontSize(m: Map<string, unknown>): string {
  const inner = "  ".repeat(4);
  const parts: string[] = [];
  for (const [key, val] of m) {
    if (Array.isArray(val)) {
      const [size, opts] = val as [string, Record<string, string>];
      parts.push(`${inner}${JSON.stringify(key)}: [${JSON.stringify(size)}, { lineHeight: ${JSON.stringify(opts.lineHeight)} }]`);
    } else {
      parts.push(`${inner}${JSON.stringify(key)}: ${JSON.stringify(val as string)}`);
    }
  }
  return `{\n${parts.join(",\n")}\n${"  ".repeat(3)}}`;
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

  emitTailwind(atomic, compound);
  console.log(`Generated ${TAILWIND_OUTPUT}`);
}

main();
