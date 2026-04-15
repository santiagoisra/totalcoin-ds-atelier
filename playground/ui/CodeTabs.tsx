import { useState } from "react";
import { CodeSnippet } from "./CodeSnippet.tsx";
import type { ComponentSnippets } from "../snippets/index.ts";

type TabKey = "react" | "tailwind" | "reactNative";

const TABS: Array<{ key: TabKey; label: string; language: "tsx" | "bash" | "ts" | "json" | "css" }> = [
  { key: "react", label: "React", language: "tsx" },
  { key: "tailwind", label: "Tailwind CSS", language: "tsx" },
  { key: "reactNative", label: "React Native", language: "tsx" },
];

export function CodeTabs({ snippets }: { snippets: ComponentSnippets }) {
  const [active, setActive] = useState<TabKey>("react");
  const current = TABS.find((t) => t.key === active)!;

  return (
    <div
      style={{
        borderRadius: 10,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}
    >
      <div
        role="tablist"
        style={{
          display: "flex",
          gap: 0,
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setActive(tab.key)}
              style={{
                padding: "10px 18px",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 500,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: isActive ? "#0f172a" : "#64748b",
                borderBottom: isActive ? "2px solid #003e70" : "2px solid transparent",
                marginBottom: -1,
                transition: "color 120ms ease, border-color 120ms ease",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div style={{ background: "#0f172a" }}>
        {/* Re-use CodeSnippet for consistent styling, but no label header (we have tabs) */}
        <CodeSnippet code={snippets[active]} language={current.language} />
      </div>
    </div>
  );
}
