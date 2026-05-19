# Cómo sincronizar tokens desde Figma

## Setup inicial

1. Clonar el repo y pararse en la raíz.
2. Copiar `.env.example` a `.env` y completar:

```
FIGMA_ACCESS_TOKEN=figd_tu_token_acá
FIGMA_FILE_KEY=y3zmw15iLpdpYwLKSMCpP9
```

El token se obtiene desde Figma → Settings → Personal Access Tokens. Necesita acceso de solo lectura al archivo del DS.

## Sincronizar (vía REST API)

```bash
npm run tokens:pull
```

Esto:
- Lee las variables desde Figma vía REST API
- Las transforma a formato DTCG (Design Token Community Group)
- Escribe los cambios en `tokens/source/`

### Qué se sincroniza

| Colección en Figma | Archivo DTCG | ¿Se incluye? |
|---|---|---|
| Bordes y espaciado | `dimension.tokens.json` | Sí |
| Color Styles | `color.tokens.json` | Sí |
| Semantic (Light) | `semantic.tokens.json` | Sí |
| Semantic (Dark) | `semantic-dark.tokens.json` | Sí |
| Brand Clients | — | **No** (overrides por cliente, no son del DS) |
| Montos sugeridos | — | **No** (no son tokens de diseño) |

Si alguna colección nueva aparece en Figma y debería excluirse, se agrega en `scripts/lib/figma-to-dtcg.ts`, función `collectionToFileName()`.

## Vía Desktop Bridge (cuando la REST API da 403)

Si el plan de Figma no es Enterprise, la REST API puede devolver 403 al intentar leer variables. En ese caso usamos el pipeline alternativo:

1. Abrir el archivo en **Figma Desktop**.
2. Abrir el plugin **Desktop Bridge** (botón derecho → Plugins → Development → Figma Desktop Bridge).
3. Ejecutar en OpenCode / el agente que uses:

```
npm run tokens:pull -- --input <archivo.json>
```

El agente se encarga de extraer las variables desde el plugin y pasarlas al pipeline.

## Verificar que funcionó

Después de correr `tokens:pull`, el diff debe mostrar solo cambios esperados:

```bash
git diff --stat tokens/source/
```

Si aparece un archivo nuevo de la colección "Brand Clients" o "Montos sugeridos", hay que excluirlo (avisar al mantenedor del script).

## Build del design system

Los tokens DTCG se compilan a CSS variables y TypeScript automáticamente al correr el build del proyecto. No hace falta un paso aparte.

```bash
npm run build
```
