# StatusPillSelect — Selector interactivo de criticidad

## Date
2026-05-05

## Context
El componente `StatusPill` actual es puramente presentacional. En el playground se muestra con un ícono `chevron-down` como parte de la demo, pero no es interactivo. Se requiere que las pills con flecha sean seleccionables, abriendo un dropdown con las 4 opciones de criticidad.

## Goals
1. Crear un componente `StatusPillSelect` que reutilice `StatusPill` y `Menu`.
2. Mantener `StatusPill` puro y sin cambios.
3. Actualizar el playground para que las pills "Con icono" sean interactivas.
4. Mantener las pills "Sin icono" como presentacionales puras.

## Architecture

### Componentes involucrados
- `components/StatusPill/StatusPill.tsx` — **sin cambios**. Sigue siendo el átomo presentacional.
- `components/StatusPill/StatusPillSelect.tsx` — **nuevo**. Orquesta `StatusPill` como trigger del `Menu`.
- `components/Menu/Menu.tsx` — **sin cambios**. Reutilizado como dropdown.
- `playground/App.tsx` — **actualizado**. Las pills "Con icono" usan `StatusPillSelect` con state local.

### API de StatusPillSelect

```ts
export interface StatusPillSelectProps {
  /** Valor actual seleccionado. */
  value: Criticality;
  /** Opciones disponibles. */
  options: { value: Criticality; label: string }[];
  /** Callback al seleccionar una opción. */
  onChange: (value: Criticality) => void;
  className?: string;
  style?: React.CSSProperties;
}
```

### Comportamiento

1. Renderiza un `StatusPill` con el `label` correspondiente al `value` actual.
2. El `StatusPill` incluye siempre el ícono `chevron-down` (no configurable — es un select).
3. El `StatusPill` actúa como trigger del `Menu`.
4. Al hacer click, se abre el `Menu` posicionado debajo del pill (`align="start"`).
5. Las opciones del menú muestran un dot de color circular (8px) alineado al label, usando los colores del `palette` de `StatusPill`.
6. Al seleccionar una opción: se invoca `onChange(value)` y se cierra el menú.
7. El ícono `chevron-down` rota 180° cuando el menú está abierto (`transform: rotate(180deg)`, `transition: transform 200ms ease`).
8. Click fuera o Escape cierran el menú (ya manejado por `Menu`).

### Data Flow

```
Usuario clickea StatusPillSelect
  → Menu se abre (state open=true)
  → Chevron rota 180°
  → Usuario clickea una opción
    → onChange(value) → parent actualiza state
    → Menu se cierra (state open=false)
    → Chevron vuelve a 0°
    → StatusPill re-renderiza con nuevo level/label
```

### Accesibilidad

- `aria-expanded` en el trigger (manejado por `Menu`).
- `role="menu"` en el panel (manejado por `Menu`).
- `role="menuitem"` en las opciones (manejado por `Menu`).
- Focus trapping: fuera de scope por ahora, el `Menu` actual no lo implementa.

## Playground Changes

En `App.tsx`, la sección "StatusPill" se actualiza:

- **"Con icono"** → 4 `StatusPillSelect` con state local (`useState<Criticality>`) manejado por el playground. Al cambiar una opción, el pill se actualiza dinámicamente.
- **"Sin icono"** → 4 `StatusPill` puros (sin cambios).
- El snippet de código (`playground/snippets/index.ts`) se actualiza para reflejar el nuevo componente.

## Testing

- **Render:** `StatusPillSelect` renderiza con el label correspondiente al `value`.
- **Interacción:** Click abre el menú, click en opción dispara `onChange` con el valor correcto y cierra el menú.
- **Visual:** Chevron rota al abrir/cerrar. Las opciones muestran dots de color.

## Out of Scope

- Focus trapping dentro del menú.
- Keyboard navigation (arrow keys, Enter, Escape ya funciona vía `Menu`).
- Cambios en `StatusPill` base.
- Cambios en `Menu` base.
