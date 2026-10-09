import type { ReactNode } from "react";
import { it } from "../i18n/it";
import styles from "./Field.module.css";

interface FieldProps {
  // id del <input>/<select>/<textarea> que va dentro.
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

// Envoltorio de un campo de formulario: etiqueta, ayuda y mensaje de error.
// El control va como hijo y debe llevar el mismo `id` y
// `aria-describedby={describedBy(id, hint, error)}`:
//
//   <Field id="email" label="Email" error={errors.email}>
//     <input id="email" aria-invalid={Boolean(errors.email)}
//            aria-describedby={describedBy("email", undefined, errors.email)} />
//   </Field>
export function Field({ id, label, optional, hint, error, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> ({it.common.optional})</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

// ids de la ayuda y del error, para que el lector de pantalla los lea con el campo.
export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}
