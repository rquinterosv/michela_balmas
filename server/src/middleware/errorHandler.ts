import type { ApiError } from "@studio/shared";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { messages } from "../messages.it";

// Error con código HTTP y mensaje en italiano listo para mostrar.
// Las rutas lo lanzan con `throw`; Express 5 lo trae hasta errorHandler,
// también desde funciones async.
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}

// Convierte los errores de zod en { "campo": "mensaje" }.
// Los campos anidados usan punto: "seo.title", "blocks.0.data.title".
function fieldErrors(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    // Si un campo tiene varios errores, se muestra solo el primero.
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields;
}

export function notFoundHandler(_req: Request, res: Response<ApiError>) {
  res.status(404).json({ error: messages.notFound });
}

// Tiene que declarar los 4 parámetros: así reconoce Express un manejador de errores.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response<ApiError>,
  _next: NextFunction,
) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, fields: err.fields });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: messages.validation, fields: fieldErrors(err) });
    return;
  }

  // express.json() falla así cuando el cuerpo no es JSON válido o es demasiado grande.
  if (err instanceof Error && "type" in err && String(err.type).startsWith("entity.")) {
    res.status(400).json({ error: messages.invalidRequest });
    return;
  }

  console.error(err);
  res.status(500).json({ error: messages.internal });
}
