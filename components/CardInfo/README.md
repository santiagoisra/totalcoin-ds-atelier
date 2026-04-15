# CardInfo

**Figma**: `Organismo / Card Info` — master `44700:96494`. **Primer organismo del DS.**

Card que muestra pares de clave/valor. Patron compound (`CardInfo.Row`) para composicion flexible.

## Uso

```tsx
import { CardInfo } from "./components/CardInfo/CardInfo.tsx";

// Data-driven
<CardInfo rows={[
  { label: "Razón social", value: "BETWARRIOR" },
  { label: "DNI / CUIT", value: "284556437" },
]} />

// Compound (recomendado para rows con ReactNodes)
<CardInfo>
  <CardInfo.Row label="Estado" value={<StatusPill level="low">Activo</StatusPill>} />
  <CardInfo.Row label="Ultimo acceso" value="Hace 2 horas" />
</CardInfo>
```

## Props (CardInfo)

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `rows` | `Array<{label, value}>` | — | Atajo data-driven. |
| `children` | `ReactNode` | — | Para rows custom (composicion). Coexiste con `rows`. |
| `className`, `style` | — | — | Escape hatches. |

## Props (CardInfo.Row)

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `label` | `ReactNode` | Clave — Nunito SemiBold 16, brand.primary. |
| `value` | `ReactNode` | Valor — Nunito Bold 14, text.secondary. Accept componentes custom. |

## Tokens usados

- `bg.surface` — fondo
- `border.default` / `borderWidth.default` / `radius.s` — frame
- `shadow.s` — sombra sutil
- `size.s` / `size.md` — padding vertical / horizontal
- `brand.primary` — color de label
- `text.secondary` — color de value

## Decisiones

- **Compound pattern**: `CardInfo.Row` como sub-componente via `Object.assign`. Es el patron usado por Radix, Chakra, Mantine — ergonomico para el consumidor y clarifica la jerarquia (un Row solo tiene sentido dentro de un CardInfo).
- **Padding size.md horizontal** (12px) en vez de los 3px del Figma. El 3px del Figma parece un artefacto del autolayout — visualmente se pierde el breathing room. Si molesta el drift, override con `style={{ padding: '10px 3px' }}`.
- **Value `textAlign: right`**: el Figma lo alinea a la derecha. Se respeta.
