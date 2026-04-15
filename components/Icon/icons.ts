/**
 * Catalogo de iconos SVG como paths inline.
 *
 * El DS de TotalCoin tiene ~175 iconos en Figma. Extraerlos uno por uno es
 * insostenible para una sesion. Esta tabla contiene los ~28 mas usados
 * (navegacion, feedback, CRUD, financiero, comunicacion). Cada icono es un
 * <path> SVG relativo a un viewBox 24x24, con stroke "currentColor".
 *
 * Para agregar uno nuevo:
 *   1. Buscar el SVG equivalente (o extraer de Figma via get_design_context).
 *   2. Simplificar a <path d="...">, fill="none", stroke "currentColor".
 *   3. Agregar la entrada aca.
 */

export type IconName =
  // nav
  | "check" | "close" | "chevron-up" | "chevron-down" | "chevron-left" | "chevron-right"
  | "arrow-up" | "arrow-down" | "arrow-left" | "arrow-right"
  | "menu" | "more-horizontal" | "more-vertical" | "external-link"
  // actions
  | "search" | "plus" | "minus" | "trash" | "edit" | "share" | "copy"
  | "download" | "upload" | "refresh" | "filter" | "link"
  // domain
  | "home" | "user" | "users" | "user-plus" | "bell" | "mail" | "phone"
  | "heart" | "star" | "wallet" | "credit-card" | "transfer" | "dollar" | "tag"
  | "calendar" | "clock" | "file" | "folder" | "image"
  // system
  | "settings" | "lock" | "unlock" | "login" | "logout"
  | "moon" | "sun" | "volume" | "volume-off"
  // feedback
  | "info" | "alert-triangle" | "x-circle" | "circle-check"
  // input
  | "eye" | "eye-closed";

/**
 * Cada entrada es JSX que renderiza dentro de un <svg viewBox="0 0 24 24">.
 * Fill "none", stroke "currentColor", strokeWidth 2 ruling.
 */
export const ICON_PATHS: Record<IconName, string> = {
  "check": "M5 12l4.5 4.5L19 7",
  "close": "M18 6L6 18M6 6l12 12",
  "chevron-up": "M18 15l-6-6-6 6",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-left": "M15 18l-6-6 6-6",
  "chevron-right": "M9 18l6-6-6-6",
  "search": "M11 17a6 6 0 100-12 6 6 0 000 12zM16 16l5 5",
  "plus": "M12 5v14M5 12h14",
  "minus": "M5 12h14",
  "trash": "M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2",
  "edit": "M11 4H4a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z",
  "share": "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13",
  "copy": "M9 13h6M9 17h6M15 3H8a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zM14 3v6h6",
  "home": "M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2V11z",
  "user": "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  "bell": "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  "mail": "M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6",
  "phone": "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.8a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.35 1.84.59 2.8.72a2 2 0 011.72 2.02z",
  "heart": "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  "star": "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  "wallet": "M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5M21 12h-5a2 2 0 100 4h5",
  "credit-card": "M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM2 10h20",
  "transfer": "M7 17l-4-4 4-4M3 13h14M17 3l4 4-4 4M21 7H7",
  "settings": "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  "info": "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM12 16v-4M12 8h.01",
  "alert-triangle": "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  "x-circle": "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM15 9l-6 6M9 9l6 6",
  "circle-check": "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3",
  "eye": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 100-6 3 3 0 000 6z",
  "eye-closed": "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M14.12 14.12a3 3 0 11-4.24-4.24M1 1l22 22",

  // ----- nav / arrows -----
  "arrow-up": "M12 19V5M5 12l7-7 7 7",
  "arrow-down": "M12 5v14M19 12l-7 7-7-7",
  "arrow-left": "M19 12H5M12 19l-7-7 7-7",
  "arrow-right": "M5 12h14M12 5l7 7-7 7",
  "menu": "M3 12h18M3 6h18M3 18h18",
  "more-horizontal": "M5 12h.01M12 12h.01M19 12h.01",
  "more-vertical": "M12 5v.01M12 12v.01M12 19v.01",
  "external-link": "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3",

  // ----- actions -----
  "download": "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  "upload": "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  "refresh": "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
  "filter": "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  "link": "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",

  // ----- domain -----
  "users": "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  "user-plus": "M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6",
  "dollar": "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  "tag": "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
  "calendar": "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18",
  "clock": "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM12 6v6l4 2",
  "file": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6",
  "folder": "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z",
  "image": "M21 5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21",

  // ----- system -----
  "lock": "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
  "unlock": "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 019.9-1",
  "login": "M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3",
  "logout": "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  "moon": "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  "sun": "M12 17a5 5 0 100-10 5 5 0 000 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
  "volume": "M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07",
  "volume-off": "M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6",
};
