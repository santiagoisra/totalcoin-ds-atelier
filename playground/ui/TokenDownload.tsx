import { useState } from "react";
import colorTokens from "../../tokens/source/color.tokens.json";
import typographyTokens from "../../tokens/source/typography.tokens.json";
import dimensionTokens from "../../tokens/source/dimension.tokens.json";
import radiusTokens from "../../tokens/source/radius.tokens.json";
import shadowTokens from "../../tokens/source/shadow.tokens.json";
import semanticTokens from "../../tokens/source/semantic.tokens.json";
import { cssVar } from "../../components/tokens.ts";

/**
 * Boton para descargar los tokens del DS en distintos formatos:
 *   - DTCG bundle (todos los 6 *.tokens.json unidos en uno)
 *   - CSS vars (stylesheet con `:root { --name: value }`)
 *   - tokens.ts (el helper generado)
 */
export function TokenDownload() {
  const [format, setFormat] = useState<"dtcg" | "css" | "ts">("dtcg");
  const [downloaded, setDownloaded] = useState(false);

  function download() {
    let content: string;
    let filename: string;
    let mime: string;

    if (format === "dtcg") {
      const bundle = {
        $schema: "https://schemas.designtokens.org/draft/v0.0/design-tokens.json",
        $description: "TotalCoin DS tokens — bundle de 6 DTCG files. Generado desde el Atelier el " + new Date().toISOString(),
        ...colorTokens,
        ...typographyTokens,
        ...dimensionTokens,
        ...radiusTokens,
        ...shadowTokens,
        ...semanticTokens,
      };
      content = JSON.stringify(bundle, null, 2);
      filename = "totalcoin-tokens.json";
      mime = "application/json";
    } else if (format === "css") {
      const lines: string[] = [
        "/* TotalCoin DS — CSS custom properties",
        " * Generado desde el Atelier el " + new Date().toISOString(),
        " * Import en tu entry CSS y todos los componentes del atelier heredan los tokens.",
        " */",
        "",
        ":root {",
      ];
      for (const [name, varString] of Object.entries(cssVar)) {
        const match = (varString as string).match(/,\s*(.+?)\)$/);
        const value = match ? match[1] : varString;
        lines.push(`  --${name}: ${value};`);
      }
      lines.push("}");
      content = lines.join("\n");
      filename = "totalcoin-tokens.css";
      mime = "text/css";
    } else {
      // ts — export simple const object
      const lines: string[] = [
        "/* TotalCoin DS tokens — TypeScript const",
        " * Generado desde el Atelier el " + new Date().toISOString(),
        " */",
        "",
        "export const tokens = {",
      ];
      for (const [name, varString] of Object.entries(cssVar)) {
        const match = (varString as string).match(/,\s*(.+?)\)$/);
        const value = match ? match[1] : varString;
        lines.push(`  ${JSON.stringify(name)}: ${JSON.stringify(value)},`);
      }
      lines.push("} as const;");
      content = lines.join("\n");
      filename = "totalcoin-tokens.ts";
      mime = "text/typescript";
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 1400);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as "dtcg" | "css" | "ts")}
        style={{
          padding: "6px 10px",
          background: "var(--pg-card-bg)",
          border: "1px solid var(--pg-card-border)",
          borderRadius: 6,
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          color: "var(--pg-text)",
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="dtcg">W3C DTCG JSON (.tokens.json)</option>
        <option value="css">CSS variables (.css)</option>
        <option value="ts">TypeScript const (.ts)</option>
      </select>
      <button
        type="button"
        onClick={download}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          background: downloaded ? "#22c55e" : "#003e70",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          transition: "background-color 160ms ease",
        }}
      >
        {downloaded ? "✓ Descargado" : "↓ Descargar tokens"}
      </button>
    </div>
  );
}
