import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { useState, type FormEvent } from "react";
import { TextField } from "../components/TextField";
import { auth } from "../firebase";
import { it } from "../i18n/it";
import styles from "./Admin.module.css";

// Traduce los códigos de error de Firebase Auth a un mensaje en italiano.
function loginErrorMessage(error: unknown): string {
  const code = error instanceof FirebaseError ? error.code : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/invalid-email":
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/missing-password":
      return it.admin.login.wrongCredentials;
    case "auth/too-many-requests":
      return it.admin.login.tooManyAttempts;
    default:
      return it.admin.common.error;
  }
}

// Pantalla de acceso al panel. No hay registro: el usuario se crea desde la
// consola de Firebase o con `npm run set-admin`.
export function LoginPage() {
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      // Si sale bien, AuthContext detecta la sesión y el panel aparece solo.
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (loginError) {
      setError(loginErrorMessage(loginError));
      setBusy(false);
    }
  }

  async function handleReset(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch {
      // Se muestra el mismo mensaje exista o no la cuenta, para no revelar
      // qué direcciones tienen acceso al panel.
    }
    setResetSent(true);
    setBusy(false);
  }

  function switchMode(next: "login" | "reset") {
    setMode(next);
    setError("");
    setResetSent(false);
  }

  return (
    <main className={styles.centered}>
      <div className={styles.loginCard}>
        {mode === "login" ? (
          <form onSubmit={handleLogin} noValidate>
            <h1>{it.admin.login.title}</h1>
            <TextField
              id="login-email"
              type="email"
              label={it.admin.login.email}
              value={email}
              onChange={setEmail}
              autoComplete="username"
            />
            <TextField
              id="login-password"
              type="password"
              label={it.admin.login.password}
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
            {error && (
              <p role="alert" className={styles.formError}>
                {error}
              </p>
            )}
            <button type="submit" className="button" disabled={busy}>
              {busy ? it.admin.login.submitting : it.admin.login.submit}
            </button>
            <p>
              <button
                type="button"
                className={styles.textButton}
                onClick={() => switchMode("reset")}
              >
                {it.admin.login.forgotPassword}
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleReset} noValidate>
            <h1>{it.admin.login.resetTitle}</h1>
            <p>{it.admin.login.resetIntro}</p>
            <TextField
              id="reset-email"
              type="email"
              label={it.admin.login.email}
              value={email}
              onChange={setEmail}
              autoComplete="username"
            />
            {resetSent && (
              <p role="status" className={styles.formSuccess}>
                {it.admin.login.resetSent}
              </p>
            )}
            <button type="submit" className="button" disabled={busy || email.trim() === ""}>
              {it.admin.login.resetSubmit}
            </button>
            <p>
              <button
                type="button"
                className={styles.textButton}
                onClick={() => switchMode("login")}
              >
                {it.admin.login.backToLogin}
              </button>
            </p>
          </form>
        )}
        <p>
          <a href="/">{it.admin.login.backToSite}</a>
        </p>
      </div>
    </main>
  );
}
