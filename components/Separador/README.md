# Separador

**Figma**: `Atomo / Separador` — master component `256:685` (instance vista: `45689:20843`)

## Que es

Linea horizontal divisora con opcional label centrado.

## Props

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `text` | `ReactNode` | — | Si se provee, el separador se corta al medio y muestra el label centrado. Mapea a la variante Figma `texto = "Sí"`. |
| `gap` | `"xs"\|"s"\|"md"\|"l"\|"xl"\|"xxl"` | `"s"` | Padding vertical (token de dimension). |
| `className` | `string` | — | Escape hatch. |
| `style` | `CSSProperties` | — | Escape hatch. |

## Tokens usados

- `border.default` — color de la linea
- `border.width` — grosor (1px)
- `size.s` — padding vertical default
- `size.md` — gap entre linea y texto (cuando hay label)
- `text.secondary` — color del label

## Decision de diseno

Figma implementa el separador como una **imagen raster** (un PNG de una linea). En codigo lo resolvemos con `border-top` porque:

1. Renderiza identico visualmente.
2. Escala sin perder resolucion.
3. Usa el token `border.default` — si cambia el color del DS, el separador cambia solo.
4. Es accesible: `role="separator"` + `aria-orientation="horizontal"`.

Esta es una **mejora intencional** respecto de Figma. El atelier agrega valor traduciendo intencion visual, no pixeles.

## Flujo de Code Connect

1. `npm run connect:parse` — valida el mapping sin publicar.
2. `npm run connect:publish` — requiere `FIGMA_ACCESS_TOKEN` en env. Publica al Figma para que Dev Mode muestre snippets de React en vez de Tailwind generado.
