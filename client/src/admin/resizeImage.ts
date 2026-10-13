import { MAX_IMAGE_BYTES } from "@studio/shared";

// Prepara una foto para subirla: la reduce y la convierte a JPEG hasta que quepa en
// MAX_IMAGE_BYTES. Una foto de móvil pesa varios MB; para una web basta con mucho
// menos, y así cabe en un documento de Firestore.
//
// Devuelve el JPEG en base64. Lanza un error si el archivo no es una imagen que el
// navegador sepa leer (p. ej. HEIC de iPhone en algunos navegadores).

// Combinaciones de lado mayor (px) y calidad, de mejor a peor: se usa la primera
// que quepa.
const ATTEMPTS = [
  { maxSide: 1600, quality: 0.85 },
  { maxSide: 1600, quality: 0.7 },
  { maxSide: 1200, quality: 0.8 },
  { maxSide: 1200, quality: 0.65 },
  { maxSide: 900, quality: 0.7 },
  { maxSide: 700, quality: 0.6 },
];

export async function resizeImage(file: File): Promise<string> {
  // createImageBitmap respeta la orientación que guarda la cámara (EXIF).
  const bitmap = await createImageBitmap(file);

  try {
    for (const { maxSide, quality } of ATTEMPTS) {
      const blob = await drawAsJpeg(bitmap, maxSide, quality);
      if (blob.size <= MAX_IMAGE_BYTES) return await toBase64(blob);
    }
  } finally {
    bitmap.close();
  }

  throw new Error("La imagen no cabe ni con la calidad más baja.");
}

function drawAsJpeg(bitmap: ImageBitmap, maxSide: number, quality: number): Promise<Blob> {
  // Nunca se agranda: si la imagen ya es pequeña, se deja en su tamaño.
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("El navegador no permite dibujar la imagen.");

  // JPEG no tiene transparencia: las zonas transparentes de un PNG quedan blancas.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo crear el JPEG."))),
      "image/jpeg",
      quality,
    );
  });
}

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.onload = () => {
      // El resultado es "data:image/jpeg;base64,<datos>": interesa lo de después de la coma.
      const dataUrl = reader.result as string;
      resolve(dataUrl.slice(dataUrl.indexOf(",") + 1));
    };
    reader.readAsDataURL(blob);
  });
}
