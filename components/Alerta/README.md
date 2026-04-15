# Alerta

**Figma**: `Molecula / Alerta` — master `4041:21616`. ~20 variantes.

Banner de notificacion con strip lateral coloreado + icono opcional + texto + trailing action.

## Props

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `color` | `"warning"` \| `"success"` \| `"error"` \| `"info"` | `"warning"` | Variante semantica. Strip + texto se colorean. |
| `children` | `ReactNode` | — | Cuerpo del mensaje. |
| `leftIcon` | `ReactNode \| null` | AlertTriangle SVG | Pasar `null` para suprimir. Pasar un ReactNode para override. |
| `rightIcon` | `ReactNode` | — | Icono 24×24 trailing (ej. ChevronRight). |
| `rightLabel` | `ReactNode` | — | Label textual trailing (ej. "Solicitar"). |
| `className`, `style` | — | — | Escape hatches. |

## Mapping color -> token

| color prop | Figma `color` | Token |
|------------|--------------|-------|
| `warning` | Naranja | `brand.secondary` (#f26e25) |
| `success` | Verde | `feedback.success` (#00974e) |
| `error` | Rojo | `feedback.error` (#ff3b30) |
| `info` | Azul | `brand.primary` (#003e70) |

## Decisiones

- **Strip CSS, no imagen**: Figma renderiza la decoracion lateral como imagen PNG por cada color. En codigo, un `<div>` con `background-color` del token. Zero assets, radius interno 7px para matchear el borde exterior.
- **role="alert"**: accesibilidad. Lectores de pantalla anuncian el contenido al aparecer.
- **`leftIcon={null}` vs omitirlo**: omitirlo muestra el default AlertTriangle. Pasarlo `null` suprime el icono (Figma permite alertas sin icono).
- **rightIcon + rightLabel**: pueden coexistir (ej. label "Solicitar" + chevron). Se renderizan juntos a la derecha.
- **Texto con color**: Figma pinta todo el texto del color de la alerta (no neutral). Esto reduce legibilidad vs un body-text neutral pero es la decision del DS.
