# Components

Componentes del DS de TotalCoin: **referencia en codigo + mapping a Figma** via Code Connect.

> **Importante**: estos componentes NO son para consumo de productos. Son la representacion de codigo de cada componente del DS para que Figma pueda mostrar snippets relevantes en el panel de Dev Mode.

## Estructura

```
components/
├── Button/
│   ├── Button.tsx          # Referencia React del componente
│   └── Button.figma.tsx    # Code Connect: mapping con el nodo de Figma
└── ...
```

## Convenciones

- **Un directorio por componente**, PascalCase.
- Archivo `Component.tsx` exporta la referencia React (props tipadas, variantes declaradas como enums de string).
- Archivo `Component.figma.tsx` usa `figma.connect(...)` para mapear el nodo de Figma a esa referencia.
- **Nombres de variantes en ingles** para coincidir con la taxonomia que se eligio en Figma.

## Flujo

1. Nuevo componente en Figma -> crear `ComponentName/ComponentName.tsx` y `ComponentName.figma.tsx`.
2. `npm run connect:parse` para validar que los mappings sean consistentes.
3. `npm run connect:publish` para publicar al Figma y ver los snippets en Dev Mode.
