import { useState } from "react";
import { Toggle } from "../../components/Toggle/Toggle.tsx";
import { RadioButton } from "../../components/RadioButton/RadioButton.tsx";
import { ButtonStandard } from "../../components/ButtonStandard/ButtonStandard.tsx";
import { Icon } from "../../components/Icon/Icon.tsx";
import { CardInfo } from "../../components/CardInfo/CardInfo.tsx";
import { token } from "../../components/tokens.ts";

export function SettingsPanel() {
  const [notifs, setNotifs] = useState({
    push: true,
    email: true,
    sms: false,
  });
  const [language, setLanguage] = useState<"es" | "en" | "pt">("es");
  const [biometric, setBiometric] = useState(true);

  return (
    <div style={{ width: 460, display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ fontFamily: "Nunito, sans-serif", fontSize: 22, fontWeight: 700, color: token.text.primary, margin: 0 }}>
        Configuración
      </h2>

      <section style={{ padding: 20, background: token.bg.button, border: `1px solid ${token.border.default}`, borderRadius: 12 }}>
        <h3 style={{ fontFamily: "Nunito, sans-serif", fontSize: 16, fontWeight: 600, color: token.text.primary, margin: "0 0 16px" }}>
          Notificaciones
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { key: "push", label: "Notificaciones push", desc: "Alertas en tu dispositivo", icon: "bell" },
            { key: "email", label: "Email", desc: "Resumen semanal + alertas críticas", icon: "mail" },
            { key: "sms", label: "SMS", desc: "Solo para confirmaciones de transacciones", icon: "phone" },
          ].map((row) => (
            <label key={row.key} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: token.bg.input, display: "flex", alignItems: "center", justifyContent: "center", color: token.icon.primary, flexShrink: 0 }}>
                <Icon name={row.icon as "bell" | "mail" | "phone"} size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Nunito, sans-serif", fontSize: 14, fontWeight: 600, color: token.text.primary }}>{row.label}</div>
                <div style={{ fontFamily: "Nunito, sans-serif", fontSize: 12, color: token.text.secondary }}>{row.desc}</div>
              </div>
              <Toggle
                checked={notifs[row.key as keyof typeof notifs]}
                onCheckedChange={(v) => setNotifs((n) => ({ ...n, [row.key]: v }))}
                ariaLabel={row.label}
              />
            </label>
          ))}
        </div>
      </section>

      <section style={{ padding: 20, background: token.bg.button, border: `1px solid ${token.border.default}`, borderRadius: 12 }}>
        <h3 style={{ fontFamily: "Nunito, sans-serif", fontSize: 16, fontWeight: 600, color: token.text.primary, margin: "0 0 16px" }}>
          Idioma
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { v: "es", label: "Español" },
            { v: "en", label: "English" },
            { v: "pt", label: "Português" },
          ].map((opt) => (
            <label key={opt.v} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "Nunito, sans-serif", fontSize: 14, color: token.text.primary }}>
              <RadioButton
                name="lang"
                value={opt.v}
                checked={language === opt.v}
                onChange={() => setLanguage(opt.v as "es" | "en" | "pt")}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </section>

      <CardInfo>
        <CardInfo.Row label="Biometría" value={<Toggle checked={biometric} onCheckedChange={setBiometric} ariaLabel="Biometría" />} />
        <CardInfo.Row label="Plan" value="Pro" />
        <CardInfo.Row label="Renovación" value="15/05/2026" />
      </CardInfo>

      <div style={{ display: "flex", gap: 10 }}>
        <ButtonStandard variant="outline" width="full">Cancelar</ButtonStandard>
        <ButtonStandard variant="primary" width="full" leftIcon={<Icon name="check" size={16} />}>Guardar cambios</ButtonStandard>
      </div>
    </div>
  );
}
