import type { Post, PostInput } from "@studio/shared";
import { Timestamp, type DocumentSnapshot } from "firebase-admin/firestore";
import { db } from "../firebase";

// Acceso a la colección "posts" (artículos del blog). Como en "pages", se lee todo
// y se filtra en memoria: son pocas decenas de documentos.
//
// `date` es una fecha de calendario ("2026-10-15"): en Firestore se guarda como
// Timestamp a medianoche UTC, y aquí se convierte en los dos sentidos.

const posts = () => db.collection("posts");

type StoredPost = Omit<PostInput, "date"> & {
  date: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

function toPost(doc: DocumentSnapshot): Post {
  const data = doc.data() as StoredPost;
  return {
    ...data,
    id: doc.id,
    date: data.date.toDate().toISOString().slice(0, 10),
    createdAt: data.createdAt.toDate().toISOString(),
    updatedAt: data.updatedAt.toDate().toISOString(),
  };
}

function toStored(input: PostInput) {
  return { ...input, date: Timestamp.fromDate(new Date(`${input.date}T00:00:00Z`)) };
}

export async function listAllPosts(): Promise<Post[]> {
  const snapshot = await posts().get();
  return snapshot.docs.map(toPost);
}

export async function listPublishedPosts(): Promise<Post[]> {
  const all = await listAllPosts();
  return all.filter((post) => post.published);
}

export async function getPostById(id: string): Promise<Post | null> {
  const doc = await posts().doc(id).get();
  return doc.exists ? toPost(doc) : null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const snapshot = await posts().where("slug", "==", slug).limit(1).get();
  const doc = snapshot.docs[0];
  return doc ? toPost(doc) : null;
}

export async function createPost(input: PostInput): Promise<Post> {
  const now = Timestamp.now();
  const ref = await posts().add({ ...toStored(input), createdAt: now, updatedAt: now });
  return toPost(await ref.get());
}

export async function updatePost(id: string, input: PostInput): Promise<Post> {
  const ref = posts().doc(id);
  // `createdAt` se conserva: update() solo cambia los campos que recibe.
  await ref.update({ ...toStored(input), updatedAt: Timestamp.now() });
  return toPost(await ref.get());
}

export async function deletePost(id: string): Promise<void> {
  await posts().doc(id).delete();
}
