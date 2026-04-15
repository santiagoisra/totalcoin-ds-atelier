# Check box

**Figma**: `Atomo / Check box` — master `18911:41938`

> Nota: la variante Figma se llama **`Cheked`** (typo preservado por el DS). En codigo la prop correcta es `checked`. El Code Connect mapping hace el puente.

## Props

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Estado marcado. |
| `onChange` | `(checked: boolean) => void` | — | Callback. Si se omite, display-only. |
| `disabled` | `boolean` | `false` | Deshabilita interaccion. |
| `ariaLabel` | `string` | — | Label accesible. Requerido si no esta envuelto en `<label>`. |
| `size` | `number` | `21` | Alto y ancho en px. |
| `className`, `style` | — | — | Escape hatches. |

## Tokens usados

- `brand.primary` — fill cuando checked
- `text.tertiary` — border cuando unchecked
- `text.onPrimary` — color del check SVG
- `radius.xs` — border-radius 4px
- `border.width` — grosor 1px

## Decision de diseno

Figma usa un PNG para el icono check. El code-side lo reemplaza por **SVG inline** con `stroke="currentColor"` — se adapta si el consumidor override el color del check via `style.color`, y escala sin perder fidelidad.
