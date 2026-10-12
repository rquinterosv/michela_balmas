import { useEffect, useRef } from "react";
import { it } from "../i18n/it";
import styles from "./Admin.module.css";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Pide confirmación antes de una acción que no se puede deshacer (eliminar).
// Usa el <dialog> nativo: atrapa el foco, se cierra con Esc y oscurece el fondo.
export function ConfirmDialog(props: ConfirmDialogProps) {
  const { open, title, text, confirmLabel, onConfirm, onCancel } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="confirm-dialog-title"
      // Esc: se trata como "Annulla" para que el estado de React no se desincronice.
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <h2 id="confirm-dialog-title">{title}</h2>
      <p>{text}</p>
      <div className={styles.actions}>
        {/* "Annulla" va primero y recibe el foco: la opción segura por defecto. */}
        <button type="button" className="button button-secondary" onClick={onCancel}>
          {it.admin.common.cancel}
        </button>
        <button type="button" className={`button ${styles.dangerButton}`} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
