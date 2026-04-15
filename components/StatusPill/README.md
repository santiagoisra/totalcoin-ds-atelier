# Status Pill

**Figma**: `Atomo / Status Pill` — master `47635:1276`

8 variantes = 4 criticidades × 2 (con/sin icono).

## Props

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `level` | `"low" \| "medium" \| "high" \| "neutral"` | — | Mapea desde Figma `Criticidad`: Baja/Media/Alta/Neutra. |
| `children` | `ReactNode` | — | Label del pill. Ej: "Bajo", "Crítico". |
| `icon` | `ReactNode` | — | Icono opcional 16×16 (a la derecha). |
| `className`, `style` | — | — | Escape hatches. |

## Paleta por criticidad

| Level | BG | FG | Tokens |
|-------|-----|-----|--------|
| `low` | verde claro | verde medio | `color.green.50` / `color.green.500` |
| `medium` | naranja claro | naranja medio | `color.secondary.50` / `color.secondary.500` |
| `high` | rojo claro | rojo medio | `color.red.50` / `color.red.500` |
| `neutral` | azul claro | azul brand | `color.primary.50` / `brand.primary` |

## Decision de diseno

Los pills usan **primitivas de color** (`color.green.500`, etc.) en vez de tokens semantic. Eso es inusual — normalmente uno preferiria `feedback.success`, `feedback.error`, etc. El motivo: el DS de TotalCoin NO tiene tokens semantic especificos para "status pill" (low/medium/high/neutral) como conjunto coherente, y los pills originales en Figma usan los hex de las primitivas directo.

Cuando se defina una capa semantic `status.*` en el DS, reemplazar referencias.

## Drift documentado

La variante Neutra en Figma usa bg `#e6ecf1` (style legacy **Color-primary / color-primary-50**) pero la variable **color-primary-50** es `#ebeef3`. Son dos cosas distintas con el mismo nombre. Acá usamos `color.primary.50` = `#ebeef3` (canonico). Revisar en Figma si se desea alinear.
