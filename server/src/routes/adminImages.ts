import {
  imageUploadSchema,
  MAX_IMAGE_BYTES,
  UPLOADED_IMAGE_PREFIX,
  validation,
  type UploadedImage,
} from "@studio/shared";
import { Router } from "express";
import { HttpError } from "../middleware/errorHandler";
import { listImages, saveImage } from "../repositories/images";

// /api/admin/images (protegido con requireAdmin en app.ts).
export const adminImagesRouter = Router();

// Todo archivo JPEG empieza por estos tres bytes.
const isJpeg = (data: Buffer) => data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;

// Las imágenes ya subidas, para volver a elegir una desde cualquier campo de imagen.
adminImagesRouter.get("/", async (_req, res) => {
  const images: UploadedImage[] = (await listImages()).map(({ id, createdAt }) => ({
    url: `${UPLOADED_IMAGE_PREFIX}${id}`,
    createdAt,
  }));
  res.json(images);
});

// Recibe un JPEG en base64 (el panel ya lo ha reducido) y devuelve la dirección
// que se guarda en la página: "/api/images/<id>".
adminImagesRouter.post("/", async (req, res) => {
  const { data } = imageUploadSchema.parse(req.body);
  const bytes = Buffer.from(data, "base64");

  if (!isJpeg(bytes)) throw new HttpError(400, validation.invalidImageFile);
  if (bytes.length > MAX_IMAGE_BYTES) throw new HttpError(400, validation.imageTooLarge);

  const id = await saveImage(bytes);
  res.status(201).json({ url: `${UPLOADED_IMAGE_PREFIX}${id}` });
});
