# Token Pipeline Specification

## Purpose

Define the behavior of the Figma → DTCG → `tokens.ts` extraction pipeline. This spec covers collection extraction, multi-mode handling, generation, validation, and rollback for the `npm run tokens:pull && npm run tokens:generate` workflow.

## Requirements

### Requirement: Collection-to-Filename Mapping

The system MUST map each Figma variable collection name to a deterministic DTCG filename via `collectionToFileName()`.

| Figma Collection Name | Output File |
|---|---|
| `Color Styles` | `tokens/source/color.tokens.json` |
| `Bordes y espaciado` | `tokens/source/dimension.tokens.json` |
| `Semantic` | `tokens/source/semantic.tokens.json` |
| `Brand Clients` | `tokens/source/brand-clients.tokens.json` |
| `Montos sugeridos` | (MUST be excluded from pull) |

#### Scenario: All collections mapped correctly

- GIVEN a Figma file with 5 collections: "Color Styles", "Bordes y espaciado", "Semantic", "Brand Clients", "Montos sugeridos"
- WHEN `collectionToFileName()` is called for each collection
- THEN it returns the exact filenames from the mapping table
- AND `Montos sugeridos` is excluded from output

#### Scenario: Unknown collection name

- GIVEN a Figma collection with a name not in the mapping table
- WHEN `collectionToFileName()` receives it
- THEN the pipeline MUST log a warning and skip the collection

### Requirement: Multi-Mode Collections

Collections with multiple modes MUST produce one DTCG file per mode, named with a `-{mode}` suffix (e.g., `semantic-dark.tokens.json`). Single-mode collections MUST produce a file without suffix.

#### Scenario: Semantic collection with Light and Dark modes

- GIVEN the "Semantic" collection has modes "Light" (default) and "Dark"
- WHEN the pipeline extracts this collection
- THEN it produces `tokens/source/semantic.tokens.json` with Light values
- AND it produces `tokens/source/semantic-dark.tokens.json` with Dark values

#### Scenario: Brand Clients collection with 4 modes

- GIVEN the "Brand Clients" collection has modes "TotalCoin", "Barceló", "Siglo XXI", "Lomas de Zamora"
- WHEN the pipeline extracts this collection
- THEN it produces `tokens/source/brand-clients-totalcoin.tokens.json`, `brand-clients-barcelo.tokens.json`, `brand-clients-siglo-xxi.tokens.json`, `brand-clients-lomas-de-zamora.tokens.json`

#### Scenario: Single-mode collection

- GIVEN the "Color Styles" collection has exactly one mode
- WHEN the pipeline extracts it
- THEN it produces `tokens/source/color.tokens.json` without any mode suffix

### Requirement: Token Generation

`npm run tokens:generate` MUST consume ALL `.tokens.json` files in `tokens/source/` and produce a valid `components/tokens.ts`.

#### Scenario: Full pipeline produces valid output

- GIVEN `tokens/source/` contains fresh DTCG files from a successful pull
- WHEN `npm run tokens:generate` runs
- THEN it exits with code 0
- AND `components/tokens.ts` is created/overwritten
- AND the file contains all expected export categories (`cssVar`, `token`, `typographyStyle`, `shadowValue`)
- AND no token references are unresolved (no `{undefined}` values)

### Requirement: Pre-Pull Backup

Before overwriting DTCG files, the pipeline MUST create a timestamped backup of the current `tokens/source/` directory.

#### Scenario: Backup created before overwrite

- GIVEN `tokens/source/` contains existing DTCG files
- WHEN `npm run tokens:pull` executes
- THEN a backup directory `tokens/backups/YYYY-MM-DD-HHmmss/` is created
- AND it contains copies of all current `.tokens.json` files
- AND the pull proceeds only after the backup completes successfully

### Requirement: Rollback

The system MUST support reverting to the previous DTCG state using `git checkout` or the backup directory.

#### Scenario: Rollback via git

- GIVEN the pipeline produced incorrect or broken tokens
- WHEN a developer runs `git checkout -- tokens/source/ && git checkout -- scripts/lib/figma-to-dtcg.ts`
- THEN `tokens/source/` is restored to the pre-pull state
- AND re-running `npm run tokens:generate` produces the original `components/tokens.ts`

#### Scenario: Rollback via backup

- GIVEN no git checkpoint is available (e.g., unstaged changes)
- WHEN a developer copies files from `tokens/backups/YYYY-MM-DD-HHmmss/` back to `tokens/source/`
- THEN all DTCG files match the pre-pull state

### Requirement: Validation by Diff

The pipeline SHOULD produce a visible diff report after generation so the developer can review changes before committing.

#### Scenario: Diff produced after generation

- GIVEN fresh DTCG files have been written
- WHEN `npm run tokens:generate` completes successfully
- THEN the developer can run `git diff --stat tokens/source/ components/tokens.ts` to see what changed
