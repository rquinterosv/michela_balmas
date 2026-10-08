import type { DecodedIdToken } from "firebase-admin/auth";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Los tests no tocan Firebase: verifyIdToken y el repositorio son simulados.
vi.mock("../src/firebase", () => ({ db: {}, auth: { verifyIdToken: vi.fn() } }));
vi.mock("../src/repositories/messages", () => ({ listMessages: vi.fn() }));

import { createApp } from "../src/app";
import { auth } from "../src/firebase";
import { listMessages } from "../src/repositories/messages";

const verifyIdToken = vi.mocked(auth.verifyIdToken);

// Cualquier ruta bajo /api/admin sirve para probar el middleware.
const getMessages = () => request(createApp()).get("/api/admin/messages");

beforeEach(() => {
  verifyIdToken.mockReset();
  vi.mocked(listMessages).mockReset();
  vi.mocked(listMessages).mockResolvedValue([]);
});

describe("requireAdmin", () => {
  it("responde 401 si no hay cabecera Authorization", async () => {
    const response = await getMessages();

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Accesso non effettuato. Effettuare l'accesso e riprovare.");
    expect(verifyIdToken).not.toHaveBeenCalled();
  });

  it("responde 401 si la cabecera no es de tipo Bearer", async () => {
    const response = await getMessages().set("Authorization", "Basic abc123");

    expect(response.status).toBe(401);
    expect(verifyIdToken).not.toHaveBeenCalled();
  });

  it("responde 401 si el token no es válido o ha caducado", async () => {
    verifyIdToken.mockRejectedValue(new Error("auth/id-token-expired"));

    const response = await getMessages().set("Authorization", "Bearer token-caducado");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("La sessione è scaduta. Effettuare di nuovo l'accesso.");
    expect(listMessages).not.toHaveBeenCalled();
  });

  it("responde 403 si el usuario no tiene el claim admin", async () => {
    verifyIdToken.mockResolvedValue({ uid: "u1" } as DecodedIdToken);

    const response = await getMessages().set("Authorization", "Bearer token-valido");

    expect(response.status).toBe(403);
    expect(response.body.error).toBe(
      "Questo account non è autorizzato ad accedere all'area riservata.",
    );
    expect(listMessages).not.toHaveBeenCalled();
  });

  it("no acepta admin: 'true' (texto) como si fuera el claim", async () => {
    verifyIdToken.mockResolvedValue({ uid: "u1", admin: "true" } as unknown as DecodedIdToken);

    const response = await getMessages().set("Authorization", "Bearer token-valido");

    expect(response.status).toBe(403);
  });

  it("deja pasar a un usuario con admin: true", async () => {
    verifyIdToken.mockResolvedValue({ uid: "u1", admin: true } as unknown as DecodedIdToken);

    const response = await getMessages().set("Authorization", "Bearer token-valido");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(verifyIdToken).toHaveBeenCalledWith("token-valido");
  });

  it("protege todas las rutas de /api/admin, también las que no existen", async () => {
    const response = await request(createApp()).get("/api/admin/qualcosa");

    expect(response.status).toBe(401);
  });
});
