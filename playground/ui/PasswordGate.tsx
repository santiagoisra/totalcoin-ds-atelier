import { useEffect, useState, type FormEvent, type ReactNode } from "react";

/**
 * Client-side password gate para el Atelier.
 *
 * NO es cripto-grade. El hash SHA-256 se embebe en el bundle — si alguien
 * inspecciona el JS, ve el hash y puede brute-force para encontrar el password.
 * Para nuestro caso (DS interno sin data sensible) es un deterrent razonable.
 *
 * Si el team TotalCoin eventualmente upgradea el plan de Vercel a Pro, se
 * remueve este gate y se usa el password protection nativo de Vercel.
 *
 * Config:
 *   VITE_ATELIER_PASSWORD_HASH — SHA-256 hex del password valido
 *   (default al hash de "totalcoin" para dev local — OVERRIDE en prod)
 */

const STORAGE_KEY = "totalcoin-atelier-auth";
const SESSION_DAYS = 30;

// Hash de "totalcoin2026atelier" (default shared password para devs).
// Override en Vercel con VITE_ATELIER_PASSWORD_HASH para cambiarlo sin touch el codigo.
const DEFAULT_HASH = "1a6a7f3cb3186d743683506d4beb2507f1502f9fc96bfb8c02a5c2820b32a7f9";

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function loadSession(): { expiresAt: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { expiresAt: number };
    if (typeof parsed.expiresAt !== "number" || parsed.expiresAt < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveSession() {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ expiresAt }));
  } catch {}
}

export function PasswordGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthed(!!loadSession());
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const target = (import.meta.env?.VITE_ATELIER_PASSWORD_HASH as string | undefined) ?? DEFAULT_HASH;
      const inputHash = await sha256(password);
      if (inputHash === target) {
        saveSession();
        setAuthed(true);
      } else {
        setError("Contraseña incorrecta");
      }
    } catch {
      setError("Error al validar — probá de nuevo");
    } finally {
      setLoading(false);
    }
  }

  if (authed === null) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Inter, sans-serif", color: "#64748b" }}>
        Cargando…
      </div>
    );
  }

  if (authed) return <>{children}</>;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 24,
        background: "linear-gradient(180deg, #0b1220 0%, #002c50 100%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 36,
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 16,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
          color: "#f1f5f9",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <img src="/totalcoin-isologo.svg" alt="TotalCoin" width={48} height={48} style={{ filter: "brightness(0) invert(1)" }} />
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
            TotalCoin DS · Atelier
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", textAlign: "center", lineHeight: 1.5 }}>
            Acceso privado. Ingresá la contraseña del equipo para continuar.
          </p>
        </div>

        <label
          htmlFor="atelier-password"
          style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#cbd5e1", marginBottom: 6 }}
        >
          Contraseña
        </label>
        <input
          id="atelier-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          autoComplete="current-password"
          placeholder="••••••••"
          style={{
            display: "block",
            width: "100%",
            height: 44,
            padding: "0 14px",
            background: "rgba(255, 255, 255, 0.08)",
            border: `1px solid ${error ? "#ef4444" : "rgba(255, 255, 255, 0.14)"}`,
            borderRadius: 10,
            fontFamily: "inherit",
            fontSize: 14,
            color: "#fff",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 160ms ease",
          }}
        />
        {error && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#fca5a5" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || password.length === 0}
          style={{
            display: "block",
            width: "100%",
            height: 44,
            marginTop: 20,
            background: loading ? "rgba(255, 255, 255, 0.2)" : "#fff",
            color: "#0b1220",
            border: "none",
            borderRadius: 10,
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 600,
            cursor: loading || password.length === 0 ? "not-allowed" : "pointer",
            opacity: loading || password.length === 0 ? 0.5 : 1,
            transition: "opacity 160ms ease, transform 160ms ease",
          }}
        >
          {loading ? "Validando…" : "Ingresar"}
        </button>

        <p style={{ margin: "24px 0 0", fontSize: 11, color: "#64748b", textAlign: "center", lineHeight: 1.5 }}>
          Esta sesión se guarda por 30 días en tu navegador.
          <br />
          Si necesitás la contraseña, pedila en el canal <strong>#design-system</strong>.
        </p>
      </form>
    </div>
  );
}
