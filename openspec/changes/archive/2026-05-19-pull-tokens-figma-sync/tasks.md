# Tasks: Pull Tokens — Figma Sync

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~35 (code) + ~200 (regenerated DTCG/TS) = ~250 total |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Medium

**Risk note**: Auto‑generated DTCG files inflate the diff. Actual code changes are <40 lines. Single PR is safe.

### Suggested Work Units

| Unit | Goal | PR | Notes |
|------|------|----|-------|
| 1 | Pipeline fix + execution | PR 1 | Single PR — fix, pull, generate, commit |

## Phase 1: Pipeline Fix

- [x] 1.1 In `scripts/lib/figma-to-dtcg.ts`: make `collectionToFileName()` return `null` for `"Montos sugeridos"` (excluded collection)
- [x] 1.2 In `scripts/lib/figma-to-dtcg.ts`: update `transformFigmaToDTCG()` to skip collections where `collectionToFileName()` returns `null`; iterate ALL modes (not just default) producing one DTCG file per mode with `-{mode-sanitized}` suffix (Light default → no suffix, other modes → suffixed)
- [x] 1.3 Backup existing `tokens/source/` → `tokens/backups/2026-05-19-105905/`

## Phase 2: Execute Pull

- [x] 2.1 Extract Figma variables via Desktop Bridge (`figma_execute`) and save to a temp JSON file
- [x] 2.2 Run `npx tsx scripts/pull-tokens.ts --input <temp.json>` to produce fresh DTCG files
- [x] 2.3 Run `npm run tokens:generate` to regenerate `components/tokens.ts` — 103 atomic tokens
- [x] 2.4 Review `git diff --stat` to confirm changes are as expected

## Phase 3: Multi-Mode Verification

- [x] 3.1 Verify `tokens/source/semantic-dark.tokens.json` exists with real Dark values (2607 bytes)
- [x] 3.2 Verify `tokens/source/brand-clients-{mode}.tokens.json` exists for each of the 4 modes (TotalCoin, Barceló, Siglo XXI, Lomas de Zamora)
- [x] 3.3 Verify `components/tokens.ts` regenerates without errors and contains all expected categories (`cssVar`, `token`, `typographyStyle`, `shadowValue`)
- [x] 3.4 Verify `components/ThemeProvider/ThemeProvider.tsx` references resolve — Dark/* tokens now populated in generated tokens.ts (`Dark.colorTextPrimary`, etc.)

## Phase 4: Commit

- [x] 4.1 Review full `git diff` — check no unintended changes ✅ typography, radius, shadow DTCG files untouched
- [x] 4.2 Commit with conventional message: `feat(tokens): pull fresh DTCG from Figma via Desktop Bridge`
