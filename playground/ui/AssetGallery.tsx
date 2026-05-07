import { useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../../components/Modal/Modal.tsx";
import { ButtonStandard } from "../../components/ButtonStandard/ButtonStandard.tsx";
import { token, shadowValue } from "../../components/tokens.ts";
import assetsManifest from "virtual:assets-manifest";

interface AssetEntry {
  name: string;
  url: string;
  label: string;
}

// ---------- Download helper ----------

function downloadSVG(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ---------- Single asset card ----------

function AssetCard({ asset }: { asset: AssetEntry }) {
  const [copied, setCopied] = useState(false);

  const handleDownload = useCallback(() => {
    downloadSVG(asset.url, asset.name);
  }, [asset.url, asset.name]);

  const handleCopyName = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(asset.name.replace(/\.svg$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* noop */
    }
  }, [asset.name]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--pg-card-bg)",
        border: "1px solid var(--pg-border)",
        borderRadius: 12,
        overflow: "hidden",
        transition: "box-shadow 180ms ease, border-color 180ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = token.brand.primary as string;
        e.currentTarget.style.boxShadow = shadowValue.s;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--pg-border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Preview area */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 160,
          padding: 20,
          background: "var(--pg-canvas)",
          borderBottom: "1px solid var(--pg-border)",
        }}
      >
        <img
          src={asset.url}
          alt={asset.label}
          style={{ maxWidth: 140, maxHeight: 140, objectFit: "contain" }}
        />
      </div>

      {/* Info + actions */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          type="button"
          onClick={handleCopyName}
          title="Click para copiar el nombre"
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--pg-text)",
            lineHeight: 1.3,
            position: "relative",
          }}
        >
          {asset.label}
          {copied && (
            <span
              style={{
                position: "absolute",
                inset: -4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(34, 197, 94, 0.92)",
                color: "#fff",
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 4,
              }}
            >
              ✓ Copiado
            </span>
          )}
        </button>
        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "var(--pg-text-faint)" }}>
          {asset.name}
        </span>
        <ButtonStandard size="small" variant="outline" onClick={handleDownload} width="full">
          Descargar SVG
        </ButtonStandard>
      </div>
    </div>
  );
}

// ---------- Gallery modal ----------

export function AssetGallery({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return assetsManifest as AssetEntry[];
    return (assetsManifest as AssetEntry[]).filter(
      (a) => a.label.toLowerCase().includes(q) || a.name.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Assets (${(assetsManifest as AssetEntry[]).length})`}
      width="90vw"
      style={{ maxHeight: "90vh" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--pg-text-faint)",
              pointerEvents: "none",
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder={`Buscar entre ${(assetsManifest as AssetEntry[]).length} assets...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              height: 40,
              padding: "0 36px",
              background: "var(--pg-canvas)",
              border: "1px solid var(--pg-border)",
              borderRadius: 8,
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "var(--pg-text)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Limpiar búsqueda"
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: 24,
                height: 24,
                border: "none",
                background: "transparent",
                color: "var(--pg-text-muted)",
                cursor: "pointer",
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Count */}
        {search && (
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "var(--pg-text-muted)" }}>
            {filtered.length} de {(assetsManifest as AssetEntry[]).length} assets
          </div>
        )}

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {filtered.map((asset) => (
            <AssetCard key={asset.name} asset={asset} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--pg-text-muted)", fontFamily: "Inter, sans-serif" }}>
            No hay assets que coincidan con "{search}"
          </div>
        )}
      </div>
    </Modal>
  );
}