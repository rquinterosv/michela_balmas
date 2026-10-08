import type { Page, PageInput } from "@studio/shared";
import { Timestamp, type DocumentSnapshot } from "firebase-admin/firestore";
import { db } from "../firebase";

// Acceso a la colección "pages". Las consultas ordenan y filtran en memoria en vez
// de pedir índices compuestos a Firestore: el sitio tiene un puñado de páginas.

const pages = () => db.collection("pages");

function toPage(doc: DocumentSnapshot): Page {
  const data = doc.data() as PageInput & { updatedAt: Timestamp };
  return {
    ...data,
    id: doc.id,
    updatedAt: data.updatedAt.toDate().toISOString(),
  };
}

export async function listAllPages(): Promise<Page[]> {
  const snapshot = await pages().get();
  return snapshot.docs.map(toPage).sort((a, b) => a.order - b.order);
}

export async function listPublishedPages(): Promise<Page[]> {
  const all = await listAllPages();
  return all.filter((page) => page.published);
}

export async function getPageById(id: string): Promise<Page | null> {
  const doc = await pages().doc(id).get();
  return doc.exists ? toPage(doc) : null;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const snapshot = await pages().where("slug", "==", slug).limit(1).get();
  const doc = snapshot.docs[0];
  return doc ? toPage(doc) : null;
}

export async function createPage(input: PageInput): Promise<Page> {
  const ref = await pages().add({ ...input, updatedAt: Timestamp.now() });
  return toPage(await ref.get());
}

export async function updatePage(id: string, input: PageInput): Promise<Page> {
  const ref = pages().doc(id);
  await ref.set({ ...input, updatedAt: Timestamp.now() });
  return toPage(await ref.get());
}

export async function deletePage(id: string): Promise<void> {
  await pages().doc(id).delete();
}

// Guarda el nuevo orden: la posición en `ids` pasa a ser el campo `order`.
export async function reorderPages(ids: string[]): Promise<void> {
  const batch = db.batch();
  ids.forEach((id, index) => {
    batch.update(pages().doc(id), { order: index });
  });
  await batch.commit();
}
