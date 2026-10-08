import { contactSchema, validation } from "@studio/shared";
import { Router } from "express";
import { env } from "../env";
import { HttpError } from "../middleware/errorHandler";
import { messages } from "../messages.it";
import { createMessage } from "../repositories/messages";
import { getSettings } from "../repositories/settings";
import { notifyNewMessage } from "../services/notifyEmail";

// POST /api/contact (el rate limit se aplica en app.ts, antes de llegar aquí).
export const contactRouter = Router();

contactRouter.post("/", async (req, res) => {
  const input = contactSchema.parse(req.body);

  // Honeypot: si el campo oculto viene relleno es un bot. Se responde igual que a
  // un envío correcto para no darle pistas, pero no se guarda nada.
  if (input.website) {
    res.status(201).json({ ok: true });
    return;
  }

  // El motivo tiene que ser una de las opciones configuradas en el panel.
  const settings = await getSettings();
  if (!settings.contactReasons.includes(input.reason)) {
    throw new HttpError(400, messages.validation, { reason: validation.invalidReason });
  }

  const message = await createMessage({
    name: input.name,
    email: input.email,
    phone: input.phone,
    reason: input.reason,
    message: input.message,
  });

  // El aviso por email es opcional y no se espera: si falla, el mensaje ya está
  // guardado y el visitante recibe igualmente su confirmación.
  if (env.emailNotificationsEnabled) {
    notifyNewMessage(message).catch((error) => {
      console.error("No se pudo enviar el aviso por email:", error);
    });
  }

  res.status(201).json({ ok: true });
});
