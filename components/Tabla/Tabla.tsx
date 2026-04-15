import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { token, shadowValue } from "../tokens.ts";
import { Icon } from "../Icon/Icon.tsx";

export type SortDirection = "asc" | "desc";

export interface TablaColumn<T> {
  key: string;
  header: ReactNode;
  /** Render custom. Si se omite, se muestra `row[key]` como string. */
  render?: (row: T, index: number) => ReactNode;
  /** Ancho CSS — cualquier string valido (px, %, fr). */
  width?: string;
  /** Alineacion del content + header. */
  align?: "left" | "center" | "right";
  /**
   * Habilita sort clickeando el header. Si es un callback, se usa como
   * comparator custom (a, b) => number. Si es `true`, se usa comparator default
   * (por `row[key]` via localeCompare / subtraccion).
   */
  sortable?: boolean | ((a: T, b: T) => number);
  /**
   * Habilita filter (input de texto) debajo del header. Si es un callback,
   * retorna true si la row matchea el query. Si es `true`, match default:
   * `String(row[key]).toLowerCase().includes(query.toLowerCase())`.
   */
  filterable?: boolean | ((row: T, query: string) => boolean);
}

export interface TablaProps<T> {
  columns: TablaColumn<T>[];
  data: T[];
  /** Si true, rows se destacan al hover. Default true. */
  hoverable?: boolean;
  /** Callback al clickear una row. Si se provee, el cursor es pointer. */
  onRowClick?: (row: T, index: number) => void;
  /** Empty state custom. */
  emptyMessage?: ReactNode;
  /** Max-height para scroll. */
  maxHeight?: number | string;
  /**
   * Cantidad de rows por pagina. Si se omite, NO hay paginacion (se muestran
   * todas). Default undefined.
   */
  pageSize?: number;
  /** Sort inicial opcional. */
  initialSort?: { column: string; direction: SortDirection };
  /**
   * Habilita columna de checkboxes para seleccion. Requiere `rowKey` para
   * identificar cada row de forma estable.
   */
  selectable?: boolean;
  /** Extrae un id estable de cada row. Default: row index. */
  rowKey?: (row: T, index: number) => string;
  /** Controlled selection: Set de rowKeys seleccionados. */
  selectedKeys?: Set<string>;
  /** Callback cuando cambia la seleccion. */
  onSelectionChange?: (selected: Set<string>) => void;
  className?: string;
  style?: CSSProperties;
}

function defaultCompare<T>(key: string, a: T, b: T): number {
  const av = (a as Record<string, unknown>)[key];
  const bv = (b as Record<string, unknown>)[key];
  if (av == null && bv == null) return 0;
  if (av == null) return -1;
  if (bv == null) return 1;
  if (typeof av === "number" && typeof bv === "number") return av - bv;
  return String(av).localeCompare(String(bv), undefined, { numeric: true });
}

/**
 * Organismo / Tabla.
 *
 * Data table con:
 * - Columns config + render custom + align
 * - Hover highlight + row click
 * - Empty state + sticky header + scroll maxHeight
 * - **Sort**: por columna via `sortable: true` o comparator custom. Click
 *   en header cicla asc → desc → none.
 * - **Paginacion**: prop `pageSize={N}` muestra controles footer con
 *   prev/next + contador "X-Y de Z".
 *
 * NO incluido (componer afuera): seleccion con checkboxes, filters externos,
 * expandable rows, virtualizacion.
 */
export function Tabla<T>({
  columns,
  data,
  hoverable = true,
  onRowClick,
  emptyMessage = "Sin datos",
  maxHeight,
  pageSize,
  initialSort,
  selectable = false,
  rowKey,
  selectedKeys: controlledSelection,
  onSelectionChange,
  className,
  style,
}: TablaProps<T>): JSX.Element {
  const [sort, setSort] = useState<{ column: string; direction: SortDirection } | null>(
    initialSort ?? null,
  );
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const hasFilters = columns.some((c) => c.filterable);
  const [uncontrolledSelection, setUncontrolledSelection] = useState<Set<string>>(() => new Set());

  const isControlledSelection = controlledSelection !== undefined;
  const selection = isControlledSelection ? controlledSelection : uncontrolledSelection;

  const getRowKey = (row: T, i: number): string => (rowKey ? rowKey(row, i) : String(i));

  function updateSelection(next: Set<string>) {
    if (!isControlledSelection) setUncontrolledSelection(next);
    onSelectionChange?.(next);
  }

  function toggleRow(key: string) {
    const next = new Set(selection);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    updateSelection(next);
  }

  const filteredData = useMemo(() => {
    const activeFilters = Object.entries(filters).filter(([, v]) => v.trim() !== "");
    if (activeFilters.length === 0) return data;
    return data.filter((row) =>
      activeFilters.every(([colKey, query]) => {
        const col = columns.find((c) => c.key === colKey);
        if (!col || !col.filterable) return true;
        if (typeof col.filterable === "function") return col.filterable(row, query);
        const cell = (row as Record<string, unknown>)[colKey];
        return String(cell ?? "").toLowerCase().includes(query.toLowerCase());
      }),
    );
  }, [data, filters, columns]);

  const sortedData = useMemo(() => {
    if (!sort) return filteredData;
    const col = columns.find((c) => c.key === sort.column);
    if (!col || !col.sortable) return filteredData;
    const cmp = typeof col.sortable === "function" ? col.sortable : (a: T, b: T) => defaultCompare(col.key, a, b);
    const out = [...filteredData].sort(cmp);
    if (sort.direction === "desc") out.reverse();
    return out;
  }, [filteredData, sort, columns]);

  const pagedData = useMemo(() => {
    if (!pageSize) return sortedData;
    const start = page * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const pageKeys = pagedData.map((row, i) => getRowKey(row, i));
  const allPageSelected = pageKeys.length > 0 && pageKeys.every((k) => selection.has(k));
  const somePageSelected = pageKeys.some((k) => selection.has(k)) && !allPageSelected;

  function togglePageSelection() {
    const next = new Set(selection);
    if (allPageSelected) pageKeys.forEach((k) => next.delete(k));
    else pageKeys.forEach((k) => next.add(k));
    updateSelection(next);
  }

  const totalPages = pageSize ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1;
  const showingFrom = pageSize ? page * pageSize + 1 : 1;
  const showingTo = pageSize
    ? Math.min((page + 1) * pageSize, sortedData.length)
    : sortedData.length;

  function handleHeaderClick(col: TablaColumn<T>) {
    if (!col.sortable) return;
    setSort((prev) => {
      if (!prev || prev.column !== col.key) return { column: col.key, direction: "asc" };
      if (prev.direction === "asc") return { column: col.key, direction: "desc" };
      return null;
    });
    setPage(0);
  }

  return (
    <div
      className={className}
      style={{
        width: "100%",
        background: token.bg.button,
        border: `${token.borderWidth.default} solid ${token.border.default}`,
        borderRadius: token.radius.md,
        boxShadow: shadowValue.xs,
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ maxHeight, overflow: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "Nunito, sans-serif",
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ background: token.bg.input, position: "sticky", top: 0, zIndex: 1 }}>
              {selectable && (
                <th
                  scope="col"
                  style={{
                    width: 40,
                    padding: `${token.size.md} ${token.size.s}`,
                    borderBottom: `${token.borderWidth.default} solid ${token.border.default}`,
                    textAlign: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = somePageSelected;
                    }}
                    onChange={togglePageSelection}
                    aria-label="Seleccionar todas las filas visibles"
                    style={{ accentColor: token.brand.primary, cursor: "pointer", width: 16, height: 16 }}
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sort?.column === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    onClick={() => handleHeaderClick(col)}
                    style={{
                      padding: `${token.size.md} ${token.size.md}`,
                      textAlign: col.align ?? "left",
                      fontWeight: 700,
                      fontSize: 13,
                      color: token.text.primary,
                      borderBottom: `${token.borderWidth.default} solid ${token.border.default}`,
                      width: col.width,
                      whiteSpace: "nowrap",
                      cursor: col.sortable ? "pointer" : undefined,
                      userSelect: col.sortable ? "none" : undefined,
                    }}
                    aria-sort={
                      isSorted ? (sort.direction === "asc" ? "ascending" : "descending") : col.sortable ? "none" : undefined
                    }
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, verticalAlign: "middle" }}>
                      {col.header}
                      {col.sortable && (
                        <span style={{ opacity: isSorted ? 1 : 0.35, color: isSorted ? token.brand.primary : token.text.tertiary, display: "inline-flex" }}>
                          <Icon
                            name={isSorted && sort.direction === "desc" ? "chevron-down" : "chevron-up"}
                            size={14}
                          />
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
            {hasFilters && (
              <tr style={{ background: token.bg.surface, position: "sticky", top: 40, zIndex: 1 }}>
                {selectable && <th style={{ padding: `${token.size.xs} ${token.size.s}`, borderBottom: `${token.borderWidth.default} solid ${token.border.default}` }} />}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      padding: `${token.size.xs} ${token.size.s}`,
                      borderBottom: `${token.borderWidth.default} solid ${token.border.default}`,
                    }}
                  >
                    {col.filterable && (
                      <input
                        type="text"
                        value={filters[col.key] ?? ""}
                        onChange={(e) => {
                          setFilters((f) => ({ ...f, [col.key]: e.target.value }));
                          setPage(0);
                        }}
                        placeholder="Filtrar…"
                        aria-label={`Filtrar por ${typeof col.header === "string" ? col.header : col.key}`}
                        style={{
                          width: "100%",
                          padding: "4px 8px",
                          background: token.bg.button,
                          border: `${token.borderWidth.default} solid ${token.border.default}`,
                          borderRadius: token.radius.xs,
                          fontFamily: "Nunito, sans-serif",
                          fontSize: 12,
                          color: token.text.primary,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    )}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  style={{
                    padding: `${token.size.xl} ${token.size.md}`,
                    textAlign: "center",
                    color: token.text.tertiary,
                    fontStyle: "italic",
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pagedData.map((row, rowIndex) => {
                const key = getRowKey(row, rowIndex);
                const isSelected = selection.has(key);
                return (
                <tr
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                  style={{
                    cursor: onRowClick ? "pointer" : undefined,
                    transition: hoverable ? "background-color 100ms ease" : undefined,
                    background: isSelected ? token.brand.primarySubtle : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (hoverable && !isSelected) e.currentTarget.style.backgroundColor = token.bg.surface;
                  }}
                  onMouseLeave={(e) => {
                    if (hoverable && !isSelected) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {selectable && (
                    <td
                      style={{
                        padding: `${token.size.md} ${token.size.s}`,
                        textAlign: "center",
                        borderBottom: rowIndex < pagedData.length - 1 ? `${token.borderWidth.default} solid ${token.border.default}` : undefined,
                        verticalAlign: "middle",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(key)}
                        aria-label={`Seleccionar fila ${rowIndex + 1}`}
                        style={{ accentColor: token.brand.primary, cursor: "pointer", width: 16, height: 16 }}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: `${token.size.md} ${token.size.md}`,
                        textAlign: col.align ?? "left",
                        color: token.text.primary,
                        fontWeight: 500,
                        borderBottom: rowIndex < pagedData.length - 1 ? `${token.borderWidth.default} solid ${token.border.default}` : undefined,
                        verticalAlign: "middle",
                      }}
                    >
                      {col.render
                        ? col.render(row, rowIndex)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pageSize && sortedData.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: token.size.md,
            padding: `${token.size.s} ${token.size.md}`,
            borderTop: `${token.borderWidth.default} solid ${token.border.default}`,
            background: token.bg.surface,
            fontFamily: "Nunito, sans-serif",
            fontSize: 13,
            color: token.text.secondary,
          }}
        >
          <span>
            {showingFrom}-{showingTo} de {sortedData.length}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: token.size.s }}>
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              aria-label="Página anterior"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                border: `${token.borderWidth.default} solid ${token.border.default}`,
                borderRadius: token.radius.s,
                background: token.bg.button,
                color: token.text.primary,
                cursor: page === 0 ? "not-allowed" : "pointer",
                opacity: page === 0 ? 0.5 : 1,
              }}
            >
              <Icon name="chevron-left" size={14} />
            </button>
            <span style={{ minWidth: 60, textAlign: "center" }}>
              {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              aria-label="Página siguiente"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                border: `${token.borderWidth.default} solid ${token.border.default}`,
                borderRadius: token.radius.s,
                background: token.bg.button,
                color: token.text.primary,
                cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
                opacity: page >= totalPages - 1 ? 0.5 : 1,
              }}
            >
              <Icon name="chevron-right" size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
