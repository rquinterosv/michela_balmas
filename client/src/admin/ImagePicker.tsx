import { useEffect, useRef } from "react";
import { PageError } from "../components/PageStatus";
import { it } from "../i18n/it";
import { formatDateTime } from "../lib/format";
import { imageSrc } from "../lib/images";
import { useLoad } from "../lib/useLoad";
import styles from "./Admin.module.css";
import { adminApi } from "./adminApi";

interface ImagePickerProps {
  // Dirección de la imagen que el campo tiene ahora, para marcarla.
  currentUrl: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}

// Ventana para elegir una de las imágenes ya subidas. Se monta solo mientras está
// abierta, así la lista se pide de nuevo cada vez (incluye las recién subidas).
// Elegir una imagen solo cambia el campo que abrió la ventana.
export function ImagePicker({ currentUrl, onSelect, onClose }: ImagePickerProps) {
  const labels = it.admin.blockEditors.image;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { state, reload } = useLoad(() => adminApi.listImages(), []);

  // <dialog> nativo: atrapa el foco, se cierra con Esc y oscurece el fondo.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${styles.pickerDialog}`}
      aria-labelledby="image-picker-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <h2 id="image-picker-title">{labels.pickerTitle}</h2>
      <p className={styles.help}>{labels.pickerHelp}</p>

      {state.status === "loading" && <p>{it.admin.common.loading}</p>}
      {state.status === "error" && <PageError message={state.error.message} onRetry={reload} />}
      {state.status === "ready" && state.data.length === 0 && <p>{labels.pickerEmpty}</p>}
      {state.status === "ready" && state.data.length > 0 && (
        <ul className={styles.pickerGrid}>
          {state.data.map((image, index) => {
            const inUse = image.url === currentUrl;
            return (
              <li key={image.url}>
                <button
                  type="button"
                  className={styles.pickerOption}
                  aria-pressed={inUse}
                  onClick={() => onSelect(image.url)}
                >
                  <img src={imageSrc(image.url)} alt="" loading="lazy" />
                  <span>
                    {labels.pickOption(index + 1, formatDateTime(image.createdAt))}
                    {inUse && <strong className={styles.pickerInUse}>{labels.inUse}</strong>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className={styles.actions}>
        <button type="button" className="button button-secondary" onClick={onClose}>
          {it.admin.common.close}
        </button>
      </div>
    </dialog>
  );
}
