# Changelog

Registro historico de cambios en el DS.

Formato: [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Shadow scale realineada (2026-04-16)
- Shadow scale alineada con atelierdesignsystem.com (Tailwind v3 defaults).
- `shadow.xs`: sin cambios (ya coincidia).
- `shadow.s`: reemplazado — antes `0 4px 4px rgba(0,0,0,0.03)` (apenas visible) → ahora default de atelier `0 1px 3px + 0 1px 2px -1px` rgba(0,0,0,0.1). Afecta CardInfo, DatePicker, Modal, Menu (sombra mas presente).
- `shadow.md`: **NUEVO tier intermedio** (antes el slot estaba vacio entre S y el MD viejo) — valor de atelier `md` (`0 4px 6px -1px + 0 2px 4px -2px`).
- `shadow.lg`: **NUEVO tier** — toma el slot del MD viejo con valor de atelier `lg` (`0 10px 15px -3px + 0 4px 6px -4px`).
- `shadow.xl`: reemplazado — cascada de 6 layers eliminada, ahora atelier `2xl` simple (`0 25px 50px -12px rgba(0,0,0,0.25)`).
- `shadow.ne` → **renombrado a `glow.brand`** (top-level). Mismo valor naranja TotalCoin (rgba(242,110,37,0.18)). Path en `shadowValue` queda `glowBrand`.
- Script `generate-tokens.ts`: keys de `shadowValue` ahora usan path completo camelCase cuando el token no esta bajo `shadow.*`.

### Added
- Scaffold inicial del atelier (tokens DTCG, Code Connect, scripts de sync).
- `tokens/source/color.tokens.json`: 54 tokens — 5 escalas primitivas (primary, neutral, secondary, green, red, 10 shades c/u) + 4 feedback aliases (verde-confirmado, naranja, error, deshabilitado). Extraido desde Figma frame "Colores" (44970:82242).
- `tokens/source/typography.tokens.json`: 28 tokens — 2 familias (Nunito heading, Montserrat number) + 5 weights + 8 sizes + 1 lineHeight + 1 letterSpacing + 11 estilos compuestos (H0..H6, N1..N4) que mapean 1:1 a los Figma Text Styles "Brand/H*" y "Brand/N*". Fuente: frame "Fuentes de letra" (44970:82278).
- `tokens/source/dimension.tokens.json`: 16 tokens — 6 sizes primitivos (XS=4, S=8, MD=12, L=16, XL=24, XXL=36) de la collection Figma `Bordes y espaciado` + 9 grid tokens (mobile/tablet/desktop × columns/gutter/gap) + 1 borderWidth. Fuente: frame `Grid y espaciado` (44779:59156) + search_design_system.
- `tokens/source/radius.tokens.json`: 4 tokens — Radio XS/S/MD/L. Referencias DTCG a `{size.*}` porque comparten scale.
- `tokens/source/shadow.tokens.json`: 4 tokens — Sombra S (single), MD (2 layers), XL (6 layers realista), NE (single naranja #f26e25 alpha 18%, "Nueva Experiencia" para llamar atencion). Fuente: frame `Sombras y Border Radius` (44779:59093).
- `tokens/source/semantic.tokens.json`: 22 tokens de la capa Semantic de Figma — `brand/*` (6), `text/*` (6), `icon/*` (1), `bg/*` (6), `border/*` (1), `feedback/*` (2). Incluye referencias DTCG a primitivos de color.tokens.json cuando hay alineacion, y valores propios donde hay drift. Fuentes de extraccion: 3 variantes de Boton Standard + Molecula/Alerta + Atomo/Caja de texto.

### Drifts confirmados entre capas
- `feedback/error = #ff3b30` vs `color.red.500 = #ff3a30` (1 digit). Semantic manda.
- `brand/secondary = #f26e25` vs `color.secondary.500 = #f37d3d`. Semantic manda.
- `text/primary = #333` vs neutral-900 `#373737`. Sin alineacion limpia.
- `icon/primary = #4f4f4f` y `text/tertiary = #bdbdbd`: unicos, no en neutral scale.

### Nuevo style descubierto
- `Brand / Primario 2 = #42689F` (style, no variable). Puesto como `brand.primary-2`.
- `Brand / Body: Nunito Regular 14` — text style no capturado en primera pasada de typography. Pendiente agregar a typography.tokens.json.

### Primeros 4 componentes end-to-end
- `components/tokens.ts`: helper TS que expone los tokens del DS como CSS vars con fallback hex. Semantic + dimension + primitive color subset (green/secondary/red/primary 50-500).
- `components/Separador/`: `figma.enum("texto")` con Si/No. Figma usa PNG raster; code usa `border-top`. Accesible.
- `components/Spinner/`: Figma usa PNG estatico; code usa Web Animations API (no keyframes CSS, honra `prefers-reduced-motion` gratis).
- `components/CheckBox/`: `figma.boolean("Cheked")` (typo preservado en Figma). PNG del check -> SVG inline con `currentColor`.
- `components/StatusPill/`: `figma.enum("Criticidad")` + `figma.enum("Icon")`. 8 variantes (4 levels × con/sin icono). Mapeo ES->EN: Baja/Media/Alta/Neutra -> low/medium/high/neutral.
- Typecheck OK (`tsc --noEmit`).

### Drifts nuevos documentados
- Pill Neutra: bg `#e6ecf1` (legacy style "Color-primary / color-primary-50") vs variable color-primary-50 `#ebeef3`. Dos valores con el mismo nombre. Code usa el canonico `#ebeef3`.

### Constraint del plan Pro
- Code Connect publish (403): requiere scope `code_connect:write` que NO aparece en el dialog de PAT de Pro. Confirmado por `get_code_connect_suggestions` MCP: necesita Developer seat Organization/Enterprise.
- Los `*.figma.tsx` quedan como spec/documentacion. El comando `npm run connect:parse` valida local. La publicacion queda latente hasta que haya Enterprise.

### Infraestructura: auto-generador de tokens
- `scripts/generate-tokens.ts`: lee los 6 DTCG, resuelve referencias `{path.to.token}`, emite `components/tokens.ts` con:
  - `cssVar`: mapa plano kebab-name -> `var(--name, fallback)` (128 entradas)
  - `token`: arbol anidado camelCase ergonomico (token.color.primary[500])
  - `typographyStyle`: 11 CSSProperties para H0-H6, N1-N4
  - `shadowValue`: 4 CSS box-shadow strings
- `npm run tokens:generate` regenera el archivo desde los DTCG.
- 113 atomic + 11 typography + 4 shadow = 128 tokens exportados.
- Componentes existentes migrados: `token.border.width` -> `token.borderWidth.default`. Typecheck OK.

### PropsPlayground + Token download + Tabla filters (2026-04-15)
- **`PropsPlayground`**: UI component generico tipo Storybook Controls. Config de controls (enum/boolean/string/number) + preview live + snippet reactive. Aplicado en seccion ButtonStandard con 7 controles (variant/size/width/rounded/disabled/pressed/label).
- **TokenDownload**: boton en Foundations → Colors que descarga los 132 tokens en 3 formatos:
  - DTCG bundle JSON (los 6 files unidos en uno)
  - CSS custom properties (.css con `:root { --name: value }`)
  - TypeScript const (.ts)
- **Tabla column filters**: `column.filterable: boolean | (row, query) => boolean`. Cuando ANY columna tiene `filterable=true`, se renderiza una row extra bajo el header con inputs de filtro (sticky top: 40). Default match: `String(row[key]).includes(query)` case-insensitive. Filter + sort + pagination funcionan combinados; cambiar filtro resetea page a 0.

### Patterns section + sidebar search (2026-04-15, ultima continuacion)
- **Patterns section**: 4 ejemplos reales del DS en composicion — demuestra como se usan los componentes juntos.
  - **LoginScreen**: TextField (email + password con left icons mail/lock) + CheckBox remember + ButtonStandard (loading state) + Alerta error + Separador + outline button para sign-up.
  - **TransactionsList**: Tabla con selection + pagination + sort + formato de montos (Montserrat para numeros) + StatusPill (3 estados: completada/pendiente/rechazada) + Icon de tipo (arrow-up/down) + Menu contextual (import/settings/delete destructive).
  - **SettingsPanel**: seccion de notificaciones con Toggle + metadata (icon + label + desc) + RadioButton group para idioma + CardInfo con ReactNodes embebidos.
  - **OnboardingFlow**: Progreso (percent) + Stepper (dots) + 4 pasos con contenido dinamico + Alerta info/success + navegacion con left/right icons.
- **Sidebar search**: input arriba de la nav que filtra items en tiempo real (label o href). Empty state "Sin resultados". Al buscar, abre todas las secciones. Click "×" o clear para volver a default.
- Typecheck ✅, 21 Code Connect mappings ✅.

### Extensiones catalog + Tabla + UX mejora (2026-04-15, continuacion)
- **Icon catalog expandido 28 → 58** iconos: agregados arrows, menu, more-h/v, external-link, download, upload, refresh, filter, link, users, user-plus, dollar, tag, calendar, clock, file, folder, image, lock, unlock, login, logout, moon, sun, volume, volume-off. Stroke currentColor, extensible via `icons.ts`.
- **Tabla selection**: nueva columna de checkboxes con `selectable` prop + `rowKey` + `selectedKeys` (controlled) + `onSelectionChange`. Header checkbox soporta indeterminate state cuando la seleccion es parcial. Rows seleccionadas se destacan con `brand.primarySubtle` background.
- **Swatch click-to-copy**: cada color en Foundations es un boton — click copia el hex al clipboard con feedback visual verde "✓ Copiado" por 1.2s. Title + aria-label apropiados.
- **React Router: descartado**: evaluado, se concluyo que el anchor nav actual ya cumple el use case (URLs compartibles via `#section`, browser back/forward, deep-link on reload). Migrar solo si se va a pages separadas con lazy loading.
- Typecheck ✅, 21 Code Connect mappings ✅.

### Dark mode canvas fix + features documentadas (2026-04-15, ultima tanda)
- **Dark mode fix**: el canvas no se oscurecia porque el playground usaba hexes hardcoded. Solucion: nueva capa de CSS vars `--pg-*` (canvas, sidebar-bg, card-bg, card-border, border, text, text-secondary, text-muted, text-faint, badge-bg, code-bg, shadow-card, etc.) con defaults en `:root` y overrides en `[data-theme="dark"]`. 15+ reemplazos de hexes en App.tsx, Sidebar.tsx, Card.tsx, Badge.tsx, index.html. Transition 240ms al togglear.
- **Brand Clients collection documentada**: identificadas las 2 variables (brand/primary + brand/secondary) en la collection multi-brand. Values hex bloqueados por MCP (requiere seleccion desktop). Architectural note: soporta multi-brand via `[data-brand="..."]` overrides paralelo al dark mode.
- **Tabla sort + pagination**: extendido el componente con:
  - `column.sortable: boolean | comparator` — click cicla asc → desc → none
  - `pageSize: number` — habilita footer con "X-Y de Z" + botones prev/next con aria-labels
  - `initialSort` para default
  - Comparator default: `localeCompare` con `numeric: true` (maneja "123" vs 123, "1.230" vs "1.230")
  - Sorted state reset al cambiar page
- Typecheck ✅, 21 Code Connect mappings ✅.

### Serie larga — 4 componentes + infra (2026-04-15)
- **`components/Icon/`**: meta-componente `<Icon name="..." />` con 28 iconos SVG inline (check, close, chevrons, search, plus/minus, trash, edit, share, copy, home, user, bell, mail, phone, heart, star, wallet, credit-card, transfer, settings, info, alert-triangle, x-circle, circle-check, eye/eye-closed). Stroke currentColor, extensible via `icons.ts`. El DS tiene ~175 iconos Figma; extraer mas a demanda.
- **`components/SidebarNav/`**: Organismo basado en "Organismo / Menu" del DS (node 47046:1446). Collapsable (80px/280px), con sections, items, icon slots, footer/header slots. Usa el Icon system.
- **`components/DatePicker/`**: Organismo (node 47208:1029). Input + calendar popup. Sin libs de fechas — solo Date nativo. Locales ES, lunes-first default, min/max range, today marker, ESC + click fuera cierran.
- **`components/Tabla/`**: Organismo (node 46088:1379). Data table generica tipada — `columns` config con render custom y align, hoverable rows, onRowClick, empty state, sticky header con scroll maxHeight. No incluye sort ni paginacion (componible aparte).
- **`components/Menu/`**: Dropdown generico (patron Radix). NOTA importante: el "Organismo / Menu" (47046:1446) del DS ES el sidebar nav — por eso se construye como `SidebarNav` separado.
- **`components/ThemeProvider/`** + `playground/ui/theme.css`: dark mode infra completo. localStorage persist + prefers-color-scheme + toggle en playground sidebar. Values dark son hipotesis; tokens reales `Dark/*` (6 variables identificadas en Figma) requieren seleccion desktop para extraer hex.
- **`tailwind.config.ts`**: tokens TotalCoin como theme extension. Semantic como CSS vars (dark-mode ready via data-theme). Primitivos como hex directos. FontFamily heading/number/body, spacing ds-xs..ds-xxl, radius, shadows.
- **Alerta refinement**: strip extendido con `margin: "-1px 0 -1px -1px"` + radius propio para matchear el Figma (strip "asoma" de los corners).

### Typography generator fix
- `fontFamily` en DTCG puede ser string o array. El generator antes solo emitia strings — arrays silenciosamente no se emitian, causando fallback a serif/Times en el playground. Fix: helper `fontFamilyToCss` con quoting correcto.

### Inputs: TextField + Textarea (DS en transicion detectado)
- **Hallazgo arquitectonico**: el DS tiene DOS eras conviviendo. Los componentes viejos (Boton, Separador, CheckBox, StatusPill, Caja de texto) usan Nunito + border/default + sin focus ring. Los componentes nuevos (Textarea) usan Inter + bg/input borders + focus ring visible + shadow-xs sutil. El sistema esta migrando.
- Tokens nuevos agregados: `focus.ring` (#cbd5e1), `focus.ringError` (#fca5a5), `typography.fontFamily.body` (Inter), `shadow.xs` (single-layer sutil). Auto-gen emite 116 atomic + 11 typography + 5 shadow = 132 tokens.
- `components/TextField/`: Caja de texto — label, sublabel, border, leftIcon, rightIcon, selected, disabled. Usa forwardRef + useId para integracion con forms. Nunito.
- `components/Textarea/`: Textarea — roundness (default/round), error, resizable, disabled. Focus tracking via onFocus/onBlur + useState (mantiene el patron inline-styles). 7 estados × 2 roundness. Inter.
- Code Connect parse: 7 mappings OK.

### Molecula / Boton Standard (la grande)
- `components/ButtonStandard/`: UN componente React que absorbe **~192 variantes Figma**.
- Props ortogonales: variant (6 valores), size, width, rounded, pressed, disabled, leftIcon, rightIcon.
- Code Connect mapping multi-prop: un mismo Figma `Estado` alimenta 3 props React distintos (variant + pressed + disabled). Cubre todos los estados.
- `text/brand` verificado via extraccion de variante Apretado = `#002c50` (antes estaba como ref a `{brand.primary}` en semantic, ahora hardcoded al valor real). Actualizado en semantic.tokens.json.
- `brand/primary-dark` y `brand/primary-hover` hypothesis verificada: #002c50 (color-primary-700).
- Parse Code Connect: 5 mappings OK (Separador, Spinner, CheckBox, StatusPill, ButtonStandard).

### Pending
- Extraer collection **Semantic** (brand/primary, text/primary, icon/primary, etc.) — nombres conocidos, values aun no.
- Extraer collection **Brand Clients** (multi-brand).
- Resto de categorias: typography, dimension, radius, shadow.

### Noted drift
- Figma tiene un style "Brand / Error" = `#FF3B30`, pero el primitivo red-500 es `#FF3A30`. Diferencia de 1 digit. Revisar en Figma y alinear.
