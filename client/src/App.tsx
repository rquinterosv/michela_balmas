import { it } from "./i18n/it";

// Fase 1: solo comprueba que el monorepo arranca. Las rutas llegan en la fase 3.
export function App() {
  return (
    <main style={{ padding: "var(--space-8)" }}>
      <p>{it.common.loading}</p>
    </main>
  );
}
