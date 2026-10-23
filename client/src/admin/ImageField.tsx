import { UPLOADED_IMAGE_PREFIX } from "@studio/shared";
import { useEffect, useLayoutEffect, useRef, useState, type ChangeEvent } from "react";
import { TextField } from "../components/TextField";
import { it } from "../i18n/it";
import { ApiRequestError } from "../lib/api";
import { imageSrc } from "../lib/images";
import styles from "./Admin.module.css";
import { adminApi } from "./adminApi";
import { ImagePicker } from "./ImagePicker";
import { resizeImage } from "./resizeImage";
import { useToast } from "./Toast";

interface ImageFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

// Campo de imagen: se sube una foto desde el ordenador (o el móvil), se elige una
// de las ya subidas o, si se prefiere, se pega la dirección de una imagen que está
// en otro sitio.
//
// La foto se reduce en el navegador y se guarda en Firestore a través del backend
// (ver shared/src/images.ts). El campo guarda siempre una dirección, así que los
// esquemas y los bloques no distinguen entre una imagen subida y una enlazada.
// Cada campo guarda la suya: cambiarla o quitarla no toca ningún otro bloque.
//
// La dirección interna de una imagen subida ("/api/images/<id>") no se muestra:
// el campo de texto es solo para imágenes de otros sitios.
export function ImageField({ id, label, value, onChange, error }: ImageFieldProps) {
  const labels = it.admin.blockEditors.image;
  const [uploading, setUploading] = useState(false);
  const [picking, setPicking] = useState(false);
  const showToast = useToast();

  const isUploaded = value.startsWith(UPLOADED_IMAGE_PREFIX);
  const [externalOpen, setExternalOpen] = useState(value !== "" && !isUploaded);

  // La subida tarda unos segundos. Al terminar hay que usar el onChange de ese
  // momento, no el de cuando empezó: el de entonces lleva dentro los datos de la
  // página de entonces y desharía lo cambiado mientras tanto (otra fila, otro
  // bloque, otra imagen que terminó de subirse antes).
  const latestOnChange = useRef(onChange);
  useLayoutEffect(() => {
    latestOnChange.current = onChange;
  });

  // Si el campo desaparece durante la subida (p. ej. se borra la fila), la imagen
  // subida no se asigna a nada.
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

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
      if (!mounted.current) return;
      latestOnChange.current(url);
      showToast(labels.uploaded);
    } catch (uploadError) {
      const message =
        uploadError instanceof ApiRequestError ? uploadError.message : labels.errorUpload;
      showToast(message, "error");
    } finally {
      if (mounted.current) setUploading(false);
    }
  }

  return (
    <fieldset className={styles.imageField}>
      <legend>{label}</legend>

      {/* Miniatura decorativa, para comprobar que la imagen es la correcta. */}
      {value && !error ? (
        <img className={styles.imagePreview} src={imageSrc(value)} alt="" />
      ) : (
        !value && <p className={styles.help}>{labels.empty}</p>
      )}

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
        <button
          type="button"
          className="button button-secondary"
          disabled={uploading}
          onClick={() => setPicking(true)}
        >
          {labels.choose}
        </button>
        {value && !uploading && (
          <button type="button" className={styles.textButtonDanger} onClick={() => onChange("")}>
            {labels.remove}
          </button>
        )}
      </div>

      {/* Abierto si ya hay una imagen de otro sitio o un error que corregir. */}
      <details
        className={styles.imageExternal}
        open={externalOpen || Boolean(error)}
        onToggle={(event) => setExternalOpen(event.currentTarget.open)}
      >
        <summary>{labels.external}</summary>
        <TextField
          id={id}
          label={labels.url}
          value={isUploaded ? "" : value}
          onChange={onChange}
          error={error}
          hint={labels.urlHelp}
          optional
        />
      </details>

      {picking && (
        <ImagePicker
          currentUrl={value}
          onSelect={(url) => {
            onChange(url);
            setPicking(false);
          }}
          onClose={() => setPicking(false)}
        />
      )}
    </fieldset>
  );
}
