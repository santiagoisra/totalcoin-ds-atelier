## Exploration: pull-tokens-figma-sync

### Current State

The Figma-to-Atelier token sync pipeline is **fully scaffolded but partially disconnected**. Here's what exists:

**Pipeline scripts:**

| Script | Status | Function |
|--------|--------|----------|
| `scripts/pull-tokens.ts` | ✅ Complete | Reads Figma variables (stdin/file/REST), transforms to W3C DTCG, writes `tokens/source/*.tokens.json` |
| `scripts/push-tokens.ts` | ❌ Stub | Has placeholder logic — no real push capability |
| `scripts/generate-tokens.ts` | ✅ Complete | Reads DTCG files, resolves references, generates `components/tokens.ts` (cssVar + token + typographyStyle + shadowValue) |
| `scripts/fetch-variables.cjs` | ✅ Complete | HTTP client to MCP Bridge on `[::1]:9223` — saves JSON for pull-tokens |
| `scripts/save-figma-data.cjs` | ✅ Complete | Helper to save/proxy figma_execute results |
| `scripts/lib/env.ts` | ✅ Complete | Loads `.env`, provides `FIGMA_ACCESS_TOKEN` + `FIGMA_FILE_KEY` |
| `scripts/lib/figma-to-dtcg.ts` | ✅ Complete | Transforms Figma API response → nested DTCG trees |

**Figma connection:**
- **File key:** `y3zmw15iLpdpYwLKSMCpP9` ("Sistema de diseño de App total coin")
- **Token:** (in `.env`, gitignored)
- **Desktop Bridge:** ✅ Connected via WebSocket on port 9223
- **REST API:** Available but requires Enterprise plan for variables endpoint
- **Current workflow:** Data is extracted via `figma_execute` (MCP tool) → saved as JSON → piped to `pull-tokens.ts`

**Token files on disk (DTCG format):**
- `tokens/source/color.tokens.json` — 5 primitives (primary, neutral, secondary, green, red) × 10 shades + 4 feedback aliases
- `tokens/source/semantic.tokens.json` — Semantic layer with brand, text, icon, bg, border, focus, feedback. MANY hardcoded values and noted drifts
- `tokens/source/typography.tokens.json` — fontFamily, fontWeight, fontSize, lineHeight, letterSpacing + compound styles (H0-H6, N1-N4)
- `tokens/source/dimension.tokens.json` — size scale (XS-XXL), grid config, borderWidth
- `tokens/source/radius.tokens.json` — radius scale (XS-L), references size.*
- `tokens/source/shadow.tokens.json` — shadow scale (XS-XL) + glow.brand

**Generated output:**
- `components/tokens.ts` — Auto-generated 329 lines: `cssVar` flat map (121 entries), `token` nested tree, `typographyStyle`, `shadowValue`

**Figma variable collections detected (5 collections):**
1. **Color Styles** (VariableCollectionId:6274:31261) — ~40 variables: Brand/* colors (primary 50-900, secondary 50-900, neutral 0-20, grey 1-5, confirm, error, warning, disabled, bg-*), Dark/* colors, mode "Mode 1"
2. **Bordes y espaciado** (VariableCollectionId:6198:31299) — 6 variables: XS, S, MD, L, XL, XXL. Mode "Default"
3. **Semantic** (VariableCollectionId:6289:32010) — 25 variables: bg/*, brand/*, text/*, icon/*, border/default, feedback/*. **TWO modes: Light (default) + Dark**
4. **Brand Clients** (VariableCollectionId:47878:408) — 2 variables: brand/primary, brand/secondary. **FOUR modes: TotalCoin, Barceló, Siglo XXI, Lomas de Zamora**
5. **Montos sugeridos** (VariableCollectionId:6274:31284) — 7 STRING variables. Two modes. Probably not relevant for DS tokens.

### Affected Areas

- `scripts/pull-tokens.ts` — **Key drift between current DTCG files and Figma variables**: the DTCG files were manually curated (with notes like "hipótesis", "no verificado", "TODO drill-down") rather than auto-generated from a fresh Figma pull. A fresh pull would resolve these uncertainties.
- `scripts/lib/figma-to-dtcg.ts` — `collectionToFileName()` doesn't match all Figma collection names correctly (e.g., "Color Styles" doesn't match "primitive" or "colores"). The `collectionToFileName()` mapping needs updating for the actual Figma collection names.
- `tokens/source/color.tokens.json` — The DTCG has 5 primitives × 10 shades (50 tokens). Figma "Color Styles" has ~40 variables but includes: Brand/color-grey-1..5 (not in DTCG), Brand/color-neutral-0,20, Brand/color-bg-white, Brand/color-bg-primary, Brand/color-confirm, Brand/color-warning-500, Brand/color-error, Brand/color-disabled. There are **new tokens in Figma not in DTCG** (warning-500, confirm, grey 1-5, bg-white, bg-primary, neutral-0, neutral-20).
- `tokens/source/semantic.tokens.json` — This was manually curated and has INACCURACIES (see drift notes in the file). A fresh Figma pull should be the source of truth. The Semantic collection in Figma properly uses VARIABLE_ALIAS references that the DTCG resolution system handles correctly.
- `tokens/source/brand-clients.tokens.json` — **Does not exist yet.** Brand Clients collection in Figma has 2 variables with 4 modes each. No DTCG file for this.
- `components/tokens.ts` — Auto-generated. Will need regeneration after DTCG files are updated.
- `components/ThemeProvider/ThemeProvider.tsx` — References Dark/* tokens that don't exist in DTCG. The Semantic collection already HAS a Dark mode with correct values — a fresh pull would populate them.

### Approaches

1. **Full Pull from Bridge** — Run a complete `pull-tokens.ts` from the Desktop Bridge data
   - Pros: Fresh canonical data, resolves all drift notes, auto-generates Dark mode, captures Brand Clients
   - Cons: Requires `figma_execute` roundtrip, manual curation notes would be lost
   - Effort: Low (the tooling is ready, just needs execution)

2. **Incremental DTCG Update** — Manually add only the missing tokens (warning, grey scale, Brand Clients) while keeping manually curated values
   - Pros: Preserves curated descriptions and drift notes
   - Cons: Perpetuates inaccuracies, doesn't solve Dark mode gap, manual effort
   - Effort: Medium

3. **Automated Sync with Diff** — Run full pull but preserve a curation layer (e.g., a `_curation` meta-file with manual overrides that gets re-applied after each pull)
   - Pros: Best of both worlds — canonical data + curated annotations
   - Cons: More complex, adds a post-processing step
   - Effort: Medium-High

### Recommendation

**Approach 1 — Full Pull from Bridge.** The pipeline tools are already complete and tested. The Figma Desktop Bridge is connected. The gap is purely execution: extract variables via `figma_execute`, pipe through `pull-tokens.ts`, then regenerate `components/tokens.ts`. This will:

1. Resolve all uncertainty notes in semantic.tokens.json (the Semantic collection properly uses aliases)
2. Add missing tokens (warning-500, grey scale, confirm, brand Clients)
3. Bring in Dark mode values for the Semantic collection (needed by ThemeProvider)
4. Create `brand-clients.tokens.json` for multi-brand support
5. Let us validate by diffing against current files

After the pull, a human review pass can re-add any $description annotations that carry useful context (contrast ratios, usage guidelines). Those belong in DTCG `$description` fields, not as separate curation files.

### Risks

- **Collection name mismatch:** `collectionToFileName()` may not map "Color Styles" correctly (it maps to `color.tokens.json` only if name includes "primitive" or "colores" — "Color Styles" in Spanish doesn't match). The function needs a new mapping entry for "Color Styles" OR we rename the Figma collection.
- **Dark mode creates new files:** The Semantic collection's Dark mode will produce `semantic-dark.tokens.json` (or similar) unless explicitly filtered with `--mode Light`. We need to decide: one file per mode, or only Light mode with Dark as overrides?
- **Brand Clients multi-brand:** 4 modes in the Brand Clients collection means 4 DTCG files. The current pipeline assumes one mode per collection — this needs validation/testing.
- **$description loss:** A full pull drops all manually written descriptions (contrast ratios, drift notes). These need to be captured in a separate reference doc before pulling, or added back after.

### Ready for Proposal
Yes
