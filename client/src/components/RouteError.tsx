import { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import { it } from "../i18n/it";
import styles from "./PageStatus.module.css";

// Lo que se ve si una pantalla falla de forma inesperada (un error de programación,
// o el panel sin las variables VITE_FIREBASE_* configuradas). Sustituye a la
// pantalla de error en inglés que React Router muestra por defecto.
export function RouteError() {
  const error = useRouteError();

  // El detalle va a la consola, para quien mantiene el sitio.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.status} role="alert">
      <p>{it.common.error}</p>
      <button
        type="button"
        className="button button-secondary"
        onClick={() => window.location.reload()}
      >
        {it.common.retry}
      </button>
    </div>
  );
}
