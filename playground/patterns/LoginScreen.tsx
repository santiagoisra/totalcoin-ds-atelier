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
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", fontFamily: "Nunito, sans-serif" }}>
      <img
        src="/logo-totalcoin.svg"
        alt="totalcoin"
        style={{ display: "block", height: 56, width: "auto", marginBottom: 40 }}
      />

      <div
        style={{
          width: 420,
          background: token.bg.button,
          border: `1px solid ${token.border.default}`,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          overflow: "hidden",
        }}
      >
        {/* Header con divisor */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${token.border.default}`,
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: token.brand.primary, margin: 0, letterSpacing: "-0.01em" }}>
            Iniciar sesión
          </h2>
        </div>

        <div style={{ padding: 28 }}>
          {error && (
            <div style={{ marginBottom: 16 }}>
              <Alerta color="error">{error}</Alerta>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 12 }}>
            <TextField
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    cursor: "pointer",
                    display: "inline-flex",
                    color: "inherit",
                  }}
                >
                  <Icon name={showPassword ? "eye-closed" : "eye"} size={20} />
                </button>
              }
            />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, cursor: "pointer" }}>
            <CheckBox checked={remember} onChange={setRemember} ariaLabel="Recordar mi usuario" />
            <span style={{ fontSize: 14, color: token.text.secondary }}>Recordar mi usuario</span>
          </label>

          <ButtonStandard variant="primary" width="full" onClick={submit} disabled={loading}>
            {loading ? "Cargando…" : "Siguiente"}
          </ButtonStandard>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: token.brand.primary,
                textDecoration: "none",
              }}
            >
              Olvidé mi contraseña
            </a>
          </div>

          <Separador text="¿No tenés cuenta?" gap="md" />

          <ButtonStandard variant="outline" width="full">
            Registrate
          </ButtonStandard>
        </div>
      </div>
    </div>
  );
}
