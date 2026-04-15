# TextField

**Figma**: `Atomo / Caja de texto` — master `44938:74026` (19 variantes).

Input de una linea con label, sublabel, borde opcional, iconos, estado seleccionado. Usa tokens de la era **original** del DS (Nunito, border/default). Para inputs con focus ring visible, ver `Textarea`.

## Props

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `label` | `ReactNode` | — | Texto arriba del input (Nunito Bold 18). |
| `sublabel` | `ReactNode` | — | Texto debajo, chico (Nunito Medium 14, icon/primary). |
| `border` | `boolean` | `true` | Borde visible. |
| `leftIcon` | `ReactNode` | — | Slot 24×24, izquierda. |
| `rightIcon` | `ReactNode` | — | Slot 24×24, derecha (ej. chevron). |
| `selected` | `boolean` | `false` | Fuerza borde brand/primary (estado seleccionado). |
| `disabled` | `boolean` | `false` | Estado deshabilitado. |
| `value`, `onChange`, `placeholder`, `type`, etc. | — | — | Props nativas de `<input>` (via `InputHTMLAttributes`). |
| `ref` | — | — | Forwardea al `<input>` interno. |

## Tokens usados

- `bg.surface` — background del field
- `border.default` / `brand.primary` — borde (normal / seleccionado)
- `borderWidth.default` / `radius.md`
- `text.primary` — color del value
- `icon.primary` — color de iconos y sublabel
- `size.xs` / `size.s` — gaps

## No soportado

**`url = true`**: variante Figma de caja con prefijo `https://` (input partido). Es un caso especializado. Si hace falta, componer:

```tsx
<div style={{ display: "flex", gap: 0 }}>
  <TextField leftIcon={<GlobeIcon />} value="https://" disabled />
  <TextField placeholder="sitio.com" />
</div>
```

## Decisiones

- `forwardRef` al input nativo para que forms (react-hook-form, etc.) funcionen.
- `useId()` para el htmlFor del label (SSR-safe).
- `placeholder` es prop nativa — no hay token para placeholder color (usa text/secondary por default del browser).
