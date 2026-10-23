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

// Las imágenes subidas, de la más reciente a la más antigua. Solo se lee la fecha:
// los bytes no hacen falta para la lista y pesan hasta 600 kB cada una.
export async function listImages(): Promise<{ id: string; createdAt: string }[]> {
  const snapshot = await imagesCollection().orderBy("createdAt", "desc").select("createdAt").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    createdAt: (doc.get("createdAt") as Timestamp).toDate().toISOString(),
  }));
}

export async function getImage(id: string): Promise<Buffer | null> {
  const doc = await imagesCollection().doc(id).get();
  if (!doc.exists) return null;
  return (doc.data() as StoredImage).data;
}
