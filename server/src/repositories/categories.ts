import type { Category, CategoryInput } from "@studio/shared";
import type { DocumentSnapshot } from "firebase-admin/firestore";
import { db } from "../firebase";

// Acceso a la colección "categories" (categorías del blog).

const categories = () => db.collection("categories");

function toCategory(doc: DocumentSnapshot): Category {
  return { ...(doc.data() as CategoryInput), id: doc.id };
}

export async function listCategories(): Promise<Category[]> {
  const snapshot = await categories().get();
  return snapshot.docs.map(toCategory);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const doc = await categories().doc(id).get();
  return doc.exists ? toCategory(doc) : null;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const ref = await categories().add(input);
  return toCategory(await ref.get());
}

export async function updateCategory(id: string, input: CategoryInput): Promise<Category> {
  const ref = categories().doc(id);
  await ref.set(input);
  return toCategory(await ref.get());
}

export async function deleteCategory(id: string): Promise<void> {
  await categories().doc(id).delete();
}

// Guarda el nuevo orden: la posición en `ids` pasa a ser el campo `order`.
export async function reorderCategories(ids: string[]): Promise<void> {
  const batch = db.batch();
  ids.forEach((id, index) => {
    batch.update(categories().doc(id), { order: index });
  });
  await batch.commit();
}
