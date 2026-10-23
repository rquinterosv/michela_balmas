import type { Message } from "@studio/shared";
import type { DecodedIdToken } from "firebase-admin/auth";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Los tests no tocan Firebase: el token y el repositorio son simulados.
vi.mock("../src/firebase", () => ({ db: {}, auth: { verifyIdToken: vi.fn() } }));
vi.mock("../src/repositories/messages", () => ({
  createMessage: vi.fn(),
  listMessages: vi.fn(),
  updateMessageStatus: vi.fn(),
  deleteMessage: vi.fn(),
}));
vi.mock("../src/repositories/settings", () => ({ getSettings: vi.fn() }));

import { createApp } from "../src/app";
import { auth } from "../src/firebase";
import { createMessage, listMessages, updateMessageStatus } from "../src/repositories/messages";
import { getSettings } from "../src/repositories/settings";

const message: Message = {
  id: "m1",
  name: "Maria Bianchi",
  email: "maria@esempio.it",
  phone: "",
  reason: "Sostegno alla persona",
  message: "Buongiorno, vorrei fissare un primo colloquio.",
  consent: true,
  consentAt: "2026-10-23T09:00:00.000Z",
  status: "nuovo",
  createdAt: "2026-10-23T09:00:00.000Z",
};

const asAdmin = (req: request.Test) => req.set("Authorization", "Bearer token-valido");

beforeEach(() => {
  vi.mocked(auth.verifyIdToken).mockReset();
  vi.mocked(auth.verifyIdToken).mockResolvedValue({ admin: true } as unknown as DecodedIdToken);
  vi.mocked(createMessage).mockReset();
  vi.mocked(listMessages).mockReset();
  vi.mocked(updateMessageStatus).mockReset();
  vi.mocked(getSettings).mockResolvedValue({
    contactReasons: ["Sostegno alla persona"],
  } as Awaited<ReturnType<typeof getSettings>>);
});

describe("messaggi nel panel", () => {
  it("lo que envía el formulario se guarda con los datos del visitante", async () => {
    vi.mocked(createMessage).mockResolvedValue(message);

    const response = await request(createApp()).post("/api/contact").send({
      name: message.name,
      email: message.email,
      phone: "",
      reason: message.reason,
      message: message.message,
      consent: true,
      website: "",
    });

    expect(response.status).toBe(201);
    expect(createMessage).toHaveBeenCalledWith({
      name: message.name,
      email: message.email,
      phone: "",
      reason: message.reason,
      message: message.message,
    });
  });

  it("el panel recibe la lista de mensajes", async () => {
    vi.mocked(listMessages).mockResolvedValue([message]);

    const response = await asAdmin(request(createApp()).get("/api/admin/messages"));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([message]);
    expect(listMessages).toHaveBeenCalledWith(undefined);
  });

  it("filtra por estado (el dashboard cuenta los nuevos)", async () => {
    vi.mocked(listMessages).mockResolvedValue([message]);

    const response = await asAdmin(request(createApp()).get("/api/admin/messages?status=nuovo"));

    expect(response.status).toBe(200);
    expect(listMessages).toHaveBeenCalledWith("nuovo");
  });

  it("los mensajes solo los ve un administrador", async () => {
    const response = await request(createApp()).get("/api/admin/messages");

    expect(response.status).toBe(401);
    expect(listMessages).not.toHaveBeenCalled();
  });

  it("cambia el estado de un mensaje", async () => {
    vi.mocked(updateMessageStatus).mockResolvedValue({ ...message, status: "letto" });

    const response = await asAdmin(
      request(createApp()).patch("/api/admin/messages/m1").send({ status: "letto" }),
    );

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("letto");
    expect(updateMessageStatus).toHaveBeenCalledWith("m1", "letto");
  });
});
