import { useState } from "react";
import { Separador } from "../components/Separador/Separador.tsx";
import { Spinner } from "../components/Spinner/Spinner.tsx";
import { CheckBox } from "../components/CheckBox/CheckBox.tsx";
import { StatusPill } from "../components/StatusPill/StatusPill.tsx";
import { ButtonStandard } from "../components/ButtonStandard/ButtonStandard.tsx";
import { TextField } from "../components/TextField/TextField.tsx";
import { Textarea } from "../components/Textarea/Textarea.tsx";
import { Toggle } from "../components/Toggle/Toggle.tsx";
import { RadioButton } from "../components/RadioButton/RadioButton.tsx";
import { Alerta } from "../components/Alerta/Alerta.tsx";
import { CardInfo } from "../components/CardInfo/CardInfo.tsx";
import { Tooltip } from "../components/Tooltip/Tooltip.tsx";
import { Combobox } from "../components/Combobox/Combobox.tsx";
import { Menu } from "../components/Menu/Menu.tsx";
import { Icon } from "../components/Icon/Icon.tsx";
import { ICON_PATHS } from "../components/Icon/icons.ts";
import { DatePicker } from "../components/DatePicker/DatePicker.tsx";
import { Tabla } from "../components/Tabla/Tabla.tsx";
import { SidebarNav } from "../components/SidebarNav/SidebarNav.tsx";
import { Progreso } from "../components/Progreso/Progreso.tsx";
import { Stepper } from "../components/Stepper/Stepper.tsx";
import { Modal } from "../components/Modal/Modal.tsx";
import { token, cssVar, typographyStyle, shadowValue } from "../components/tokens.ts";
import { Sidebar } from "./ui/Sidebar.tsx";
import { Card, SubCard } from "./ui/Card.tsx";
import { Badge } from "./ui/Badge.tsx";
import { CodeSnippet } from "./ui/CodeSnippet.tsx";
import { CodeTabs } from "./ui/CodeTabs.tsx";
import { snippets } from "./snippets/index.ts";
import { PropsPlayground } from "./ui/PropsPlayground.tsx";
import { TokenDownload } from "./ui/TokenDownload.tsx";
import { LoginScreen } from "./patterns/LoginScreen.tsx";
import { TransactionsList } from "./patterns/TransactionsList.tsx";
import { SettingsPanel } from "./patterns/SettingsPanel.tsx";
import { OnboardingFlow } from "./patterns/OnboardingFlow.tsx";

// ---------- helpers ----------

function SectionHeading({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) {
  return (
    <div id={id} style={{ scrollMarginTop: 20, margin: "40px 0 16px" }}>
      <h1 style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--pg-text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {title}
      </h1>
      {subtitle && <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "var(--pg-text-faint)", margin: "4px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

function Swatch({ name, value }: { name: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const hex = extractFallback(value);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Click para copiar: ${hex}`}
      aria-label={`Copiar ${name}: ${hex}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minWidth: 108,
        padding: 0,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
      }}
    >
      <div style={{ height: 56, borderRadius: 8, background: value, border: "1px solid var(--pg-border)", position: "relative" }}>
        {copied && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(34, 197, 94, 0.92)",
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 8,
            }}
          >
            ✓ Copiado
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500, color: "var(--pg-text)" }}>{name}</span>
        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "var(--pg-text-muted)" }}>{hex}</span>
      </div>
    </button>
  );
}

function extractFallback(cssVarString: string): string {
  const m = cssVarString.match(/,\s*(.+?)\)$/);
  return m ? m[1] : cssVarString;
}

// ---------- foundations demos ----------

function ColorPalette() {
  const scales = [
    { group: "primary", shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
    { group: "neutral", shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
    { group: "secondary", shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
    { group: "green", shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
    { group: "red", shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
  ] as const;

  return (
    <>
      {scales.map((scale) => (
        <SubCard key={scale.group} title={`color.${scale.group}`}>
          {scale.shades.map((s) => {
            const key = `color-${scale.group}-${s}` as keyof typeof cssVar;
            return <Swatch key={s} name={String(s)} value={cssVar[key]} />;
          })}
        </SubCard>
      ))}
      <SubCard title="semantic / brand">
        <Swatch name="brand.primary" value={token.brand.primary} />
        <Swatch name="brand.primaryDark" value={token.brand.primaryDark} />
        <Swatch name="brand.primaryLight" value={token.brand.primaryLight} />
        <Swatch name="brand.primarySubtle" value={token.brand.primarySubtle} />
        <Swatch name="brand.secondary" value={token.brand.secondary} />
      </SubCard>
      <SubCard title="semantic / text & surfaces">
        <Swatch name="text.primary" value={token.text.primary} />
        <Swatch name="text.secondary" value={token.text.secondary} />
        <Swatch name="text.tertiary" value={token.text.tertiary} />
        <Swatch name="text.onPrimary" value={token.text.onPrimary} />
        <Swatch name="bg.surface" value={token.bg.surface} />
        <Swatch name="bg.button" value={token.bg.button} />
        <Swatch name="bg.input" value={token.bg.input} />
        <Swatch name="border.default" value={token.border.default} />
      </SubCard>
      <SubCard title="semantic / feedback">
        <Swatch name="feedback.success" value={token.feedback.success} />
        <Swatch name="feedback.error" value={token.feedback.error} />
        <Swatch name="focus.ring" value={token.focus.ring} />
        <Swatch name="focus.ringError" value={token.focus.ringError} />
      </SubCard>
    </>
  );
}

function TypographyScale() {
  const styles = Object.entries(typographyStyle);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      {styles.map(([name, style]) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", border: "1px solid var(--pg-border)", borderRadius: 8 }}>
          <div style={{ minWidth: 60, fontFamily: "ui-monospace, monospace", fontSize: 11, color: "var(--pg-text-muted)", fontWeight: 600 }}>{name}</div>
          <div style={{ ...style, color: token.text.primary, flex: 1 }}>The quick brown fox jumps over the lazy dog</div>
          <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "var(--pg-text-faint)" }}>
            {String(style.fontSize)} / {String(style.fontWeight)}
          </div>
        </div>
      ))}
    </div>
  );
}

function SpacingRadiusScale() {
  const sizes = [
    { key: "xs", value: 4 },
    { key: "s", value: 8 },
    { key: "md", value: 12 },
    { key: "l", value: 16 },
    { key: "xl", value: 24 },
    { key: "xxl", value: 36 },
  ];
  return (
    <>
      <SubCard title="size.*">
        {sizes.map((s) => (
          <div key={s.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 64 }}>
            <div style={{ height: 48, display: "flex", alignItems: "center" }}>
              <div style={{ width: s.value, height: s.value, background: "#003e70", borderRadius: 2 }} />
            </div>
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "var(--pg-text-muted)" }}>
              {s.key} — {s.value}px
            </span>
          </div>
        ))}
      </SubCard>
      <SubCard title="radius.*">
        {[
          { key: "xs", val: 4 },
          { key: "s", val: 8 },
          { key: "md", val: 12 },
          { key: "l", val: 16 },
        ].map((r) => (
          <div key={r.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 64, height: 64, background: "var(--pg-badge-bg)", border: "1px solid var(--pg-border)", borderRadius: r.val }} />
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "var(--pg-text-muted)" }}>
              {r.key} — {r.val}px
            </span>
          </div>
        ))}
      </SubCard>
    </>
  );
}

function ShadowDemo() {
  const shadows = [
    { key: "xs", val: shadowValue.xs },
    { key: "s", val: shadowValue.s },
    { key: "md", val: shadowValue.md },
    { key: "xl", val: shadowValue.xl },
    { key: "ne", val: shadowValue.ne },
  ];
  return (
    <SubCard>
      {shadows.map((s) => (
        <div key={s.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, margin: 12 }}>
          <div style={{ width: 88, height: 88, background: "#fff", border: "1px solid var(--pg-border)", borderRadius: 12, boxShadow: s.val }} />
          <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "var(--pg-text-muted)" }}>shadow.{s.key}</span>
        </div>
      ))}
    </SubCard>
  );
}

// ---------- main app ----------

export function App() {
  const [check, setCheck] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [radio, setRadio] = useState("a");
  const [textareaError, setTextareaError] = useState(false);
  const [progress, setProgress] = useState(35);
  const [step, setStep] = useState(2);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--pg-canvas)", fontFamily: "Inter, sans-serif" }}>
      <Sidebar />
      <main style={{ marginLeft: 272, padding: "32px 40px", maxWidth: 1080 }}>
        {/* ---------- HERO / OVERVIEW ---------- */}
        <div id="overview" style={{ scrollMarginTop: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            <Badge tone="primary">v0.1</Badge>
            <Badge>React 18</Badge>
            <Badge>TypeScript</Badge>
            <Badge>Vite</Badge>
            <Badge>Figma Code Connect</Badge>
            <Badge>W3C DTCG</Badge>
          </div>
          <h1 style={{ fontFamily: "Inter, sans-serif", fontSize: 48, fontWeight: 800, margin: "0 0 12px", color: "var(--pg-text)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            TotalCoin Design System
          </h1>
          <p style={{ fontSize: 18, color: "var(--pg-text-secondary)", maxWidth: 680, margin: "0 0 8px", lineHeight: 1.5 }}>
            Atelier bidireccional entre el Figma del DS y su espejo en código. Tokens DTCG, componentes React tipados, mappings Code Connect. Sin framework de producto — <strong>esto no es una app, es un taller del sistema</strong>.
          </p>
          <p style={{ fontSize: 14, color: "var(--pg-text-muted)", maxWidth: 680 }}>
            21 componentes · 132 tokens · 21 Code Connect mappings · dark mode ready · 58 icons · 0 librerías de UI externas (todo inline styles + tokens).
          </p>
        </div>

        <Card
          id="installation"
          title="Installation"
          subtitle="Cloná el repo y levantá el dev server."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <CodeSnippet label="1. Install" language="bash" code={`git clone <repo>\nnpm install`} />
            <CodeSnippet label="2. Dev server" language="bash" code="npm run dev" />
            <CodeSnippet label="3. Regenerar tokens desde DTCG" language="bash" code="npm run tokens:generate" />
            <CodeSnippet label="4. Validar Code Connect mappings" language="bash" code="npm run connect:parse" />
          </div>
        </Card>

        <Card
          id="structure"
          title="Project Structure"
          subtitle="Directorios clave y su propósito."
        >
          <CodeSnippet
            language="bash"
            code={`.
├── tokens/source/          # 6 DTCG JSONs — source of truth del DS
│   ├── color.tokens.json
│   ├── typography.tokens.json
│   ├── dimension.tokens.json
│   ├── radius.tokens.json
│   ├── shadow.tokens.json
│   └── semantic.tokens.json
├── components/             # React refs + Code Connect mappings
│   ├── tokens.ts           # AUTO-GENERADO, no editar a mano
│   ├── ButtonStandard/
│   ├── CheckBox/
│   └── ... (15 componentes)
├── scripts/
│   ├── generate-tokens.ts  # DTCG -> tokens.ts
│   ├── pull-tokens.ts      # (stub) Figma -> repo
│   └── push-tokens.ts      # (stub) repo -> Figma
└── playground/             # Este catalogo visual
    ├── App.tsx
    └── ui/                 # Card, Sidebar, CodeSnippet, Badge`}
          />
        </Card>

        {/* ---------- FOUNDATIONS ---------- */}
        <SectionHeading id="foundations" title="Foundations" subtitle="Los building blocks del DS." />

        <Card id="foundations-colors" title="Colors" subtitle="5 escalas primitivas (10 shades c/u) + capa semantic + feedback. Clickeá un color para copiar el hex.">
          <div style={{ marginBottom: 20, padding: "12px 16px", background: "var(--pg-canvas)", border: "1px solid var(--pg-card-border)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "var(--pg-text)" }}>Descargar tokens del DS</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "var(--pg-text-muted)" }}>132 tokens en 3 formatos — DTCG, CSS vars, o TS const</div>
            </div>
            <TokenDownload />
          </div>
          <ColorPalette />
        </Card>

        <Card id="foundations-typography" title="Typography" subtitle="Nunito + Montserrat (brand original) · Inter (era moderna, inputs nuevos). 11 estilos compuestos.">
          <TypographyScale />
        </Card>

        <Card id="foundations-spacing" title="Spacing & Radius" subtitle="Misma scale XS..XXL en Figma, separada en DTCG por claridad.">
          <SpacingRadiusScale />
        </Card>

        <Card id="foundations-shadows" title="Shadows" subtitle="5 tiers: xs (sutil moderno), s/md/xl (escala original), ne (Nueva Experiencia — naranja tinted).">
          <ShadowDemo />
        </Card>

        {/* ---------- ATOMOS ---------- */}
        <SectionHeading id="atomos" title="Atomos" />

        <Card id="icon" title="Icon" subtitle="Meta-componente con 28 iconos SVG inline. Stroke currentColor, extensible via icons.ts.">
          <SubCard title="Catálogo (click + Copy abajo para ver el patrón)">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8, width: "100%" }}>
              {(Object.keys(ICON_PATHS) as Array<keyof typeof ICON_PATHS>).map((name) => (
                <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 10, border: `1px solid ${token.border.default}`, borderRadius: 8, fontFamily: "Inter", fontSize: 11, color: token.text.secondary }}>
                  <Icon name={name} size={24} color={token.brand.primary} />
                  <span style={{ textAlign: "center", wordBreak: "break-word" }}>{name}</span>
                </div>
              ))}
            </div>
          </SubCard>
          <SubCard title="Variaciones">
            <Icon name="check" size={16} color={token.feedback.success} />
            <Icon name="close" size={24} color={token.feedback.error} />
            <Icon name="chevron-right" size={32} color={token.brand.primary} />
            <Icon name="heart" size={48} color={token.feedback.error} />
          </SubCard>
          <CodeTabs snippets={snippets.icon} />
        </Card>

        <Card id="separador" title="Separador" subtitle="Línea divisora con label opcional. Figma usa PNG raster; code-side usa border-top.">
          <SubCard>
            <div style={{ width: "100%", maxWidth: 360 }}>
              <Separador />
              <div style={{ height: 16 }} />
              <Separador text="O" />
            </div>
          </SubCard>
          <CodeTabs snippets={snippets.separador} />
        </Card>

        <Card id="spinner" title="Spinner" subtitle="Anillo rotatorio vía Web Animations API (no keyframes CSS, respeta prefers-reduced-motion).">
          <SubCard title="Sizes">
            <Spinner size={24} />
            <Spinner size={48} />
            <Spinner size={72} />
          </SubCard>
          <SubCard title="Colores custom">
            <Spinner size={48} color={token.feedback.error} />
            <Spinner size={48} color={token.feedback.success} />
          </SubCard>
          <CodeTabs snippets={snippets.spinner} />
        </Card>

        <Card id="checkbox" title="CheckBox" subtitle="21×21 con check SVG inline (no PNG). Figma preserva el typo 'Cheked'.">
          <SubCard title="Interactivo">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CheckBox checked={check} onChange={setCheck} ariaLabel="Acepto" />
              <span style={{ fontFamily: "Nunito", fontSize: 14 }}>{check ? "Marcado" : "Sin marcar"}</span>
            </div>
          </SubCard>
          <SubCard title="Estáticos">
            <CheckBox checked ariaLabel="a" />
            <CheckBox checked={false} ariaLabel="b" />
            <CheckBox checked disabled ariaLabel="c" />
          </SubCard>
          <CodeTabs snippets={snippets.checkbox} />
        </Card>

        <Card id="toggle" title="Toggle" subtitle="51×31 pill con knob animado (transition 180ms).">
          <SubCard title="Interactivo">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Toggle checked={toggle} onCheckedChange={setToggle} ariaLabel="Notif" />
              <span style={{ fontFamily: "Nunito", fontSize: 14 }}>{toggle ? "Encendido" : "Apagado"}</span>
            </div>
          </SubCard>
          <SubCard title="Estáticos">
            <Toggle checked disabled ariaLabel="on-disabled" />
            <Toggle checked={false} disabled ariaLabel="off-disabled" />
          </SubCard>
          <CodeTabs snippets={snippets.toggle} />
        </Card>

        <Card id="radiobutton" title="RadioButton" subtitle="25×25 con check SVG (el DS reutiliza el patrón del CheckBox, atípico para radios). Input nativo + label wrapper.">
          <SubCard title="Grupo">
            {(["a", "b", "c"] as const).map((v) => (
              <label key={v} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Nunito", fontSize: 14, cursor: "pointer" }}>
                <RadioButton name="demo" value={v} checked={radio === v} onChange={() => setRadio(v)} />
                Opción {v.toUpperCase()}
              </label>
            ))}
          </SubCard>
          <SubCard title="Disabled">
            <RadioButton checked disabled ariaLabel="dc" />
            <RadioButton checked={false} disabled ariaLabel="de" />
          </SubCard>
          <CodeTabs snippets={snippets.radiobutton} />
        </Card>

        <Card id="statuspill" title="StatusPill" subtitle="4 niveles (low/medium/high/neutral) con label custom + icono opcional.">
          <SubCard title="Niveles">
            <StatusPill level="low">Bajo</StatusPill>
            <StatusPill level="medium">Medio</StatusPill>
            <StatusPill level="high">Crítico</StatusPill>
            <StatusPill level="neutral">Neutro</StatusPill>
          </SubCard>
          <CodeTabs snippets={snippets.statuspill} />
        </Card>

        <Card id="progreso" title="Progreso" subtitle="Barra lineal 0-100 con transition 240ms.">
          <SubCard title={`Value: ${progress}`}>
            <div style={{ width: 320 }}>
              <Progreso value={progress} />
            </div>
            <ButtonStandard size="small" variant="outline" onClick={() => setProgress(Math.max(0, progress - 10))}>−10</ButtonStandard>
            <ButtonStandard size="small" variant="outline" onClick={() => setProgress(Math.min(100, progress + 10))}>+10</ButtonStandard>
          </SubCard>
          <SubCard title="Colores custom">
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 320 }}>
              <Progreso value={70} color={token.feedback.success} />
              <Progreso value={25} color={token.feedback.error} />
            </div>
          </SubCard>
          <CodeTabs snippets={snippets.progreso} />
        </Card>

        <Card id="stepper" title="Stepper" subtitle="Dots conectados por línea de tiempo. Step activo en brand.primary.">
          <SubCard title={`Step ${step + 1} / 5`}>
            <div style={{ width: 280 }}>
              <Stepper steps={5} current={step} />
            </div>
            <ButtonStandard size="small" variant="outline" onClick={() => setStep(Math.max(0, step - 1))}>←</ButtonStandard>
            <ButtonStandard size="small" variant="outline" onClick={() => setStep(Math.min(4, step + 1))}>→</ButtonStandard>
          </SubCard>
          <SubCard title="Variaciones">
            <div style={{ width: 280 }}><Stepper steps={3} current={1} /></div>
            <div style={{ width: 280 }}><Stepper steps={7} current={3} /></div>
          </SubCard>
          <CodeTabs snippets={snippets.stepper} />
        </Card>

        {/* ---------- MOLECULAS ---------- */}
        <SectionHeading id="moleculas" title="Moleculas" />

        <Card id="buttonstandard" title="ButtonStandard" subtitle="~192 variantes Figma → 1 componente con props ortogonales. Playground interactivo abajo — tocá los controles.">
          <SubCard title="🎛️ Playground interactivo">
            <PropsPlayground
              controls={{
                variant: { type: "enum", options: ["primary", "secondary", "outline", "tertiary", "danger", "danger-outline"], default: "primary" },
                size: { type: "enum", options: ["medium", "small"], default: "medium" },
                width: { type: "enum", options: ["auto", "full"], default: "auto" },
                rounded: { type: "boolean", default: false },
                disabled: { type: "boolean", default: false },
                pressed: { type: "boolean", default: false },
                label: { type: "string", default: "Confirmar", placeholder: "Label del botón" },
              }}
              preview={(v) => (
                <ButtonStandard
                  variant={v.variant as "primary" | "secondary" | "outline" | "tertiary" | "danger" | "danger-outline"}
                  size={v.size as "medium" | "small"}
                  width={v.width as "auto" | "full"}
                  rounded={v.rounded}
                  disabled={v.disabled}
                  pressed={v.pressed}
                >
                  {v.label}
                </ButtonStandard>
              )}
              codeFor={(v) => {
                const props: string[] = [];
                if (v.variant !== "primary") props.push(`variant="${v.variant}"`);
                if (v.size !== "medium") props.push(`size="${v.size}"`);
                if (v.width !== "auto") props.push(`width="${v.width}"`);
                if (v.rounded) props.push("rounded");
                if (v.disabled) props.push("disabled");
                if (v.pressed) props.push("pressed");
                return `<ButtonStandard${props.length ? " " + props.join(" ") : ""}>\n  ${v.label}\n</ButtonStandard>`;
              }}
            />
          </SubCard>
          <SubCard title="Variantes">
            <ButtonStandard variant="primary">Primario</ButtonStandard>
            <ButtonStandard variant="primary" pressed>Apretado</ButtonStandard>
            <ButtonStandard variant="secondary">Secundario</ButtonStandard>
            <ButtonStandard variant="outline">Outline</ButtonStandard>
            <ButtonStandard variant="tertiary">Terciario</ButtonStandard>
            <ButtonStandard variant="danger">Danger</ButtonStandard>
            <ButtonStandard variant="danger-outline">DangerOutline</ButtonStandard>
            <ButtonStandard disabled>Deshabilitado</ButtonStandard>
          </SubCard>
          <SubCard title="Sizes & width">
            <ButtonStandard size="small">Small</ButtonStandard>
            <ButtonStandard size="medium">Medium</ButtonStandard>
            <ButtonStandard width="full" rounded>Full + rounded</ButtonStandard>
          </SubCard>
          <CodeTabs snippets={snippets.buttonstandard} />
        </Card>

        <Card id="textfield" title="TextField" subtitle="Caja de texto con label/sublabel/border/iconos. Era original del DS (Nunito).">
          <SubCard>
            <TextField label="Texto de la caja" sublabel="Subtexto de la caja" placeholder="Placeholder" />
            <TextField label="Seleccionado" placeholder="Con borde primary" selected />
            <TextField placeholder="Deshabilitado" disabled />
          </SubCard>
          <CodeTabs snippets={snippets.textfield} />
        </Card>

        <Card id="textarea" title="Textarea" subtitle="Era nueva del DS — Inter font, focus ring visible (3px), shadow-xs.">
          <SubCard title="Default & round">
            <div style={{ width: 280 }}><Textarea placeholder="Escribí tu mensaje acá." /></div>
            <div style={{ width: 280 }}><Textarea roundness="round" placeholder="Round variant" /></div>
          </SubCard>
          <SubCard title="Error state (clickeá Toggle para ver focus-ring rojo)">
            <div style={{ width: 280 }}><Textarea error={textareaError} defaultValue="Valor con error" /></div>
            <ButtonStandard size="small" variant="outline" onClick={() => setTextareaError(!textareaError)}>
              Toggle error
            </ButtonStandard>
          </SubCard>
          <CodeTabs snippets={snippets.textarea} />
        </Card>

        <Card id="alerta" title="Alerta" subtitle="4 colores semánticos con strip lateral + icono default + trailing action.">
          <SubCard>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
              <Alerta color="warning">¡Ya podés solicitar tu tarjeta prepaga sin cargo!</Alerta>
              <Alerta color="success">Transferencia realizada con éxito.</Alerta>
              <Alerta color="error" rightLabel="Reintentar">No pudimos procesar tu pago.</Alerta>
              <Alerta color="info" showLeftIcon={false}>Actualizá tu app para la nueva experiencia.</Alerta>
            </div>
          </SubCard>
          <CodeTabs snippets={snippets.alerta} />
        </Card>

        <Card id="tooltip" title="Tooltip" subtitle="Bubble 'dumb' — positioning lo maneja el consumidor (Floating UI, Radix, o CSS).">
          <SubCard title="Arrow positions">
            <div style={{ paddingBottom: 20 }}><Tooltip>Arrow abajo (default)</Tooltip></div>
            <div style={{ paddingTop: 20 }}><Tooltip arrow="top">Arrow arriba</Tooltip></div>
          </SubCard>
          <SubCard title="Arrow align">
            <Tooltip arrowAlign="start">start</Tooltip>
            <Tooltip arrowAlign="end">end</Tooltip>
          </SubCard>
          <CodeTabs snippets={snippets.tooltip} />
        </Card>

        <Card id="combobox" title="Combobox" subtitle="Desplegable con búsqueda. Controlled/uncontrolled, filter client-side, accesible (combobox/listbox/option).">
          <SubCard>
            <Combobox
              options={[
                { value: "1", label: "Opción del filtro 1" },
                { value: "2", label: "Opción del filtro 2" },
                { value: "3", label: "Opción del filtro 3" },
                { value: "4", label: "Opción del filtro 4" },
                { value: "5", label: "Opción del filtro 5" },
                { value: "6", label: "Opción del filtro 6" },
              ]}
              defaultValue="2"
            />
          </SubCard>
          <CodeTabs snippets={snippets.combobox} />
        </Card>

        <Card id="menu" title="Menu (dropdown)" subtitle="Dropdown genérico. NOTA: el 'Organismo / Menu' de Figma es en realidad el sidebar nav de la app — este es un patrón distinto (dropdown contextual tipo Radix/shadcn).">
          <SubCard title="Trigger + items">
            <Menu
              trigger={<ButtonStandard variant="outline">Acciones ▾</ButtonStandard>}
              items={[
                { label: "Editar", value: "edit" },
                { label: "Duplicar", value: "duplicate" },
                { label: "Compartir", value: "share" },
                { label: "Eliminar", value: "delete", destructive: true },
              ]}
              onSelect={(v) => console.log("Seleccionado:", v)}
            />
          </SubCard>
          <SubCard title="Con icon trigger">
            <Menu
              trigger={
                <button type="button" aria-label="Más opciones" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${token.border.default}`, background: token.bg.button, cursor: "pointer" }}>
                  ⋯
                </button>
              }
              items={[
                { label: "Opción A", value: "a" },
                { label: "Opción B", value: "b" },
                { label: "Deshabilitada", value: "c", disabled: true },
              ]}
            />
          </SubCard>
          <CodeTabs snippets={snippets.menu} />
        </Card>

        {/* ---------- ORGANISMOS ---------- */}
        <SectionHeading id="organismos" title="Organismos" />

        <Card id="cardinfo" title="CardInfo" subtitle="Primer organismo — container con rows de key/value. Compound pattern (CardInfo.Row) + data-driven (prop rows).">
          <SubCard title="Data-driven">
            <CardInfo rows={[
              { label: "Razón social", value: "BETWARRIOR" },
              { label: "DNI / CUIT", value: "284556437" },
              { label: "Estado", value: "Activo" },
            ]} />
          </SubCard>
          <SubCard title="Compound — con ReactNodes embebidos">
            <CardInfo>
              <CardInfo.Row label="Estado" value={<StatusPill level="low">Activo</StatusPill>} />
              <CardInfo.Row label="Saldo" value={<span style={{ fontFamily: "Montserrat", fontWeight: 700, fontSize: 18 }}>$ 12.430</span>} />
              <CardInfo.Row label="Notificaciones" value={<Toggle checked onCheckedChange={() => {}} ariaLabel="Notif" />} />
            </CardInfo>
          </SubCard>
          <CodeTabs snippets={snippets.cardinfo} />
        </Card>

        <Card id="modal" title="Modal" subtitle="Overlay con backdrop. ESC + click fuera cierran. Renderiza vía React Portal a document.body.">
          <SubCard>
            <ButtonStandard onClick={() => setModalOpen(true)}>Abrir modal</ButtonStandard>
          </SubCard>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Ingresá el PIN"
            footer={
              <>
                <ButtonStandard variant="outline" width="full" onClick={() => setModalOpen(false)}>Cancelar</ButtonStandard>
                <ButtonStandard variant="primary" disabled width="full">Entrar</ButtonStandard>
              </>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center", paddingTop: 8 }}>
              <p style={{ fontFamily: "Nunito", fontSize: 18, fontWeight: 700, color: token.text.primary, textAlign: "center", margin: 0 }}>
                Ingresá tu PIN para entrar a la mesa
              </p>
              <TextField placeholder="PIN" />
            </div>
          </Modal>
          <CodeTabs snippets={snippets.modal} />
        </Card>

        <Card id="datepicker" title="DatePicker" subtitle="Input + calendar popup. Pure Date native, sin libs. ESC cierra, click fuera cierra, min/max range.">
          <SubCard>
            <DatePicker placeholder="Seleccioná una fecha" />
          </SubCard>
          <SubCard title="Con range min/max">
            <DatePicker defaultValue="2026-04-15" min="2026-01-01" max="2026-12-31" />
          </SubCard>
          <CodeTabs snippets={snippets.datepicker} />
        </Card>

        <Card id="tabla" title="Tabla" subtitle="Data table tipada genérica. Headers sortables, paginación, selection con checkboxes (indeterminate al parcial), render custom por columna.">
          <SubCard title="Sort + pagination + selection — clickeá headers o checkboxes">
            <Tabla
              pageSize={3}
              selectable
              rowKey={(row: { id: number }) => String(row.id)}
              initialSort={{ column: "amountNum", direction: "desc" }}
              columns={[
                { key: "id", header: "ID", width: "60px", sortable: true },
                { key: "name", header: "Nombre", sortable: true, filterable: true },
                {
                  key: "status",
                  header: "Estado",
                  sortable: true,
                  render: (row: { status: "ok" | "bad" }) => (
                    <StatusPill level={row.status === "ok" ? "low" : "high"}>
                      {row.status === "ok" ? "Activo" : "Bloqueado"}
                    </StatusPill>
                  ),
                },
                {
                  key: "amountNum",
                  header: "Monto",
                  align: "right",
                  sortable: true,
                  render: (row: { amount: string }) => row.amount,
                },
              ]}
              data={[
                { id: 1, name: "Juan Pérez", status: "ok" as const, amount: "$ 1.230", amountNum: 1230 },
                { id: 2, name: "María García", status: "ok" as const, amount: "$ 4.500", amountNum: 4500 },
                { id: 3, name: "Pedro López", status: "bad" as const, amount: "$ 0", amountNum: 0 },
                { id: 4, name: "Ana Fernández", status: "ok" as const, amount: "$ 12.430", amountNum: 12430 },
                { id: 5, name: "Carlos Ruiz", status: "ok" as const, amount: "$ 780", amountNum: 780 },
                { id: 6, name: "Sofia Martínez", status: "bad" as const, amount: "$ 2.100", amountNum: 2100 },
                { id: 7, name: "Luis Ramírez", status: "ok" as const, amount: "$ 5.670", amountNum: 5670 },
              ]}
              onRowClick={(row) => console.log("row clicked:", row)}
            />
          </SubCard>
          <CodeTabs snippets={snippets.tabla} />
        </Card>

        <Card id="sidebarnav" title="SidebarNav" subtitle="Sidebar de navegación como el de la app de TotalCoin. Collapsable, con secciones e items.">
          <SubCard title="Demo (300px alto)">
            <div style={{ height: 300, width: 300, border: `1px solid ${token.border.default}`, borderRadius: 12, overflow: "hidden" }}>
              <SidebarNav
                sections={[
                  {
                    title: "Servicios",
                    items: [
                      { label: "Inicio", icon: "home" },
                      { label: "Movimientos", icon: "transfer", active: true },
                      { label: "Transferencias", icon: "share" },
                    ],
                  },
                  {
                    title: "Administrá",
                    items: [
                      { label: "Mi comercio", icon: "settings" },
                      { label: "Cuentas", icon: "credit-card" },
                    ],
                  },
                ]}
              />
            </div>
          </SubCard>
          <CodeTabs snippets={snippets.sidebarnav} />
        </Card>

        <SectionHeading id="patterns" title="Patterns" subtitle="Ejemplos reales del DS en composición — los 21 componentes en features completas." />

        <Card id="pattern-login" title="Login screen" subtitle="TextField con iconos + CheckBox + ButtonStandard + Alerta + Separador. Tipá algo y dale Ingresar para ver el error state.">
          <SubCard>
            <LoginScreen />
          </SubCard>
        </Card>

        <Card id="pattern-transactions" title="Transactions list" subtitle="Tabla con sort + pagination + selection + formato de montos + StatusPill + icon de tipo. Menu contextual para acciones.">
          <SubCard>
            <TransactionsList />
          </SubCard>
        </Card>

        <Card id="pattern-settings" title="Settings panel" subtitle="Toggle agrupado con metadata + RadioButton group + CardInfo con ReactNodes + action buttons.">
          <SubCard>
            <SettingsPanel />
          </SubCard>
        </Card>

        <Card id="pattern-onboarding" title="Onboarding flow" subtitle="Progreso + Stepper + contenido dinámico por paso + Alerta + nav buttons. Hacé click Continuar para avanzar.">
          <SubCard>
            <OnboardingFlow />
          </SubCard>
        </Card>

        <div style={{ padding: "48px 0 96px", textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 12, color: "var(--pg-text-faint)" }}>
          TotalCoin DS Atelier · 21 componentes · 58 icons · 132 tokens · 4 patterns · dark mode · Generado desde Figma via MCP · Código inline styles, cero libs de UI.
        </div>
      </main>
    </div>
  );
}
