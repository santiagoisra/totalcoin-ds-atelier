import { useState } from "react";
import { TextField } from "../../components/TextField/TextField.tsx";
import { CheckBox } from "../../components/CheckBox/CheckBox.tsx";
import { ButtonStandard } from "../../components/ButtonStandard/ButtonStandard.tsx";
import { Separador } from "../../components/Separador/Separador.tsx";
import { Alerta } from "../../components/Alerta/Alerta.tsx";
import { Icon } from "../../components/Icon/Icon.tsx";
import { token } from "../../components/tokens.ts";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function submit() {
    setError(null);
    if (!email || !password) {
      setError("Completá todos los campos");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setError("Usuario o contraseña incorrectos");
    }, 900);
  }

  return (
    <div
      style={{
        width: 380,
        padding: 32,
        background: token.bg.button,
        border: `1px solid ${token.border.default}`,
        borderRadius: 16,
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 24 }}>
        <img src="/totalcoin-isologo.svg" alt="TotalCoin" width={56} height={56} />
        <h2 style={{ fontSize: 22, fontWeight: 700, color: token.text.primary, margin: "8px 0 0" }}>Iniciá sesión</h2>
        <p style={{ fontSize: 14, color: token.text.secondary, margin: 0 }}>En total-coin.com</p>
      </div>

      {error && (
        <div style={{ marginBottom: 16 }}>
          <Alerta color="error">{error}</Alerta>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        <TextField
          type="email"
          label="Email"
          placeholder="tu@email.com"
          leftIcon={<Icon name="mail" size={20} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          leftIcon={<Icon name="lock" size={20} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, cursor: "pointer" }}>
        <CheckBox checked={remember} onChange={setRemember} ariaLabel="Recordarme" />
        <span style={{ fontSize: 14, color: token.text.primary }}>Recordar mi sesión</span>
      </label>

      <ButtonStandard variant="primary" width="full" onClick={submit} disabled={loading}>
        {loading ? "Ingresando…" : "Ingresar"}
      </ButtonStandard>

      <Separador text="o" gap="md" />

      <ButtonStandard variant="outline" width="full" leftIcon={<Icon name="user" size={18} />}>
        Crear cuenta nueva
      </ButtonStandard>
    </div>
  );
}
