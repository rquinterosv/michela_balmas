import type { Category, Page, Post, SiteSettings } from "@studio/shared";
import { seedSettings } from "@studio/shared/seedContent";
import type { DecodedIdToken } from "firebase-admin/auth";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Los tests no tocan Firebase: el token y los repositorios son simulados.
vi.mock("../src/firebase", () => ({ db: {}, auth: { verifyIdToken: vi.fn() } }));
vi.mock("../src/repositories/settings", () => ({ getSettings: vi.fn(), saveSettings: vi.fn() }));
vi.mock("../src/repositories/pages", () => ({ listPublishedPages: vi.fn() }));
vi.mock("../src/repositories/categories", () => ({ listCategories: vi.fn() }));
vi.mock("../src/repositories/posts", () => ({ listPublishedPosts: vi.fn() }));
vi.mock("../src/services/siteRebuild", () => ({ scheduleSiteRebuild: vi.fn() }));

import { createApp } from "../src/app";
import { auth } from "../src/firebase";
import { listCategories } from "../src/repositories/categories";
import { listPublishedPages } from "../src/repositories/pages";
import { listPublishedPosts } from "../src/repositories/posts";
import { getSettings, saveSettings } from "../src/repositories/settings";
import { scheduleSiteRebuild } from "../src/services/siteRebuild";

// Los repositorios simulados solo devuelven lo que se les da: basta con objetos
// reconocibles, no hace falta que estén completos.
const settings = { siteName: "Studio" } as SiteSettings;
const pages = [{ slug: "home" }] as Page[];
const categories = [{ slug: "articoli" }] as Category[];
const posts = [{ slug: "primo" }] as Post[];

beforeEach(() => {
  vi.mocked(auth.verifyIdToken).mockReset();
  vi.mocked(auth.verifyIdToken).mockResolvedValue({ admin: true } as unknown as DecodedIdToken);
  vi.mocked(getSettings).mockResolvedValue(settings);
  vi.mocked(saveSettings).mockReset();
  vi.mocked(listPublishedPages).mockResolvedValue(pages);
  vi.mocked(listCategories).mockResolvedValue(categories);
  vi.mocked(listPublishedPosts).mockResolvedValue(posts);
  vi.mocked(scheduleSiteRebuild).mockReset();
});

describe("GET /api/content", () => {
  it("devuelve todo el contenido publicado de una vez", async () => {
    const response = await request(createApp()).get("/api/content");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ settings, pages, categories, posts });
  });
});

describe("build del sitio tras un cambio en el panel", () => {
  const saveSettingsRequest = (body: object) =>
    request(createApp())
      .put("/api/admin/settings")
      .set("Authorization", "Bearer token-valido")
      .send(body);

  it("se programa cuando el cambio se guarda bien", async () => {
    vi.mocked(saveSettings).mockImplementation(async (saved) => saved);

    // Los datos del sitio del seed son válidos.
    const response = await saveSettingsRequest(seedSettings);

    expect(response.status).toBe(200);
    expect(scheduleSiteRebuild).toHaveBeenCalledTimes(1);
  });

  it("no se programa si el cambio no es válido", async () => {
    const response = await saveSettingsRequest({});

    expect(response.status).toBe(400);
    expect(scheduleSiteRebuild).not.toHaveBeenCalled();
  });

  it("no se programa al solo leer", async () => {
    const response = await request(createApp())
      .get("/api/admin/settings")
      .set("Authorization", "Bearer token-valido");

    expect(response.status).toBe(200);
    expect(scheduleSiteRebuild).not.toHaveBeenCalled();
  });
});

describe("GET /api/admin/status", () => {
  it("avisa si los cambios no se publican solos (sin DEPLOY_HOOK_URL)", async () => {
    const response = await request(createApp())
      .get("/api/admin/status")
      .set("Authorization", "Bearer token-valido");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ autoPublish: false });
  });

  it("exige un usuario administrador", async () => {
    const response = await request(createApp()).get("/api/admin/status");

    expect(response.status).toBe(401);
  });
});
