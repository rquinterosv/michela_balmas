import { it } from "../i18n/it";
import styles from "./PageStatus.module.css";

// Mensajes a pantalla completa mientras se cargan los datos o si la carga falla.

export function PageLoading() {
  return (
    <p className={styles.status} role="status">
      {it.common.loading}
    </p>
  );
}

export function PageError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className={styles.status} role="alert">
      <p>{message}</p>
      <button type="button" className="button button-secondary" onClick={onRetry}>
        {it.common.retry}
      </button>
    </div>
  );
}
