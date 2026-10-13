import { useState, type ChangeEvent } from "react";
import { TextField } from "../components/TextField";
import { it } from "../i18n/it";
import { ApiRequestError } from "../lib/api";
import { imageSrc } from "../lib/images";
import styles from "./Admin.module.css";
import { adminApi } from "./adminApi";
import { resizeImage } from "./resizeImage";
import { useToast } from "./Toast";

interface ImageFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

// Campo de imagen: se sube una foto desde el ordenador (o el móvil) o, si se
// prefiere, se pega la dirección de una imagen que ya está en internet.
//
// La foto se reduce en el navegador y se guarda en Firestore a través del backend
// (ver shared/src/images.ts). El campo guarda siempre una dirección, así que los
// esquemas y los bloques no distinguen entre una imagen subida y una enlazada.
export function ImageField({ id, label, value, onChange, error }: ImageFieldProps) {
  const labels = it.admin.blockEditors.image;
  const [uploading, setUploading] = useState(false);
  const showToast = useToast();

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Se vacía para que elegir otra vez el mismo archivo vuelva a lanzar el evento.
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      let data: string;
      try {
        data = await resizeImage(file);
      } catch {
        showToast(labels.errorNotImage, "error");
        return;
      }

      const { url } = await adminApi.uploadImage(data);
      onChange(url);
      showToast(labels.uploaded);
    } catch (uploadError) {
      const message =
        uploadError instanceof ApiRequestError ? uploadError.message : labels.errorUpload;
      showToast(message, "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <TextField
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        error={error}
        hint={labels.urlHelp}
        optional
      />

      <div className={styles.imageActions}>
        {/* El <input type="file"> va oculto dentro de la etiqueta, que hace de botón. */}
        <label className={`button button-secondary ${styles.uploadButton}`}>
          {uploading ? labels.uploading : value ? labels.replace : labels.upload}
          <input
            type="file"
            accept="image/*"
            className="visually-hidden"
            disabled={uploading}
            onChange={handleFile}
          />
        </label>
        {value && !uploading && (
          <button type="button" className={styles.textButtonDanger} onClick={() => onChange("")}>
            {labels.remove}
          </button>
        )}
      </div>

      {/* Miniatura decorativa, para comprobar que la imagen es la correcta. */}
      {value && !error && <img className={styles.imagePreview} src={imageSrc(value)} alt="" />}
    </>
  );
}
