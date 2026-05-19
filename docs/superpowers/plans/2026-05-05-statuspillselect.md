# StatusPillSelect Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear el componente `StatusPillSelect` que convierte a `StatusPill` en un selector interactivo de criticidad usando el `Menu` existente.

**Architecture:** Nuevo componente `StatusPillSelect` que orquesta `StatusPill` como trigger del `Menu` ya existente. El `StatusPill` base no se modifica. El playground usa `StatusPillSelect` para las pills "Con icono" y mantiene `StatusPill` puro para "Sin icono".

**Tech Stack:** React + TypeScript, inline styles (sin CSS modules), componentes existentes del DS (`StatusPill`, `Menu`, `Icon`).

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `components/StatusPill/StatusPillSelect.tsx` | Create | Nuevo componente select que usa `StatusPill` + `Menu` |
| `playground/App.tsx` | Modify | Actualizar sección StatusPill: "Con icono" usa `StatusPillSelect` con state local |
| `playground/snippets/index.ts` | Modify | Agregar snippet de código de `StatusPillSelect` |

---

### Task 1: Create `StatusPillSelect.tsx`

**Files:**
- Create: `components/StatusPill/StatusPillSelect.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { useState, type CSSProperties } from "react";
import { StatusPill, type Criticality } from "./StatusPill.tsx";
import { Menu } from "../Menu/Menu.tsx";
import { Icon } from "../Icon/Icon.tsx";

export interface StatusPillSelectOption {
  value: Criticality;
  label: string;
}

export interface StatusPillSelectProps {
  /** Valor actual seleccionado. */
  value: Criticality;
  /** Opciones disponibles. */
  options: StatusPillSelectOption[];
  /** Callback al seleccionar una opción. */
  onChange: (value: Criticality) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Selector de criticidad basado en StatusPill.
 *
 * Renderiza un StatusPill con chevron-down que abre un Menu al hacer click.
 * Las opciones del menú muestran un dot de color correspondiente a cada criticidad.
 */
export function StatusPillSelect({
  value,
  options,
  onChange,
  className,
  style,
}: StatusPillSelectProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === value);
  const label = selectedOption?.label ?? value;

  const menuItems = options.map((option) => ({
    value: option.value,
    label: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <ColorDot level={option.value} />
        {option.label}
      </span>
    ),
  }));

  function handleSelect(selectedValue: string | undefined) {
    if (selectedValue && selectedValue !== value) {
      onChange(selectedValue as Criticality);
    }
    setOpen(false);
  }

  return (
    <Menu
      trigger={
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer",
            ...style,
          }}
          className={className}
        >
          <StatusPill
            level={value}
            icon={
              <span
                style={{
                  display: "inline-flex",
                  transition: "transform 200ms ease",
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <Icon name="chevron-down" size={16} />
              </span>
            }
          >
            {label}
          </StatusPill>
        </span>
      }
      items={menuItems}
      onSelect={handleSelect}
      align="start"
      minWidth={160}
    />
  );
}

/** Dot de color circular para cada opción del menú. */
function ColorDot({ level }: { level: Criticality }): JSX.Element {
  const colors: Record<Criticality, string> = {
    low: "#00974e",
    medium: "#ff9500",
    high: "#ff3a30",
    neutral: "#005ebc",
  };

  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: 9999,
        backgroundColor: colors[level],
        flexShrink: 0,
      }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/StatusPill/StatusPillSelect.tsx
git commit -m "feat: add StatusPillSelect component"
```

---

### Task 2: Update Playground App

**Files:**
- Modify: `playground/App.tsx` (sección StatusPill, líneas ~787-801)

- [ ] **Step 1: Add import**

Agregar al inicio del archivo, junto al import existente de `StatusPill`:

```tsx
import { StatusPillSelect } from "../components/StatusPill/StatusPillSelect.tsx";
```

- [ ] **Step 2: Add state for the select**

Dentro del componente `App`, agregar state local para manejar los valores de los 4 selects. Buscar una ubicación apropiada cerca de otros estados del playground:

```tsx
const [statusPillValues, setStatusPillValues] = useState<Record<Criticality, Criticality>>({
  low: "low",
  medium: "medium",
  high: "high",
  neutral: "neutral",
});
```

Nota: si `useState` no está importado, agregarlo. Si `Criticality` no está importado, agregarlo desde `../components/StatusPill/StatusPill.tsx`.

- [ ] **Step 3: Replace "Con icono" section**

Reemplazar las líneas 789-792 (las 4 StatusPill con icono) por:

```tsx
<SubCard title="Con icono">
  {(
    [
      { key: "low" as Criticality, label: "Bajo" },
      { key: "medium" as Criticality, label: "Medio" },
      { key: "high" as Criticality, label: "Crítico" },
      { key: "neutral" as Criticality, label: "Neutro" },
    ] as const
  ).map(({ key, label }) => (
    <StatusPillSelect
      key={key}
      value={statusPillValues[key]}
      options={[
        { value: "low", label: "Bajo" },
        { value: "medium", label: "Medio" },
        { value: "high", label: "Crítico" },
        { value: "neutral", label: "Neutro" },
      ]}
      onChange={(value) =>
        setStatusPillValues((prev) => ({ ...prev, [key]: value }))
      }
    />
  ))}
</SubCard>
```

- [ ] **Step 4: Verify imports**

Asegurar que estos imports existan al tope de `playground/App.tsx`:

```tsx
import { useState } from "react";
import { StatusPill, type Criticality } from "../components/StatusPill/StatusPill.tsx";
import { StatusPillSelect } from "../components/StatusPill/StatusPillSelect.tsx";
```

Nota: `StatusPill` ya debería estar importado, solo agregar `type Criticality` si no lo está.

- [ ] **Step 5: Commit**

```bash
git add playground/App.tsx
git commit -m "feat: update StatusPill playground section with interactive selects"
```

---

### Task 3: Update Snippets

**Files:**
- Modify: `playground/snippets/index.ts` (objeto `statuspill`)

- [ ] **Step 1: Add StatusPillSelect snippet**

Reemplazar el contenido de `statuspill` en el objeto `snippets` (líneas ~200-219):

```ts
statuspill: {
  react: `import { StatusPill } from "@totalcoin/ds";

<StatusPill level="low">Bajo</StatusPill>
<StatusPill level="medium">Medio</StatusPill>
<StatusPill level="high">Crítico</StatusPill>
<StatusPill level="neutral">Neutro</StatusPill>`,
  reactSelect: `import { StatusPillSelect } from "@totalcoin/ds";

<StatusPillSelect
  value="low"
  options={[
    { value: "low", label: "Bajo" },
    { value: "medium", label: "Medio" },
    { value: "high", label: "Crítico" },
    { value: "neutral", label: "Neutro" },
  ]}
  onChange={(value) => console.log(value)}
/>`,
  tailwind: `<span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-[16px] bg-[#e6f5ed] text-[#00974e] font-medium text-sm">
  Bajo
</span>

{/* high */}
<span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-[16px] bg-[#ffebea] text-[#ff3a30] font-medium text-sm">
  Crítico
</span>`,
  reactNative: `import { View, Text, StyleSheet } from "react-native";

<View style={[styles.pill, styles.pillLow]}>
  <Text style={styles.pillTextLow}>Bajo</Text>
</View>

{/* high */}
<View style={[styles.pill, styles.pillHigh]}>
  <Text style={styles.pillTextHigh}>Crítico</Text>
</View>`,
},
```

Nota: el snippet de `reactSelect` es informativo; el playground puede que no muestre esta tab adicional sin cambios en `CodeTabs`. Si `CodeTabs` no soporta tabs arbitrarias, solo actualizar el snippet `react` existente para documentar ambos componentes.

Si `CodeTabs` solo muestra `react`, `tailwind`, `reactNative`, entonces en vez de agregar `reactSelect`, actualizar el `react` para que incluya ambos patrones:

```ts
react: `import { StatusPill, StatusPillSelect } from "@totalcoin/ds";

{/* Puro (no interactivo) */}
<StatusPill level="low">Bajo</StatusPill>

{/* Selector interactivo */}
<StatusPillSelect
  value="low"
  options={[
    { value: "low", label: "Bajo" },
    { value: "medium", label: "Medio" },
    { value: "high", label: "Crítico" },
    { value: "neutral", label: "Neutro" },
  ]}
  onChange={(value) => console.log(value)}
/>`,
```

- [ ] **Step 2: Commit**

```bash
git add playground/snippets/index.ts
git commit -m "docs: update StatusPill snippets with StatusPillSelect example"
```

---

### Task 4: Verify & Deploy

- [ ] **Step 1: Verify build**

```bash
npm run dev
# o
npm run build
```

Esperado: sin errores de TypeScript, sin errores de build.

- [ ] **Step 2: Manual test**

Abrir el playground en el navegador, navegar a la sección StatusPill:
1. Las 4 pills "Con icono" deben mostrar el label correspondiente y el chevron-down.
2. Click en una pill debe abrir un menú con 4 opciones (Bajo, Medio, Crítico, Neutro).
3. Cada opción debe mostrar un dot de color a la izquierda.
4. Click en una opción debe:
   - Cerrar el menú
   - Actualizar el label de la pill al valor seleccionado
   - Cambiar los colores del pill al nuevo nivel
5. El chevron debe rotar 180° cuando el menú está abierto.
6. Click fuera o Escape debe cerrar el menú.
7. Las pills "Sin icono" deben seguir funcionando igual (presentacionales, no interactivas).

- [ ] **Step 3: Push & deploy**

```bash
git push origin main
```

Esperado: Vercel auto-deploy (~8-9s). Verificar en la URL de producción.

---

## Spec Coverage Check

| Spec Requirement | Task |
|---|---|
| Crear `StatusPillSelect` como wrapper | Task 1 |
| Reutilizar `StatusPill` sin cambios | Task 1 (no modifica StatusPill.tsx) |
| Reutilizar `Menu` sin cambios | Task 1 (importa Menu.tsx) |
| Chevron rota 180° al abrir | Task 1, inline style transform |
| Opciones con dot de color | Task 1, ColorDot subcomponent |
| onChange callback | Task 1, handleSelect |
| Playground "Con icono" interactivo | Task 2 |
| Playground "Sin icono" puro | Task 2 (no modifica esta sección) |
| Snippets actualizados | Task 3 |

## Placeholder Scan

- ✅ No TBD/TODO
- ✅ Código completo en cada step
- ✅ Comandos exactos con expected output
- ✅ Paths exactos
- ✅ Sin referencias a funciones no definidas

## Type Consistency Check

- `Criticality` importado desde `StatusPill.tsx` en todos los lugares
- `StatusPillSelectProps` usa `Criticality` consistentemente
- `Menu` items usan `value: string` (compatible con `onSelect` del Menu)
