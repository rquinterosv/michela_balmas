import { createHash } from "node:crypto";

// Huella (hash) de un contenido, independiente del orden de las claves: Firestore
// no garantiza devolver los campos en el orden en que se guardaron.
//
// La usa el seed para saber si una página sigue exactamente igual que una versión
// anterior del contenido inicial (nadie la ha editado) y puede actualizarse.
export function contentFingerprint(value: unknown): string {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
