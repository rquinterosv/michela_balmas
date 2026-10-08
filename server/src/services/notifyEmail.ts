import type { Message } from "@studio/shared";
import { env } from "../env";
import { messages } from "../messages.it";

const dateFormat = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Rome",
});

// Avisa a la psicóloga por email de que hay un mensaje nuevo, usando la API HTTP de
// Resend (sin librería). Solo se llama si EMAIL_NOTIFICATIONS_ENABLED=true.
// Lanza un error si falla; quien llama decide qué hacer (la ruta de contacto solo
// lo registra: el mensaje ya quedó guardado).
export async function notifyNewMessage(message: Message): Promise<void> {
  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL_TO || !env.NOTIFY_EMAIL_FROM) {
    throw new Error(
      "Aviso por email activado pero faltan RESEND_API_KEY, NOTIFY_EMAIL_TO o NOTIFY_EMAIL_FROM.",
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.NOTIFY_EMAIL_FROM,
      to: [env.NOTIFY_EMAIL_TO],
      subject: messages.notificationEmail.subject,
      text: messages.notificationEmail.body({
        name: message.name,
        reason: message.reason,
        receivedAt: dateFormat.format(new Date(message.createdAt)),
        adminUrl: `${env.SITE_URL}/admin`,
      }),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend respondió ${response.status}: ${await response.text()}`);
  }
}
