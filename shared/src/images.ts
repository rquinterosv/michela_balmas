import { z } from "zod";
import { validation } from "./validationMessages.it";

// Imágenes subidas desde el panel. Se guardan en Firestore (colección `images`),
// no en Firebase Storage, que exige el plan de pago. Un documento de Firestore
// admite como mucho 1 MiB, así que el panel reduce cada imagen antes de enviarla
// (ver client/src/admin/resizeImage.ts) y siempre la convierte a JPEG.
export const MAX_IMAGE_BYTES = 600_000;

// Dirección que se guarda en la página para una imagen subida: "/api/images/<id>".
// Es relativa al backend; el frontend la completa con imageSrc().
export const UPLOADED_IMAGE_PREFIX = "/api/images/";

// Lo que el panel envía al subir una imagen: el JPEG en base64.
export const imageUploadSchema = z.object({
  data: z
    .string(validation.invalidImageFile)
    .min(1, validation.invalidImageFile)
    // En base64 cada 3 bytes ocupan 4 caracteres.
    .max(Math.ceil(MAX_IMAGE_BYTES / 3) * 4, validation.imageTooLarge)
    .regex(/^[A-Za-z0-9+/]+={0,2}$/, validation.invalidImageFile),
});

export type ImageUpload = z.infer<typeof imageUploadSchema>;

// Una imagen ya subida, para elegirla de nuevo en el panel (GET /api/admin/images).
// Cada bloque guarda su propia dirección: elegir la misma imagen en dos sitios no
// los une, cambiar una no cambia la otra.
export interface UploadedImage {
  url: string;
  createdAt: string;
}
