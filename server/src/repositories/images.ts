import { Timestamp } from "firebase-admin/firestore";
import { db } from "../firebase";

const imagesCollection = () => db.collection("images");

// Cada imagen es un documento con los bytes del JPEG. Firestore admite 1 MiB por
// documento; el tamaño se limita antes de llegar aquí (MAX_IMAGE_BYTES).
interface StoredImage {
  data: Buffer;
  createdAt: Timestamp;
}

// Devuelve el id del documento creado.
export async function saveImage(data: Buffer): Promise<string> {
  const stored: StoredImage = { data, createdAt: Timestamp.now() };
  const ref = await imagesCollection().add(stored);
  return ref.id;
}

export async function getImage(id: string): Promise<Buffer | null> {
  const doc = await imagesCollection().doc(id).get();
  if (!doc.exists) return null;
  return (doc.data() as StoredImage).data;
}
