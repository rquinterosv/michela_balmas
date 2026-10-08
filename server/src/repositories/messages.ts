import type { Message, MessageStatus } from "@studio/shared";
import { Timestamp, type DocumentSnapshot } from "firebase-admin/firestore";
import { db } from "../firebase";

const messagesCollection = () => db.collection("messages");

// Los datos del formulario que se guardan (sin el honeypot ni el checkbox).
export type NewMessage = Pick<Message, "name" | "email" | "phone" | "reason" | "message">;

type StoredMessage = Omit<Message, "id" | "createdAt" | "consentAt"> & {
  createdAt: Timestamp;
  consentAt: Timestamp;
};

function toMessage(doc: DocumentSnapshot): Message {
  const data = doc.data() as StoredMessage;
  return {
    ...data,
    id: doc.id,
    createdAt: data.createdAt.toDate().toISOString(),
    consentAt: data.consentAt.toDate().toISOString(),
  };
}

// Solo se llama después de validar que el consentimiento privacy está marcado.
export async function createMessage(input: NewMessage): Promise<Message> {
  const now = Timestamp.now();
  const stored: StoredMessage = {
    ...input,
    consent: true,
    consentAt: now,
    status: "nuovo",
    createdAt: now,
  };
  const ref = await messagesCollection().add(stored);
  return toMessage(await ref.get());
}

// Del más reciente al más antiguo. El filtro por estado se hace en memoria para no
// necesitar un índice compuesto (status + createdAt).
export async function listMessages(status?: MessageStatus): Promise<Message[]> {
  const snapshot = await messagesCollection().orderBy("createdAt", "desc").get();
  const all = snapshot.docs.map(toMessage);
  return status ? all.filter((message) => message.status === status) : all;
}

export async function updateMessageStatus(
  id: string,
  status: MessageStatus,
): Promise<Message | null> {
  const ref = messagesCollection().doc(id);
  if (!(await ref.get()).exists) return null;
  await ref.update({ status });
  return toMessage(await ref.get());
}

export async function deleteMessage(id: string): Promise<boolean> {
  const ref = messagesCollection().doc(id);
  if (!(await ref.get()).exists) return false;
  await ref.delete();
  return true;
}
