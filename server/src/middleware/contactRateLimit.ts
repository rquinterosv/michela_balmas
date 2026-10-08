import type { ApiError } from "@studio/shared";
import { rateLimit } from "express-rate-limit";
import { env } from "../env";
import { messages } from "../messages.it";

// Límite de envíos del formulario de contacto por IP.
// Es una función para que cada app (y cada test) tenga su propio contador.
// El contador vive en memoria: se reinicia si el servidor se reinicia, suficiente
// para un sitio con una sola instancia.
export function createContactRateLimit() {
  const body: ApiError = { error: messages.tooManyRequests };

  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: env.CONTACT_RATE_LIMIT_MAX,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: body,
  });
}
