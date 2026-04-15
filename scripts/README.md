# Scripts

Automatizaciones para el sync bidireccional Figma <-> repo.

| Script | Comando | Que hace |
|--------|---------|----------|
| `pull-tokens.ts` | `npm run tokens:pull` | Lee variables del Figma y regenera `tokens/source/*.tokens.json` |
| `push-tokens.ts` | `npm run tokens:push` | Envia cambios locales de tokens hacia Figma |

## Requisitos

- Node 20+
- `FIGMA_ACCESS_TOKEN` en el env (ver README raiz)
- `FIGMA_FILE_KEY` en el env (por defecto `y3zmw15iLpdpYwLKSMCpP9`)

## Runtime

Se ejecutan con [`tsx`](https://github.com/privatenumber/tsx) — sin compilacion previa.

## Pendiente

Los stubs actuales describen el contrato pero no implementan la logica real. Cuando se habilite el MCP de Figma en la sesion, el flujo sera:
1. `get-design-content` o equivalente para obtener variables
2. Transformar a DTCG via helpers en `scripts/lib/`
3. Escribir en `tokens/source/*.tokens.json`
