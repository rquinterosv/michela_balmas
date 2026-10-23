import { MAX_IMAGE_BYTES } from "@studio/shared";
import type { DecodedIdToken } from "firebase-admin/auth";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Los tests no tocan Firebase: verifyIdToken y el repositorio son simulados.
vi.mock("../src/firebase", () => ({ db: {}, auth: { verifyIdToken: vi.fn() } }));
vi.mock("../src/repositories/images", () => ({
  saveImage: vi.fn(),
  getImage: vi.fn(),
  listImages: vi.fn(),
}));

import { createApp } from "../src/app";
import { auth } from "../src/firebase";
import { getImage, listImages, saveImage } from "../src/repositories/images";

// Un "JPEG" mínimo: los tres bytes con los que empieza todo JPEG y relleno.
const jpeg = (size: number) => Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.alloc(size)]);

const upload = (data: string) =>
  request(createApp())
    .post("/api/admin/images")
    .set("Authorization", "Bearer token-valido")
    .send({ data });

beforeEach(() => {
  vi.mocked(auth.verifyIdToken).mockReset();
  vi.mocked(auth.verifyIdToken).mockResolvedValue({ admin: true } as unknown as DecodedIdToken);
  vi.mocked(saveImage).mockReset();
  vi.mocked(saveImage).mockResolvedValue("img1");
  vi.mocked(getImage).mockReset();
  vi.mocked(listImages).mockReset();
});

describe("GET /api/admin/images", () => {
  it("devuelve las imágenes subidas con su dirección, sin los bytes", async () => {
    vi.mocked(listImages).mockResolvedValue([
      { id: "img2", createdAt: "2026-10-23T09:00:00.000Z" },
      { id: "img1", createdAt: "2026-10-20T09:00:00.000Z" },
    ]);

    const response = await request(createApp())
      .get("/api/admin/images")
      .set("Authorization", "Bearer token-valido");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { url: "/api/images/img2", createdAt: "2026-10-23T09:00:00.000Z" },
      { url: "/api/images/img1", createdAt: "2026-10-20T09:00:00.000Z" },
    ]);
  });

  it("exige un usuario administrador", async () => {
    const response = await request(createApp()).get("/api/admin/images");

    expect(response.status).toBe(401);
    expect(listImages).not.toHaveBeenCalled();
  });
});

describe("POST /api/admin/images", () => {
  it("guarda un JPEG y devuelve su dirección", async () => {
    const image = jpeg(5_000);

    const response = await upload(image.toString("base64"));

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ url: "/api/images/img1" });
    expect(vi.mocked(saveImage).mock.calls[0]?.[0].equals(image)).toBe(true);
  });

  it("acepta una imagen del tamaño máximo (más grande que el límite general de 200 kB)", async () => {
    const response = await upload(jpeg(MAX_IMAGE_BYTES - 3).toString("base64"));

    expect(response.status).toBe(201);
  });

  it("exige un usuario administrador", async () => {
    const response = await request(createApp())
      .post("/api/admin/images")
      .send({ data: jpeg(10).toString("base64") });

    expect(response.status).toBe(401);
    expect(saveImage).not.toHaveBeenCalled();
  });

  it("rechaza un archivo que no es un JPEG", async () => {
    const response = await upload(Buffer.from("<script>alert(1)</script>").toString("base64"));

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Il file scelto non è un'immagine valida");
    expect(saveImage).not.toHaveBeenCalled();
  });

  it("rechaza datos que no son base64", async () => {
    const response = await upload("esto no es base64!");

    expect(response.status).toBe(400);
    expect(saveImage).not.toHaveBeenCalled();
  });

  it("rechaza una imagen más grande que el máximo", async () => {
    const response = await upload(jpeg(MAX_IMAGE_BYTES + 10).toString("base64"));

    expect(response.status).toBe(400);
    expect(saveImage).not.toHaveBeenCalled();
  });
});

describe("GET /api/images/:id", () => {
  it("devuelve la imagen, cacheable y utilizable desde otro dominio", async () => {
    const image = jpeg(100);
    vi.mocked(getImage).mockResolvedValue(image);

    const response = await request(createApp()).get("/api/images/img1");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("image/jpeg");
    expect(response.headers["cache-control"]).toContain("immutable");
    expect(response.headers["cross-origin-resource-policy"]).toBe("cross-origin");
    expect(Buffer.from(response.body).equals(image)).toBe(true);
    expect(getImage).toHaveBeenCalledWith("img1");
  });

  it("responde 404 si la imagen no existe", async () => {
    vi.mocked(getImage).mockResolvedValue(null);

    const response = await request(createApp()).get("/api/images/no-existe");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Immagine non trovata.");
  });
});
