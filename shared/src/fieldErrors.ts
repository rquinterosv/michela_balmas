import type { ZodError } from "zod";

// Convierte un error de zod en { "campo": "mensaje" }, que es como la API y los
// formularios manejan los errores. Los campos anidados usan punto:
// "seo.title", "blocks.0.data.title".
export function zodFieldErrors(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    // Si un campo tiene varios errores, se muestra solo el primero.
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields;
}
