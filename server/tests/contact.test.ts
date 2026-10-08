import type { Message, SiteSettings } from "@studio/shared";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Los tests no tocan Firebase: se sustituyen la inicialización y los repositorios.
vi.mock("../src/firebase", () => ({ db: {}, auth: {} }));
vi.mock("../src/repositories/messages", () => ({ createMessage: vi.fn() }));
vi.mock("../src/repositories/settings", () => ({ getSettings: vi.fn() }));

import { createApp } from "../src/app";
import { env } from "../src/env";
import { createMessage } from "../src/repositories/messages";
import { getSettings } from "../src/repositories/settings";

const validBody = {
  name: "Maria Bianchi",
  email: "maria@esempio.it",
  phone: "+39 333 123 4567",
  reason: "Primo colloquio conoscitivo",
  message: "Buongiorno, vorrei avere informazioni per un primo colloquio.",
  consent: true,
};

beforeEach(() => {
  vi.mocked(createMessage).mockReset();
  vi.mocked(createMessage).mockResolvedValue({ id: "m1" } as Message);
  vi.mocked(getSettings).mockResolvedValue({
    contactReasons: ["Primo colloquio conoscitivo", "Altro"],
  } as SiteSettings);
});

// Cada test crea su propia app para empezar con el rate limit a cero.
const post = (body: object) => request(createApp()).post("/api/contact").send(body);

describe("POST /api/contact", () => {
  it("guarda un mensaje válido", async () => {
    const response = await post({ ...validBody, name: "  Maria Bianchi  " });

    expect(response.status).toBe(201);
    expect(createMessage).toHaveBeenCalledWith({
      name: "Maria Bianchi", // sin espacios sobrantes
      email: validBody.email,
      phone: validBody.phone,
      reason: validBody.reason,
      message: validBody.message,
    });
  });

  it("acepta el teléfono vacío (es opcional)", async () => {
    const response = await post({ ...validBody, phone: "" });

    expect(response.status).toBe(201);
  });

  it("rechaza el envío sin consentimiento privacy, con el error en italiano", async () => {
    const response = await post({ ...validBody, consent: false });

    expect(response.status).toBe(400);
    expect(response.body.fields.consent).toBe(
      "Per inviare il messaggio è necessario acconsentire al trattamento dei dati",
    );
    expect(createMessage).not.toHaveBeenCalled();
  });

  it("devuelve un error por cada campo inválido", async () => {
    const response = await post({ ...validBody, name: "", email: "non-valida", message: "Ciao" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Alcuni dati non sono validi. Controllare i campi evidenziati.",
    );
    expect(response.body.fields).toEqual({
      name: "Campo obbligatorio",
      email: "Inserire un indirizzo email valido",
      message: "Inserire almeno 10 caratteri",
    });
    expect(createMessage).not.toHaveBeenCalled();
  });

  it("rechaza un motivo que no está entre los configurados", async () => {
    const response = await post({ ...validBody, reason: "Motivo inventato" });

    expect(response.status).toBe(400);
    expect(response.body.fields.reason).toBe("Selezionare un motivo del contatto");
    expect(createMessage).not.toHaveBeenCalled();
  });

  it("descarta en silencio los envíos con el honeypot relleno", async () => {
    const response = await post({ ...validBody, website: "http://spam.example" });

    expect(response.status).toBe(201); // el bot no nota la diferencia
    expect(createMessage).not.toHaveBeenCalled();
  });

  it("responde 400 si el cuerpo no es JSON válido", async () => {
    const response = await request(createApp())
      .post("/api/contact")
      .set("Content-Type", "application/json")
      .send("{esto no es json");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Richiesta non valida.");
  });

  it("aplica el rate limit por IP", async () => {
    const app = createApp();

    for (let i = 0; i < env.CONTACT_RATE_LIMIT_MAX; i++) {
      const response = await request(app).post("/api/contact").send(validBody);
      expect(response.status).toBe(201);
    }

    const blocked = await request(app).post("/api/contact").send(validBody);
    expect(blocked.status).toBe(429);
    expect(blocked.body.error).toBe(
      "Sono stati inviati troppi messaggi in poco tempo. Riprovare tra qualche minuto.",
    );
  });
});
