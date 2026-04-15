# Textarea

**Figma**: `Atomo / Textarea` — master `47277:3018` (7 estados × 2 roundness = 14 variantes).

Input multi-linea. **Pertenece a la era nueva del DS** — usa Inter font, focus ring visible, shadow-xs sutil. Diferente del TextField (que sigue la era antigua con Nunito).

## Props

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `roundness` | `"default"` \| `"round"` | `"default"` | `default` = radius 8px; `round` = radius 16px. |
| `error` | `boolean` | `false` | Estado de error (borde + focus ring rojos). |
| `resizable` | `boolean` | `true` | Permitir arrastrar esquina para redimensionar. |
| `disabled` | `boolean` | `false` | Deshabilita + opacity 0.3. |
| `rows` | `number` | `3` | HTML rows attr. |
| `value`, `onChange`, `placeholder`, etc. | — | — | Props nativas de `<textarea>`. |
| `ref` | — | — | Forwardea al `<textarea>` nativo. |

## Estados visuales

| Estado | Trigger | Borde | Shadow |
|--------|---------|-------|--------|
| idle | sin interaccion | `bg.input` (casi invisible) | `shadow.xs` |
| focus | `:focus` (via onFocus/onBlur state) | `text.secondary` #828282 | `shadow.xs` + ring 3px `focus.ring` |
| error | prop `error=true` | `feedback.error` #ff3b30 | `shadow.xs` |
| error + focus | error=true + :focus | `feedback.error` | `shadow.xs` + ring 3px `focus.ringError` |
| disabled | prop `disabled=true` | `bg.input` | — |

## Tokens usados

- **NUEVOS (era moderna)**: `focus.ring`, `focus.ringError`, `shadow.xs`, `typography.fontFamily.body` (Inter).
- Existentes: `feedback.error`, `text.secondary`, `bg.surface`, `bg.input`, `icon.primary`, `border.width.default`, `radius.s` / `radius.l`, `size.s`.

## Decisiones

**Focus tracking via useState, no CSS `:focus-visible`**: todo el atelier usa inline styles. Para respetar el patron, el componente se suscribe a `onFocus`/`onBlur` y guarda `focused` en state. No es perfect — un click con mouse tambien dispara `:focus` (no solo teclado). Si quieren diferenciar, reemplazar con listener a `:focus-visible` via CSS-in-JS con una hoja scoped.

**Inter como default**: la familia `typography.fontFamily.body` es `Inter, sans-serif`. Si el consumidor no carga Inter, browser fallback a sans-serif. La app TotalCoin probablemente carga Inter via Google Fonts o self-hosted.

**Font size 14 + line-height 21 + letter-spacing 0.5**: estos valores salieron del Figma (`paragraph/small/line-height: 21px`, etc). No estan tokenizados aun en este repo — si crece la familia de componentes con el sistema nuevo, convendria extraer `typography.paragraph.small.*` como un namespace nuevo.
