import { TextField } from "../components/TextField";
import { it } from "../i18n/it";
import styles from "./Admin.module.css";

interface ImageFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

// Campo de imagen: por ahora se pega la dirección (URL) de la imagen, o la ruta de
// un archivo guardado en /client/public/images (p. ej. /images/foto.jpg).
//
// TODO (subida de imágenes): este es el lugar para integrar Firebase Storage o
// Cloudinary. Bastaría añadir aquí un botón "Carica immagine" que suba el archivo
// y llame a onChange con la URL resultante; el resto del sistema (esquemas, API,
// bloques) ya trabaja con URLs y no cambiaría. Firebase Storage requiere plan Blaze.
export function ImageField({ id, label, value, onChange, error }: ImageFieldProps) {
  return (
    <>
      <TextField
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        error={error}
        hint={it.admin.blockEditors.image.urlHelp}
        optional
      />
      {/* Miniatura decorativa, para comprobar que la dirección es correcta. */}
      {value && !error && <img className={styles.imagePreview} src={value} alt="" />}
    </>
  );
}
