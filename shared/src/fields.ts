import { z } from "zod";
import { validation } from "./validationMessages.it";

// Piezas reutilizables para armar los esquemas.

export const requiredText = (max: number) =>
  z.string().trim().min(1, validation.required).max(max, validation.tooLong(max));

export const optionalText = (max: number) => z.string().trim().max(max, validation.tooLong(max));

const isHttpUrl = (value: string) => /^https?:\/\/\S+$/.test(value);
// Ruta local: empieza con una sola barra ("/contatti", "/images/foto.jpg").
const isLocalPath = (value: string) => /^\/(?!\/)\S*$/.test(value);

// URL externa (https://…). Puede quedar vacía.
export const optionalUrl = optionalText(500).refine(
  (value) => value === "" || isHttpUrl(value),
  validation.invalidUrl,
);

// Imagen: URL externa o archivo de /client/public (p. ej. /images/foto.jpg). Puede quedar vacía.
// TODO: cuando se integre Firebase Storage o Cloudinary, este campo seguirá guardando
// la URL final de la imagen subida, así que el esquema no debería cambiar.
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
