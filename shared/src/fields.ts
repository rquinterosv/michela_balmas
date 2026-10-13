import { z } from "zod";
import { validation } from "./validationMessages.it";

// Piezas reutilizables para armar los esquemas.
// z.string(mensaje): el mensaje sale si el campo falta o no es texto.

export const requiredText = (max: number) =>
  z
    .string(validation.required)
    .trim()
    .min(1, validation.required)
    .max(max, validation.tooLong(max));

export const optionalText = (max: number) =>
  z.string(validation.required).trim().max(max, validation.tooLong(max));

const isHttpUrl = (value: string) => /^https?:\/\/\S+$/.test(value);
// Ruta local: empieza con una sola barra ("/contatti", "/images/foto.jpg").
const isLocalPath = (value: string) => /^\/(?!\/)\S*$/.test(value);

// URL externa (https://…). Puede quedar vacía.
export const optionalUrl = optionalText(500).refine(
  (value) => value === "" || isHttpUrl(value),
  validation.invalidUrl,
);

// Imagen: URL externa, archivo de /client/public (p. ej. /images/foto.jpg) o imagen
// subida desde el panel ("/api/images/<id>", ver images.ts). Puede quedar vacía.
export const optionalImageUrl = optionalText(500).refine(
  (value) => value === "" || isHttpUrl(value) || isLocalPath(value),
  validation.invalidImageUrl,
);

// Enlace de un botón: ruta interna (/contatti) o URL externa. Puede quedar vacío.
export const optionalLink = optionalText(500).refine(
  (value) => value === "" || isHttpUrl(value) || isLocalPath(value),
  validation.invalidLink,
);

// HTML generado por el editor TipTap. El backend lo sanea antes de guardarlo.
export const richTextHtml = z.string().max(50_000, validation.tooLong(50_000));
