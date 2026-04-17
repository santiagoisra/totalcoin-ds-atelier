import { useState } from "react";
import { Tabla } from "../../components/Tabla/Tabla.tsx";
import { StatusPill } from "../../components/StatusPill/StatusPill.tsx";
import { Icon } from "../../components/Icon/Icon.tsx";
import { ButtonStandard } from "../../components/ButtonStandard/ButtonStandard.tsx";
import { Menu } from "../../components/Menu/Menu.tsx";
import { token } from "../../components/tokens.ts";

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "in" | "out";
  amount: number;
  status: "completed" | "pending" | "rejected";
}

const DEMO_DATA: Transaction[] = [
  { id: "TX-001", date: "2026-04-15", description: "Transferencia a J. Pérez", type: "out", amount: -1230, status: "completed" },
  { id: "TX-002", date: "2026-04-14", description: "Ingreso desde nómina", type: "in", amount: 45000, status: "completed" },
  { id: "TX-003", date: "2026-04-14", description: "Pago de servicios", type: "out", amount: -850, status: "pending" },
  { id: "TX-004", date: "2026-04-13", description: "Compra online", type: "out", amount: -299, status: "completed" },
  { id: "TX-005", date: "2026-04-12", description: "Devolución pago", type: "in", amount: 150, status: "rejected" },
  { id: "TX-006", date: "2026-04-11", description: "Transferencia recibida", type: "in", amount: 3200, status: "completed" },
];

const STATUS_MAP = {
  completed: { level: "low" as const, label: "Completada" },
  pending: { level: "medium" as const, label: "Pendiente" },
  rejected: { level: "high" as const, label: "Rechazada" },
};

function formatAmount(n: number): string {
  const sign = n < 0 ? "-" : "+";
  const abs = Math.abs(n).toLocaleString("es-AR");
  return `${sign} $ ${abs}`;
}

export function TransactionsList() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontSize: 22, fontWeight: 700, color: token.text.primary, margin: 0 }}>
            Movimientos
          </h2>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 14, color: token.text.secondary, margin: "4px 0 0" }}>
            {selected.size > 0 ? `${selected.size} seleccionados` : `${DEMO_DATA.length} operaciones`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <ButtonStandard variant="outline" size="small" leftIcon={<Icon name="filter" size={14} />}>
            Filtros
          </ButtonStandard>
          <ButtonStandard variant="outline" size="small" leftIcon={<Icon name="download" size={14} />}>
            Exportar
          </ButtonStandard>
          <Menu
            trigger={
              <button type="button" style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${token.border.default}`, background: token.bg.button, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="more-horizontal" size={18} />
              </button>
            }
            items={[
              { label: "Importar CSV", icon: <Icon name="upload" size={18} /> },
              { label: "Configurar columnas", icon: <Icon name="settings" size={18} /> },
              { label: "Eliminar seleccionadas", icon: <Icon name="trash" size={18} />, destructive: true, disabled: selected.size === 0 },
            ]}
          />
        </div>
      </div>

      <Tabla<Transaction>
        data={DEMO_DATA}
        selectable
        rowKey={(r) => r.id}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        pageSize={4}
        initialSort={{ column: "date", direction: "desc" }}
        columns={[
          { key: "id", header: "ID", width: "90px", sortable: true },
          { key: "date", header: "Fecha", width: "110px", sortable: true },
          { key: "description", header: "Descripción", sortable: true },
          {
            key: "type",
            header: "Tipo",
            width: "80px",
            align: "center",
            render: (row) => (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: row.type === "in" ? token.feedback.success : token.feedback.error, fontWeight: 600 }}>
                <Icon name={row.type === "in" ? "arrow-down" : "arrow-up"} size={14} />
              </span>
            ),
          },
          {
            key: "amount",
            header: "Monto",
            align: "right",
            sortable: true,
            render: (row) => (
              <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: row.amount > 0 ? token.feedback.success : token.text.primary }}>
                {formatAmount(row.amount)}
              </span>
            ),
          },
          {
            key: "status",
            header: "Estado",
            width: "130px",
            render: (row) => {
              const s = STATUS_MAP[row.status];
              return <StatusPill level={s.level}>{s.label}</StatusPill>;
            },
          },
        ]}
      />
    </div>
  );
}
