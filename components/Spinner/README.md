# Spinner

**Figma**: `Atomo / Spinner` — master `47558:1236`

## Que es

Indicador de carga con anillo rotatorio.

## Props

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `size` | `number \| string` | `108` | Ancho y alto. Numero = px. |
| `color` | `CSSProperties["color"]` | `token.brand.primary` | Color del arco. |
| `thickness` | `number` | `size/10` (min 2) | Grosor del anillo en px. |
| `duration` | `number` | `800` | Duracion de una vuelta en ms. |
| `ariaLabel` | `string` | `"Cargando"` | Label accesible. |
| `className`, `style` | — | — | Escape hatches. |

## Tokens usados

- `brand.primary` — color default del arco

## Decision de diseno

Figma exporta el spinner como **imagen PNG estatica**. En codigo usamos **Web Animations API** (`element.animate`) en vez de `@keyframes` CSS porque:

1. **Autocontenido**: el componente no requiere cargar un stylesheet global.
2. **Pausable en tests**: `element.getAnimations()[0].pause()` o `cancel()`.
3. **`prefers-reduced-motion`**: el browser aplica la preferencia automaticamente a animations creadas con esta API.
4. **Sin string names de keyframes**: nada que colisione con otros componentes.

Si el consumidor prefiere CSS global (menos JS runtime), reemplazar por `@keyframes` es trivial.
