# TotalCoin Design System — Atelier

Workspace bidireccional entre el **Figma del DS de TotalCoin** y su espejo en código. Un catálogo React con 21 componentes, 58 iconos, 132 tokens DTCG, code snippets multi-framework (React / Tailwind / React Native), dark mode, y 4 patterns completos de uso real.

> Este repo **no es un producto** — es un atelier del Design System.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **W3C DTCG** tokens auto-generados → `components/tokens.ts`
- **Figma Code Connect** mappings (parseables localmente; publicación requiere plan Enterprise)
- **Shiki** syntax highlighting (github-dark theme, 5 lenguajes bundled)
- **ThemeProvider** con dark mode + `[data-theme]` CSS variables
- **Zero librerías de UI externas** — todo inline styles + tokens

## Estructura

```
.
├── components/             # React refs + Code Connect mappings (21)
│   ├── tokens.ts           # AUTO-GENERADO (no editar)
│   ├── ButtonStandard/
│   ├── Icon/
│   └── ...
├── tokens/source/          # 6 DTCG JSON files (fuente de verdad en código)
├── scripts/
│   └── generate-tokens.ts  # DTCG → tokens.ts
├── playground/             # Catálogo Vite (lo que se deploya)
│   ├── App.tsx             # 21 componentes + foundations + 4 patterns
│   ├── patterns/           # Login, TransactionsList, SettingsPanel, OnboardingFlow
│   ├── snippets/           # 60+ React/Tailwind/RN snippets
│   └── ui/                 # Sidebar, Card, CodeTabs, PropsPlayground, TokenDownload
├── public/                 # Logo, favicons
├── tailwind.config.ts      # Tokens como theme extension
├── vercel.json             # Config de deploy
└── vite.config.ts          # build.outDir = ../dist
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Levanta Vite en http://localhost:5173 |
| `npm run build` | Build de producción → `dist/` |
| `npm run preview` | Sirve el build local para QA pre-deploy |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run tokens:generate` | Regenera `components/tokens.ts` desde los DTCG |
| `npm run connect:parse` | Valida los 21 Code Connect mappings localmente |
| `npm run connect:publish` | Publica los mappings a Figma (**requiere plan Enterprise**) |

## Deploy a Vercel

1. **Pusheá el repo a GitHub**.
2. En Vercel: **Import Project** apuntando al repo.
3. Vercel auto-detecta Vite gracias a `vercel.json` — no hay que configurar nada.
4. Deploy.

El `vercel.json` declara:
- `buildCommand: npm run build`
- `outputDirectory: dist`
- `framework: vite`

**No hay variables de entorno requeridas** para el playground. El `FIGMA_ACCESS_TOKEN` solo se usa para `connect:publish` / `tokens:pull/push` (scripts locales, no se ejecutan en deploy).

## Figma source

**Archivo**: "Sistema de diseño de App total-coin"
**File key**: `y3zmw15iLpdpYwLKSMCpP9`

## Convenciones

- **Tokens**: un file por categoría en formato [W3C DTCG](https://tr.designtokens.org/format/).
- **Componentes**: un directorio por componente con `Component.tsx`, `Component.figma.tsx`, `README.md` opcional.
- **Nombres** en inglés para identificadores; strings/descripciones en español donde aporten.
- **Commits** convencionales (feat/fix/docs/chore/refactor). Sin "Co-Authored-By".

## Estado actual

- **21 componentes** (9 átomos · 7 moléculas · 5 organismos)
- **58 iconos** SVG inline (+147 disponibles del DS a demanda)
- **132 tokens** DTCG auto-generados
- **21 Code Connect mappings** parseados OK
- **4 patterns** de uso real (Login, Transactions, Settings, Onboarding)
- **Dark mode** completo con toggle funcional
- **Typecheck** ✅
