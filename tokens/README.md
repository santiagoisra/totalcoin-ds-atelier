# Tokens

Design tokens del DS de TotalCoin en formato [W3C DTCG](https://tr.designtokens.org/format/).

## Estructura

```
tokens/
├── source/               # Fuente unica de verdad (generada desde Figma)
│   ├── color.tokens.json
│   ├── typography.tokens.json
│   ├── dimension.tokens.json
│   ├── radius.tokens.json
│   └── shadow.tokens.json
└── README.md
```

## Reglas

- **Un archivo por categoria**. No mezclar tipos distintos en el mismo archivo.
- **Nombres en ingles** para los tokens. La descripcion (`$description`) puede ir en espanol si aporta contexto.
- **Referencias** entre tokens se hacen con el wrapper `{group.subgroup.token}`.
- **No editar a mano salvo correcciones intencionales**. El flujo normal es:
  1. Editar en Figma -> `npm run tokens:pull` -> commitear los cambios generados.
  2. Correccion en repo -> `npm run tokens:push` -> confirmar el cambio en Figma.

## DTCG tipos soportados

| Categoria | `$type` DTCG |
|-----------|--------------|
| Color | `color` |
| Typography | `typography` (compuesto) |
| Dimension (spacing, size) | `dimension` |
| Radius | `dimension` |
| Shadow | `shadow` (compuesto) |
| Duration | `duration` |
| Cubic bezier | `cubicBezier` |
| Opacity | `number` |
