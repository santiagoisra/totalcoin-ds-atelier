import { useEffect, useState } from "react";
import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import githubDark from "@shikijs/themes/github-dark";
import tsxLang from "@shikijs/langs/tsx";
import tsLang from "@shikijs/langs/typescript";
import bashLang from "@shikijs/langs/bash";
import jsonLang from "@shikijs/langs/json";
import cssLang from "@shikijs/langs/css";

export interface CodeSnippetProps {
  code: string;
  language?: "tsx" | "ts" | "bash" | "json" | "css";
  label?: string;
  /** Si es true, omite el border + borderRadius propios — usar cuando va anidado (ej. CodeTabs). */
  embedded?: boolean;
}

// Highlighter singleton — bundle fijo (5 langs + 1 theme) con JS engine
// (sin wasm). Suficiente para tsx/ts/bash/json/css, bundle mucho mas chico
// que el lazy-loading completo de shiki.
const highlighter = createHighlighterCoreSync({
  themes: [githubDark],
  langs: [tsxLang, tsLang, bashLang, jsonLang, cssLang],
  engine: createJavaScriptRegexEngine(),
});

/**
 * Bloque de codigo con syntax highlighting (Shiki) + boton Copy.
 * Theme github-dark matching el fondo navy del playground.
 * Bundle restringido a los 5 lenguajes usados — ~100kb gzip total.
 */
export function CodeSnippet({ code, language = "tsx", label, embedded = false }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    try {
      const out = highlighter.codeToHtml(code, { lang: language, theme: "github-dark" });
      setHtml(out);
    } catch {
      setHtml(null);
    }
  }, [code, language]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }

  return (
    <div
      style={{
        position: "relative",
        borderRadius: embedded ? 0 : 10,
        border: embedded ? "none" : "1px solid #e2e8f0",
        background: "#0d1117",
        overflow: "hidden",
        fontFamily: "'Fira Code', ui-monospace, Consolas, monospace",
      }}
    >
      {label && (
        <div
          style={{
            padding: "8px 14px",
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            fontWeight: 500,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            borderBottom: "1px solid #1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{label}</span>
          <span style={{ color: "#475569", fontSize: 10 }}>{language}</span>
        </div>
      )}
      <div style={{ fontSize: 13, lineHeight: 1.6 }}>
        {html ? (
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            style={{ padding: "2px 0" }}
          />
        ) : (
          <pre style={{ margin: 0, padding: "14px 16px", color: "#e2e8f0", overflowX: "auto" }}>
            <code>{code}</code>
          </pre>
        )}
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy to clipboard"
        style={{
          position: "absolute",
          top: label ? 36 : 8,
          right: 8,
          padding: "6px 10px",
          borderRadius: 6,
          border: "1px solid #334155",
          background: copied ? "#22c55e" : "#1e293b",
          color: copied ? "#fff" : "#cbd5e1",
          fontFamily: "Inter, sans-serif",
          fontSize: 11,
          fontWeight: 500,
          cursor: "pointer",
          transition: "background-color 160ms ease, color 160ms ease",
          zIndex: 2,
        }}
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}
