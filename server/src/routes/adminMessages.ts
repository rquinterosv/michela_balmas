import { MESSAGE_STATUSES, messageUpdateSchema } from "@studio/shared";
import { Router } from "express";
import { z } from "zod";
import { HttpError } from "../middleware/errorHandler";
import { messages } from "../messages.it";
import { deleteMessage, listMessages, updateMessageStatus } from "../repositories/messages";

// /api/admin/messages (protegido con requireAdmin en app.ts).
export const adminMessagesRouter = Router();

const listQuerySchema = z.object({
  status: z.enum(MESSAGE_STATUSES).optional(),
});

// ?status=nuovo filtra por estado (el dashboard lo usa para contar los nuevos).
adminMessagesRouter.get("/", async (req, res) => {
  const { status } = listQuerySchema.parse(req.query);
  res.json(await listMessages(status));
});

adminMessagesRouter.patch("/:id", async (req, res) => {
  const { status } = messageUpdateSchema.parse(req.body);
  const updated = await updateMessageStatus(req.params.id, status);
  if (!updated) throw new HttpError(404, messages.messageNotFound);
  res.json(updated);
});

adminMessagesRouter.delete("/:id", async (req, res) => {
  const deleted = await deleteMessage(req.params.id);
  if (!deleted) throw new HttpError(404, messages.messageNotFound);
  res.status(204).end();
});
