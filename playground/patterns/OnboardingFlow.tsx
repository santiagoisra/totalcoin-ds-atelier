import { useState } from "react";
import { Stepper } from "../../components/Stepper/Stepper.tsx";
import { Progreso } from "../../components/Progreso/Progreso.tsx";
import { Alerta } from "../../components/Alerta/Alerta.tsx";
import { ButtonStandard } from "../../components/ButtonStandard/ButtonStandard.tsx";
import { TextField } from "../../components/TextField/TextField.tsx";
import { CheckBox } from "../../components/CheckBox/CheckBox.tsx";
import { Icon } from "../../components/Icon/Icon.tsx";
import { token } from "../../components/tokens.ts";

const STEPS = [
  { title: "Datos personales", desc: "Nombre y CUIT" },
  { title: "Verificación", desc: "DNI y selfie" },
  { title: "Cuenta bancaria", desc: "CBU para transferencias" },
  { title: "Listo", desc: "Revisá tus datos" },
];

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const progress = ((step + 1) / STEPS.length) * 100;
  const current = STEPS[step];

  return (
    <div style={{ width: 500, display: "flex", flexDirection: "column", gap: 24, padding: 32, background: token.bg.button, border: `1px solid ${token.border.default}`, borderRadius: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "Nunito, sans-serif", fontSize: 13, color: token.text.secondary }}>
          <span>Paso {step + 1} de {STEPS.length}</span>
          <span style={{ fontWeight: 600, color: token.brand.primary }}>{Math.round(progress)}%</span>
        </div>
        <Progreso value={progress} />
        <Stepper steps={STEPS.length} current={step} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h2 style={{ fontFamily: "Nunito, sans-serif", fontSize: 22, fontWeight: 700, color: token.text.primary, margin: 0 }}>
          {current.title}
        </h2>
        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 14, color: token.text.secondary, margin: 0 }}>
          {current.desc}
        </p>
      </div>

      {step === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TextField label="Nombre completo" placeholder="Juan Pérez" />
          <TextField label="CUIT / CUIL" placeholder="20-12345678-9" />
        </div>
      )}

      {step === 1 && (
        <Alerta color="info" showLeftIcon={false} rightIcon={<Icon name="external-link" size={20} />}>
          Vamos a pedirte sacar una foto del DNI y una selfie con el documento. Tené el DNI a mano.
        </Alerta>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TextField label="CBU" placeholder="22 dígitos" leftIcon={<Icon name="credit-card" size={20} />} />
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
            <CheckBox checked ariaLabel="Acepto" />
            <span style={{ fontFamily: "Nunito, sans-serif", fontSize: 13, color: token.text.primary, lineHeight: 1.4 }}>
              Confirmo que el CBU está a nombre del mismo titular de esta cuenta.
            </span>
          </label>
        </div>
      )}

      {step === 3 && (
        <Alerta color="success">
          Todo listo. Revisá tus datos y confirmá para activar tu cuenta.
        </Alerta>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <ButtonStandard
          variant="outline"
          width="full"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          leftIcon={<Icon name="arrow-left" size={14} />}
        >
          Anterior
        </ButtonStandard>
        <ButtonStandard
          variant="primary"
          width="full"
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          rightIcon={step < STEPS.length - 1 ? <Icon name="arrow-right" size={14} /> : <Icon name="check" size={14} />}
        >
          {step === STEPS.length - 1 ? "Confirmar" : "Continuar"}
        </ButtonStandard>
      </div>
    </div>
  );
}
