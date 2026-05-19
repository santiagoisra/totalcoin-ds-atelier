# Proposal: pull-tokens-figma-sync

## Intent

Hacer que el pipeline Figma → Atelier funcione end-to-end. Hoy los archivos DTCG en `tokens/source/` fueron curados a mano con notas de "hipótesis" — no reflejan los tokens reales de Figma. El objetivo es que `npm run tokens:pull` extraiga datos frescos desde Figma vía Desktop Bridge, y que `npm run tokens:generate` produzca un `components/tokens.ts` correcto.

## Scope

### In Scope
- Fix `collectionToFileName()` para mapear "Color Styles", "Semantic", "Brand Clients", "Bordes y espaciado"
- Full pull de las 4 colecciones relevantes (excluyendo "Montos sugeridos")
- Manejo de multi-modo: Dark (Semantic) y 4 marcas (Brand Clients)
- Regenerar `components/tokens.ts` desde los DTCG frescos
- Validar por diff contra los archivos actuales

### Out of Scope
- `push-tokens.ts` (sync código → Figma) — sigue siendo stub
- Sistema de curation overlay (Approach 3) — se difiere
- Renombrar colecciones en Figma

## Capabilities

> No new capabilities. This is a pipeline activation, not a feature change.

### New Capabilities
None — no new spec files required.

### Modified Capabilities
None — no existing spec behavior changes.

## Approach

**Approach 1 — Full Pull from Bridge** (recomendado por exploration):

1. Fix `collectionToFileName()` en `scripts/lib/figma-to-dtcg.ts` para mapear nombres reales de Figma
2. Extraer variables vía `figma_execute` desde el Desktop Bridge
3. Pipe a `pull-tokens.ts` para generar DTCG frescos en `tokens/source/`
4. Backup de DTCG actuales antes de overwrite
5. Ejecutar `generate-tokens.ts` para regenerar `components/tokens.ts`
6. Validar visualmente que componentes rendericen con tokens correctos

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `scripts/lib/figma-to-dtcg.ts` | Modified | Fix `collectionToFileName()` mapping |
| `tokens/source/color.tokens.json` | Overwritten | Fresh pull agrega ~10 tokens faltantes |
| `tokens/source/semantic.tokens.json` | Overwritten | Reemplaza valores "hipótesis" con datos reales + Dark mode |
| `tokens/source/brand-clients.tokens.json` | **New** | No existe hoy — 2 variables × 4 modos |
| `components/tokens.ts` | Regenerated | Salida de generate-tokens |
| `components/ThemeProvider/ThemeProvider.tsx` | Verified | Debería funcionar con Dark tokens ahora presentes |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `collectionToFileName()` falla y produce archivos con nombres incorrectos | High | Fixear ANTES del pull; testear con un dry-run |
| Dark mode genera archivo separado que `generate-tokens.ts` no procesa | Med | Verificar que el pipeline acepte `-dark` sufijos o consolidar en un archivo |
| Brand Clients 4 modos → 4 DTCG files que rompen el generador | Med | Testear con un pull parcial primero |
| Se pierden `$description` con notas de contraste/uso | Med | Capturar descriptions actuales antes del pull para re-aplicar |

## Rollback Plan

1. `git checkout -- tokens/source/` restaura DTCG originales
2. Si se modificó `figma-to-dtcg.ts`, `git checkout -- scripts/lib/figma-to-dtcg.ts`
3. Re-ejecutar `npm run tokens:generate` para restaurar `components/tokens.ts`
4. Verificar con `git diff --stat` que todo volvió al estado original

## Dependencies

- Figma Desktop Bridge corriendo (WebSocket puerto 9223)
- `.env` con `FIGMA_ACCESS_TOKEN` + `FIGMA_FILE_KEY` (ya configurado)

## Success Criteria

- [ ] `collectionToFileName()` mapea las 4 colecciones correctamente
- [ ] `tokens/source/brand-clients.tokens.json` existe con 2 variables × 4 modos
- [ ] `semantic.tokens.json` incluye Dark mode con valores reales (no "hipótesis")
- [ ] `color.tokens.json` incluye warning-500, confirm, grey 1-5, bg-white, bg-primary, neutral-0, neutral-20
- [ ] `npm run tokens:generate` produce `components/tokens.ts` sin errores
- [ ] Componentes en Storybook/App renderizan sin broken tokens
