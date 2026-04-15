# ButtonStandard

**Figma**: `Molecula / Boton Standard` — master `3692:17510`.

Sistema de botones completo del DS de TotalCoin. **~192 variantes en Figma reducidas a 1 componente React** con props ortogonales.

## Props

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `variant` | `"primary"` \| `"secondary"` \| `"outline"` \| `"tertiary"` \| `"danger"` \| `"danger-outline"` | `"primary"` | Variante visual. Mapea desde Figma `Estado`. |
| `size` | `"small"` \| `"medium"` | `"medium"` | 40px / 45px de alto. Figma `tamano`. |
| `width` | `"auto"` \| `"full"` | `"auto"` | Ancho natural vs 100%. Figma `ancho` (chico/grande). |
| `rounded` | `boolean` | `false` | Pill shape cuando true (radius 9999px). Figma `borde redondeado`. |
| `pressed` | `boolean` | `false` | Estado apretado forzado (toggle buttons). Sin prop, `:active` CSS. |
| `disabled` | `boolean` | `false` | Estado deshabilitado. Overrides colores a gris, no pointer. |
| `leftIcon` / `rightIcon` | `ReactNode` | — | Slots 16×16 (Nunito 14 header-level). |
| `type` | `"button"` \| `"submit"` \| `"reset"` | `"button"` | HTML button type. Default evita form-submit accidental. |
| `children` | `ReactNode` | — | Label. |
| `...rest` | `ButtonHTMLAttributes` | — | `onClick`, `aria-*`, `data-*`, etc. se reenvian al `<button>`. |

## Mapping Figma -> React

Un mismo **Figma `Estado`** alimenta 3 props distintos de React:

| Figma Estado | variant | pressed | disabled |
|--------------|---------|---------|----------|
| Primario | primary | false | false |
| Apretado | primary | **true** | false |
| Secundario | secondary | false | false |
| Outline | outline | false | false |
| Terciario | tertiary | false | false |
| Deshabilitado | primary | false | **true** |
| Danger | danger | false | false |
| DangerOutline | danger-outline | false | false |

Esto es **ortogonalidad** — en Figma cada estado es un "bucket", en React son props independientes que el consumidor combina libremente (ej. un `danger` + `disabled`, o un `outline` + `pressed`).

## Paleta por variante (tokens usados)

| Variante | Background | Border | Foreground |
|----------|-----------|--------|------------|
| `primary` | `brand.primary` #003e70 | `border.default` | `text.onPrimary` |
| `primary` + `pressed` | **`brand.primaryDark`** #002c50 | `border.default` | `text.onPrimary` |
| `secondary` | `bg.button` #fefefe | `brand.primary` | `brand.primary` |
| `outline` | transparent | `brand.primary` | `brand.primary` |
| `tertiary` | transparent | transparent | `brand.primary` |
| `danger` | `feedback.error` #ff3b30 | transparent | `text.onPrimary` |
| `danger-outline` | transparent | `feedback.error` | `feedback.error` |
| `*` + `disabled` | `border.default` | `border.default` | `text.tertiary` |

## Decisiones de diseño

**Padding 10px literal**: Figma usa `p-[10px]` pero la scale DTCG no tiene 10 (tiene 8 y 12). Se mantuvo literal para fidelidad pixel-perfect. Si el drift molesta, opciones:
- Alinear Figma a 8 o 12.
- Agregar token `size.buttonPad` = `10px`.

**Typography inline**: el botón usa Nunito Bold 14 directo (font-family, weight, size literales). No uso `typographyStyle.H4` del generator porque el alto de linea del button es 1 (no "normal") y el gap con iconos requiere control manual. Cuando el DS defina una typography `brand/button` la cambiamos.

**`:active` CSS vs `pressed` prop**: los clicks naturales trigger `:active` pseudo-class. El prop `pressed` es para forzar el estado visualmente (e.g., toggle buttons persistentes). No implemente el cambio de color via `:active` — el Figma no muestra consistencia visual en el hover/active web, y la app es mobile-first. Si mañana necesitamos feedback visual en click, agregar `:active` styles al componente.

**Disabled sobrescribe variant**: si `disabled=true`, se usa la paleta gris-sobre-gris sin importar `variant`. Matchea el Figma donde "Deshabilitado" es un estado uniform across variants.
