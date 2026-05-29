/**
 * DTCG transform helpers for the Figma agent-bridge pipeline.
 *
 * The agent calls Figma MCP (get_variable_defs + get_design_context) and
 * writes tokens/.figma-dump.json. This module converts that raw dump into
 * W3C DTCG token trees and detects drift against on-disk files.
 *
 * All functions are pure — no filesystem I/O, no MCP calls.
 */

// ---------------------------------------------------------------------------
// Raw Figma MCP types — shape of get_variable_defs output
// ---------------------------------------------------------------------------

export interface FigmaVariableValue {
  r?: number;
  g?: number;
  b?: number;
  a?: number;
}

export interface FigmaVariableAlias {
  type: "VARIABLE_ALIAS";
  id: string;
}

export type FigmaResolvedValue =
  | string
  | number
  | boolean
  | FigmaVariableValue
  | FigmaVariableAlias;

export interface FigmaVariable {
  id: string;
  name: string;
  variableCollectionId: string;
  resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  valuesByMode: Record<string, FigmaResolvedValue>;
  description?: string;
  remote?: boolean;
  key?: string;
  hiddenFromPublishing?: boolean;
  scopes?: string[];
}

export interface FigmaVariableCollection {
  id: string;
  name: string;
  modes: Array<{ modeId: string; name: string }>;
  defaultModeId: string;
  variables: string[]; // variable IDs
}

export interface FigmaVariableDefs {
  variables: Record<string, FigmaVariable>;
  variableCollections: Record<string, FigmaVariableCollection>;
  meta?: Record<string, unknown>;
}

// Shape of text style data from get_design_context (typography frame)
export interface FigmaTextStyle {
  name: string;
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  lineHeight?: number | string;
  letterSpacing?: number | string;
  description?: string;
}

// ---------------------------------------------------------------------------
// The dump file written by the agent
// ---------------------------------------------------------------------------

export interface FigmaDump {
  variables: FigmaVariableDefs | Record<string, unknown>;
  textStyles: FigmaTextStyle[] | Record<string, unknown>;
  meta: { fileKey: string; extractedAt: string };
}

// ---------------------------------------------------------------------------
// DTCG types
// ---------------------------------------------------------------------------

export interface DtcgToken {
  $type: string;
  $value: unknown;
  $description?: string;
}

export type DtcgTokenTree = { [key: string]: DtcgTokenTree | DtcgToken };

export interface DriftReport {
  path: string;
  oldVal: unknown;
  newVal: unknown;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function isDtcgToken(val: unknown): val is DtcgToken {
  return (
    typeof val === "object" &&
    val !== null &&
    "$value" in val &&
    !Array.isArray(val)
  );
}

/**
 * Converts a Figma RGBA object (0–1 float channels) to a CSS hex string.
 * Alpha < 1 produces an 8-char hex (#rrggbbaa). Alpha === 1 → 6-char hex.
 */
function rgbaToHex(rgba: FigmaVariableValue): string {
  const r = Math.round((rgba.r ?? 0) * 255);
  const g = Math.round((rgba.g ?? 0) * 255);
  const b = Math.round((rgba.b ?? 0) * 255);
  const a = rgba.a ?? 1;

  const hex = (n: number): string => n.toString(16).padStart(2, "0");
  if (a < 1) {
    const aHex = Math.round(a * 255);
    return `#${hex(r)}${hex(g)}${hex(b)}${hex(aHex)}`;
  }
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/**
 * Converts a Figma variable name (e.g. "color/primary/500") to a
 * nested DTCG key path. Figma uses "/" as separator; we split on it.
 * Forward slashes and spaces are normalized to camelCase-friendly segments.
 */
function figmaNameToPath(name: string): string[] {
  return name
    .split("/")
    .map((seg) => seg.trim().replace(/\s+/g, "-").toLowerCase())
    .filter((seg) => seg.length > 0);
}

/**
 * Converts a Figma collection name to a safe file-system + token prefix.
 * E.g. "Colores primitivos" -> "colores-primitivos"
 */
export function collectionNameToKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Deep-sets a value in a DTCG tree following a path array.
 * Intermediate nodes are created as plain objects (token groups).
 */
function setAtPath(
  tree: DtcgTokenTree,
  pathSegments: string[],
  token: DtcgToken,
): void {
  let cur: DtcgTokenTree = tree;
  for (let i = 0; i < pathSegments.length - 1; i++) {
    const seg = pathSegments[i];
    if (seg === undefined) continue;
    const existing = cur[seg];
    if (existing === undefined || isDtcgToken(existing)) {
      cur[seg] = {};
    }
    cur = cur[seg] as DtcgTokenTree;
  }
  const last = pathSegments[pathSegments.length - 1];
  if (last !== undefined) {
    cur[last] = token;
  }
}

/** Type guard for FigmaVariableValue (RGBA object). */
function isFigmaColor(val: unknown): val is FigmaVariableValue {
  return (
    typeof val === "object" &&
    val !== null &&
    !Array.isArray(val) &&
    ("r" in val || "g" in val || "b" in val)
  );
}

/** Type guard for FigmaVariableAlias. */
function isFigmaAlias(val: unknown): val is FigmaVariableAlias {
  return (
    typeof val === "object" &&
    val !== null &&
    (val as FigmaVariableAlias).type === "VARIABLE_ALIAS"
  );
}

/** Checks if an object looks like a valid FigmaVariableDefs response. */
function isFigmaVariableDefs(val: unknown): val is FigmaVariableDefs {
  return (
    typeof val === "object" &&
    val !== null &&
    "variables" in val &&
    "variableCollections" in val
  );
}

// ---------------------------------------------------------------------------
// parseFigmaVariables
// ---------------------------------------------------------------------------

/**
 * Converts the `variables` section of a FigmaDump to a map of
 * collectionKey -> DtcgTokenTree.
 *
 * Each Figma Variable collection becomes one entry in the returned map.
 * The caller writes one `<collectionKey>.tokens.json` per entry.
 *
 * Variable aliases (VARIABLE_ALIAS) are converted to `{path.to.token}`
 * DTCG reference strings. Color values (RGBA float) are hex-encoded.
 */
export function parseFigmaVariables(
  dump: FigmaDump,
): Record<string, DtcgTokenTree> {
  const raw = dump.variables;

  if (!isFigmaVariableDefs(raw)) {
    // Graceful: return empty map if the dump section is not the expected shape
    return {};
  }

  const defs = raw;
  const collections = defs.variableCollections;
  const variables = defs.variables;

  // Build a map from variable ID -> its name segments so alias resolution can
  // produce `{path.to.token}` reference strings.
  const idToPath: Record<string, string[]> = {};
  for (const variable of Object.values(variables)) {
    idToPath[variable.id] = figmaNameToPath(variable.name);
  }

  // Output: one tree per collection
  const result: Record<string, DtcgTokenTree> = {};

  for (const collection of Object.values(collections)) {
    const collKey = collectionNameToKey(collection.name);
    const tree: DtcgTokenTree = {};

    // Use the default mode for value extraction
    const modeId = collection.defaultModeId;

    for (const varId of collection.variables) {
      const variable = variables[varId];
      if (!variable) continue;

      // Skip variables from other collections (shouldn't happen but be safe)
      if (variable.variableCollectionId !== collection.id) continue;

      const rawValue = variable.valuesByMode[modeId];
      if (rawValue === undefined) continue;

      let dtcgType: string;
      let dtcgValue: unknown;

      if (isFigmaAlias(rawValue)) {
        // Resolve alias to {path.to.token} reference string
        const targetPath = idToPath[rawValue.id];
        if (targetPath) {
          dtcgValue = `{${targetPath.join(".")}}`;
        } else {
          // Unknown alias target — use the ID as a comment/fallback
          dtcgValue = `{unknown.${rawValue.id}}`;
        }
        // Type will match the referenced token; keep resolvedType as hint
        dtcgType = variable.resolvedType === "COLOR" ? "color" : "dimension";
      } else if (isFigmaColor(rawValue)) {
        dtcgType = "color";
        dtcgValue = rgbaToHex(rawValue);
      } else if (variable.resolvedType === "FLOAT") {
        dtcgType = "dimension";
        // Figma floats for spacing/radius are in px; emit as "Npx"
        dtcgValue = `${String(rawValue)}px`;
      } else if (variable.resolvedType === "STRING") {
        dtcgType = "fontFamily";
        dtcgValue = rawValue;
      } else if (variable.resolvedType === "BOOLEAN") {
        dtcgType = "number";
        dtcgValue = rawValue ? 1 : 0;
      } else {
        dtcgType = "string";
        dtcgValue = rawValue;
      }

      const pathSegments = figmaNameToPath(variable.name);

      const token: DtcgToken = { $type: dtcgType, $value: dtcgValue };
      if (variable.description && variable.description.trim().length > 0) {
        token.$description = variable.description.trim();
      }

      setAtPath(tree, pathSegments, token);
    }

    result[collKey] = tree;
  }

  return result;
}

// ---------------------------------------------------------------------------
// parseFigmaTextStyles
// ---------------------------------------------------------------------------

/**
 * Converts the `textStyles` section of a FigmaDump to a single DtcgTokenTree
 * containing `$type: "typography"` compound nodes.
 *
 * If textStyles is not an array or is empty, returns null (caller skips the
 * file write and prints a warning).
 */
export function parseFigmaTextStyles(dump: FigmaDump): DtcgTokenTree | null {
  const raw = dump.textStyles;

  // Accept both array (preferred) and object/map shapes from get_design_context
  let styles: FigmaTextStyle[];

  if (Array.isArray(raw)) {
    if (raw.length === 0) return null;
    styles = raw as FigmaTextStyle[];
  } else if (typeof raw === "object" && raw !== null) {
    // Some get_design_context shapes return an object keyed by style name
    const entries = Object.values(raw as Record<string, unknown>);
    if (entries.length === 0) return null;
    styles = entries.filter(
      (e): e is FigmaTextStyle =>
        typeof e === "object" && e !== null && "name" in e,
    );
    if (styles.length === 0) return null;
  } else {
    return null;
  }

  const tree: DtcgTokenTree = {
    typography: {},
  };

  const typographyGroup = tree["typography"] as DtcgTokenTree;

  for (const style of styles) {
    // Normalize style name: "Brand/H1" -> ["brand", "h1"] -> key "h1"
    // We group under the last segment for ergonomic access
    const nameParts = style.name
      .split("/")
      .map((s) => s.trim().toLowerCase().replace(/\s+/g, "-"));

    // Build the style value object
    const styleValue: Record<string, unknown> = {};

    if (style.fontFamily) {
      styleValue.fontFamily = [style.fontFamily, "sans-serif"];
    }
    if (typeof style.fontWeight === "number") {
      styleValue.fontWeight = style.fontWeight;
    }
    if (typeof style.fontSize === "number") {
      styleValue.fontSize = `${style.fontSize}px`;
    }
    if (style.lineHeight !== undefined) {
      const lh =
        typeof style.lineHeight === "number"
          ? style.lineHeight
          : parseFloat(String(style.lineHeight));
      if (!Number.isNaN(lh)) styleValue.lineHeight = lh;
    }
    if (style.letterSpacing !== undefined) {
      const ls =
        typeof style.letterSpacing === "number"
          ? `${style.letterSpacing}px`
          : String(style.letterSpacing);
      styleValue.letterSpacing = ls;
    }

    const token: DtcgToken = {
      $type: "typography",
      $value: styleValue,
    };

    if (style.description && style.description.trim().length > 0) {
      token.$description = style.description.trim();
    }

    // Nest under typography group using remaining path segments
    // e.g. "Brand/H1" -> typographyGroup.brand.h1 or typographyGroup.h1
    if (nameParts.length > 1) {
      // Use full path under typography
      setAtPath(typographyGroup, nameParts, token);
    } else {
      const key = nameParts[0];
      if (key !== undefined) {
        typographyGroup[key] = token;
      }
    }
  }

  return tree;
}

// ---------------------------------------------------------------------------
// diffTokenTrees
// ---------------------------------------------------------------------------

/**
 * Flat-compares `$value` of matching paths between two DTCG trees.
 * Returns one DriftReport entry per path where the value changed.
 * Added tokens (only in `next`) are reported with oldVal = undefined.
 * Removed tokens (only in `old`) are NOT reported (deletion is not a drift).
 */
export function diffTokenTrees(
  old: DtcgTokenTree,
  next: DtcgTokenTree,
): DriftReport[] {
  const drifts: DriftReport[] = [];

  function walk(
    oldNode: unknown,
    nextNode: unknown,
    prefix: string[],
  ): void {
    if (isDtcgToken(nextNode)) {
      const newVal = nextNode.$value;
      if (isDtcgToken(oldNode)) {
        const oldVal = oldNode.$value;
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          drifts.push({ path: prefix.join("."), oldVal, newVal });
        }
      } else {
        // Token is new — report it
        drifts.push({ path: prefix.join("."), oldVal: undefined, newVal });
      }
      return;
    }

    if (typeof nextNode === "object" && nextNode !== null) {
      for (const key of Object.keys(nextNode as object)) {
        if (key.startsWith("$")) continue;
        const nextChild = (nextNode as DtcgTokenTree)[key];
        const oldChild =
          typeof oldNode === "object" && oldNode !== null
            ? (oldNode as DtcgTokenTree)[key]
            : undefined;
        walk(oldChild, nextChild, [...prefix, key]);
      }
    }
  }

  walk(old, next, []);
  return drifts;
}
