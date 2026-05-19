/**
 * Transforma la respuesta de la Figma Variables API a formato W3C DTCG.
 *
 * Figma Variables API responde con:
 *   meta.variableCollections  → { [id]: { id, name, modes: [{id,name}], defaultModeId } }
 *   meta.variables            → { [id]: { id, name, resolvedType, variableCollectionId, valuesByMode, description } }
 *
 * Los valores por modo pueden ser:
 *   - Color:    { r: 0..1, g: 0..1, b: 0..1, a: 0..1 }
 *   - Alias:    { type: "VARIABLE_ALIAS", id: "VariableID:..." }
 *   - Primitivo: number | string | boolean
 *
 * Salida: árboles DTCG anidados con $type, $value, $description.
 */

// --------------------------------------------------------------
// Figma API types
// --------------------------------------------------------------

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaAlias {
  type: "VARIABLE_ALIAS";
  id: string;
}

export type FigmaModeValue =
  | FigmaColor
  | FigmaAlias
  | number
  | string
  | boolean;

export interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  variableCollectionId: string;
  valuesByMode: Record<string, FigmaModeValue>;
  description: string | undefined;
  scopes: string[] | undefined;
  hiddenFromPublishing: boolean | undefined;
}

interface FigmaMode {
  id: string;
  name: string;
}

interface FigmaCollection {
  id: string;
  name: string;
  modes: FigmaMode[];
  defaultModeId: string;
}

interface FigmaVariablesResponse {
  meta: {
    variableCollections: Record<string, FigmaCollection>;
    variables: Record<string, FigmaVariable>;
  };
  status?: number;
  error?: boolean;
}

// --------------------------------------------------------------
// DTCG output types
// --------------------------------------------------------------

interface DTCGToken {
  $type?: string;
  $value: unknown;
  $description?: string;
}

type DTCGTree = { [key: string]: DTCGTree | DTCGToken };

// --------------------------------------------------------------
// Color conversion: Figma {r,g,b,a} 0-1 → CSS hex
// --------------------------------------------------------------

function figmaColorToHex(c: FigmaColor): string {
  const r = Math.round(c.r * 255);
  const g = Math.round(c.g * 255);
  const b = Math.round(c.b * 255);
  const a = c.a;

  if (a < 1) {
    // RGBA con alpha → #rrggbbaa
    const alpha = Math.round(a * 255);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}${alpha.toString(16).padStart(2, "0")}`;
  }
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// --------------------------------------------------------------
// Figma resolvedType → DTCG $type mapping
// --------------------------------------------------------------

const FIGMA_TYPE_TO_DTCG: Record<string, string> = {
  COLOR: "color",
  FLOAT: "number",
  STRING: "string",
  BOOLEAN: "boolean",
};

// --------------------------------------------------------------
// Resolve a Figma mode value to DTCG $value
// --------------------------------------------------------------

function resolveModeValue(
  raw: FigmaModeValue,
  variables: Record<string, FigmaVariable>,
  modeId: string,
): unknown {
  // Alias → DTCG reference {collection.group.token}
  if (typeof raw === "object" && raw !== null && "type" in raw && raw.type === "VARIABLE_ALIAS") {
    const alias = raw as FigmaAlias;
    const targetVar = variables[alias.id];
    if (!targetVar) {
      console.warn(`  [warn] Alias apunta a variable inexistente: ${alias.id} — omitiendo token.`);
      return null; // caller will skip this token
    }
    // Figma names usan "/" como separador → DTCG usa "." en las referencias
    const refPath = targetVar.name.replace(/\//g, ".");
    return `{${refPath}}`;
  }

  // Color → hex
  if (typeof raw === "object" && raw !== null && "r" in raw) {
    return figmaColorToHex(raw as FigmaColor);
  }

  // FLOAT → number (si es dimension le agregamos "px" en post-proceso)
  if (typeof raw === "number") {
    return raw;
  }

  // STRING / BOOLEAN → directo
  return raw;
}

// --------------------------------------------------------------
// Build a nested DTCG tree from a flat list of Figma variables
// --------------------------------------------------------------

function insertIntoTree(tree: DTCGTree, segments: string[], token: DTCGToken): void {
  let current = tree;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]!;
    if (i === segments.length - 1) {
      // Hoja → es el token
      current[seg] = token;
    } else {
      // Rama → asegurar que existe un sub-árbol
      if (!(seg in current) || !isTree(current[seg])) {
        current[seg] = {} as DTCGTree;
      }
      current = current[seg] as DTCGTree;
    }
  }
}

function isTree(val: unknown): val is DTCGTree {
  return typeof val === "object" && val !== null && !("$value" in val);
}

// --------------------------------------------------------------
// Collection name → output file mapping
// --------------------------------------------------------------

/**
 * Mapea el nombre de la colección de Figma al nombre de archivo DTCG.
 * El DS de TotalCoin usa estas colecciones:
 *   - "Color Styles" → color.tokens.json
 *   - "Semantic" → semantic.tokens.json
 *   - "Bordes y espaciado" → dimension.tokens.json
 *   - "Brand Clients" → brand-clients.tokens.json
 *   - "Montos sugeridos" → null (excluded — not design tokens)
 *
 * Retorna null para colecciones que deben ser excluidas del pull.
 * Si no coincide con ninguno conocido, usa el nombre sanitizado.
 */
export function collectionToFileName(collectionName: string): string | null {
  const lower = collectionName.toLowerCase().trim();

  // "Montos sugeridos" — excluded, not design tokens
  if (lower.includes("montos") && lower.includes("sugeridos")) {
    return null;
  }

  // "Brand Clients" — excluded, per-client overrides, not part of TotalCoin design system
  if (lower.includes("brand") && lower.includes("client")) {
    return null;
  }

  // Colecciones de color primitivo
  if (
    lower.includes("primitive") ||
    lower.includes("colores") ||
    lower.includes("color style") ||
    lower === "color" ||
    lower === "colors"
  ) {
    return "color.tokens.json";
  }

  // Colección semántica
  if (
    lower.includes("semantic") ||
    lower === "semántico"
  ) {
    return "semantic.tokens.json";
  }

  // Spacing / dimensiones / bordes
  if (
    lower.includes("borde") ||
    lower.includes("espaciado") ||
    lower.includes("spacing") ||
    lower.includes("dimension")
  ) {
    return "dimension.tokens.json";
  }

  // Brand clients (multi-brand)
  if (lower.includes("brand client")) {
    return "brand-clients.tokens.json";
  }

  // Fallback: sanitizar nombre
  const safe = lower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${safe}.tokens.json`;
}

/**
 * Sanitiza un nombre de modo para usarlo como sufijo de archivo.
 * "Dark" → "dark", "Siglo XXI" → "siglo-xxi", "Lomas de Zamora" → "lomas-de-zamora"
 */
function sanitizeModeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Construye el nombre de archivo para un modo específico.
 * Si es el modo default, retorna baseName sin modificar.
 * Si no, inserta un sufijo "-{mode-slug}" antes de ".tokens.json".
 */
function buildModeFileName(baseName: string, modeName: string, isDefault: boolean): string {
  if (isDefault) return baseName;
  const slug = sanitizeModeName(modeName);
  const ext = ".tokens.json";
  if (baseName.endsWith(ext)) {
    return baseName.slice(0, -ext.length) + "-" + slug + ext;
  }
  // Fallback: reemplazar extensión .json
  return baseName.replace(/\.json$/, `-${slug}.json`);
}

// --------------------------------------------------------------
// Main transform: Figma response → per-collection DTCG trees
// --------------------------------------------------------------

export interface CollectionOutput {
  fileName: string;
  collectionName: string;
  tree: DTCGTree;
  modeName: string;
  stats: { total: number; aliases: number; colors: number; numbers: number; strings: number; booleans: number };
}

export function transformFigmaToDTCG(
  response: FigmaVariablesResponse,
  targetMode?: string,
): CollectionOutput[] {
  const { variableCollections, variables } = response.meta;
  const results: CollectionOutput[] = [];

  for (const [collId, collection] of Object.entries(variableCollections)) {
    // --- Step 1: resolve base filename (null = excluded) ---
    const baseFileName = collectionToFileName(collection.name);
    if (!baseFileName) {
      console.log(`[skip] Colección "${collection.name}" — excluida (no es token de diseño).`);
      continue;
    }

    // Filtrar variables de esta colección
    const collVars = Object.values(variables).filter(
      (v) => v.variableCollectionId === collId,
    );

    if (collVars.length === 0) continue;

    // --- Step 2: determine which modes to process ---
    const modesToProcess = targetMode
      ? collection.modes.filter((m) => m.name.toLowerCase() === targetMode.toLowerCase())
      : collection.modes; // ALL modes when no targetMode

    if (modesToProcess.length === 0) {
      console.warn(
        `[warn] No se encontró modo "${targetMode ?? "default"}" en colección "${collection.name}". Saltando.`,
      );
      continue;
    }

    // --- Step 3: produce one output per mode ---
    for (const mode of modesToProcess) {
      const isDefaultMode = mode.id === collection.defaultModeId;
      const fileName = buildModeFileName(baseFileName, mode.name, isDefaultMode || modesToProcess.length === 1);

      const stats = { total: 0, aliases: 0, colors: 0, numbers: 0, strings: 0, booleans: 0 };
      const tree: DTCGTree = {};

      for (const variable of collVars) {
        const rawValue = variable.valuesByMode[mode.id];
        if (rawValue === undefined) {
          continue;
        }

        const resolved = resolveModeValue(rawValue, variables, mode.id);
        if (resolved === null) continue; // skip unresolvable aliases

        const isAlias =
          typeof rawValue === "object" && rawValue !== null && "type" in rawValue && (rawValue as FigmaAlias).type === "VARIABLE_ALIAS";

        const dtcgType = FIGMA_TYPE_TO_DTCG[variable.resolvedType] ?? "string";

        // Contar stats
        stats.total++;
        if (isAlias) stats.aliases++;
        else if (dtcgType === "color") stats.colors++;
        else if (dtcgType === "number") stats.numbers++;
        else if (dtcgType === "string") stats.strings++;
        else if (dtcgType === "boolean") stats.booleans++;

        // Figma usa "/" como separador de grupos en el nombre
        // ej: "brand/primary" → segments ["brand", "primary"]
        const segments = variable.name.split("/");

        const token: DTCGToken = {
          $type: dtcgType,
          $value: resolved,
        };
        if (variable.description) {
          token.$description = variable.description;
        }

        insertIntoTree(tree, segments, token);
      }

      if (stats.total === 0) continue; // skip empty mode outputs

      results.push({
        fileName,
        collectionName: collection.name,
        tree,
        modeName: mode.name,
        stats,
      });
    }
  }

  return results;
}

// --------------------------------------------------------------
// Re-export types for consumers
// --------------------------------------------------------------

export type { FigmaVariablesResponse, FigmaCollection, DTCGTree, DTCGToken };
