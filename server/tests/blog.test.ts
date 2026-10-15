import {
  categoriesWithCounts,
  paginatePosts,
  postInputSchema,
  relatedPosts,
  youtubeVideoId,
  type Category,
  type Page,
  type Post,
} from "@studio/shared";
import type { DecodedIdToken } from "firebase-admin/auth";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Los tests no tocan Firebase: el token y los repositorios son simulados.
vi.mock("../src/firebase", () => ({ db: {}, auth: { verifyIdToken: vi.fn() } }));
vi.mock("../src/repositories/posts", () => ({
  listAllPosts: vi.fn(),
  listPublishedPosts: vi.fn(),
}));
vi.mock("../src/repositories/categories", () => ({
  listCategories: vi.fn(),
  getCategoryById: vi.fn(),
  deleteCategory: vi.fn(),
}));
vi.mock("../src/repositories/pages", () => ({ listPublishedPages: vi.fn() }));

import { createApp } from "../src/app";
import { auth } from "../src/firebase";
import { deleteCategory, getCategoryById, listCategories } from "../src/repositories/categories";
import { listPublishedPages } from "../src/repositories/pages";
import { listAllPosts, listPublishedPosts } from "../src/repositories/posts";

// --- Datos de prueba ---

const category = (id: string, parentId: string | null, order: number): Category => ({
  id,
  name: id,
  slug: id,
  parentId,
  order,
  seo: { title: "", description: "" },
});

// "interviste" con la hija "radio", y "articoli" sin artículos.
const categories = [
  category("articoli", null, 2),
  category("radio", "interviste", 1),
  category("interviste", null, 0),
];

const post = (slug: string, categoryId: string, date: string, published = true): Post => ({
  id: slug,
  slug,
  title: slug,
  categoryId,
  date,
  excerpt: "Estratto",
  cover: { type: "none", imageUrl: "", imageAlt: "", videoUrl: "" },
  author: { name: "", photoUrl: "" },
  blocks: [],
  published,
  seo: { title: "", description: "", imageUrl: "" },
  createdAt: `${date}T10:00:00.000Z`,
  updatedAt: `${date}T10:00:00.000Z`,
});

const published = [
  post("a", "interviste", "2026-01-01"),
  post("b", "radio", "2026-03-01"),
  post("c", "radio", "2026-02-01"),
  post("d", "interviste", "2026-05-01"),
  post("e", "interviste", "2026-04-01"),
];
const draft = post("bozza", "articoli", "2026-06-01", false);

// --- Consultas (shared/src/blog.ts) ---

describe("categoriesWithCounts", () => {
  it("cuenta en la categoría principal también los artículos de sus hijas y oculta las vacías", () => {
    const result = categoriesWithCounts(categories, published);

    expect(result.map((c) => [c.id, c.count])).toEqual([
      ["interviste", 5],
      ["radio", 2],
    ]);
  });
});

describe("paginatePosts", () => {
  it("ordena del más reciente al más antiguo, de 4 en 4", () => {
    const first = paginatePosts(published, categories, { page: 1 });
    const second = paginatePosts(published, categories, { page: 2 });

    expect(first.posts.map((p) => p.slug)).toEqual(["d", "e", "b", "c"]);
    expect(second.posts.map((p) => p.slug)).toEqual(["a"]);
    expect(first.total).toBe(5);
  });

  it("al filtrar por una categoría incluye sus hijas", () => {
    const result = paginatePosts(published, categories, { categoryId: "radio", page: 1 });

    expect(result.posts.map((p) => p.slug)).toEqual(["b", "c"]);
  });
});

describe("relatedPosts", () => {
  it("prefiere la misma categoría y completa con la familia, sin repetir el artículo", () => {
    const current = published[1] as Post; // "b", de radio

    expect(relatedPosts(current, published, categories).map((p) => p.slug)).toEqual([
      "c",
      "d",
      "e",
    ]);
  });
});

describe("youtubeVideoId", () => {
  it.each([
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["https://youtube.com/watch?feature=share&v=dQw4w9WgXcQ&t=5", "dQw4w9WgXcQ"],
    ["https://youtu.be/dQw4w9WgXcQ?t=10", "dQw4w9WgXcQ"],
    ["https://www.youtube.com/shorts/dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ", "dQw4w9WgXcQ"],
  ])("reconoce %s", (url, id) => {
    expect(youtubeVideoId(url)).toBe(id);
  });

  it.each(["https://open.spotify.com/episode/123", "https://www.youtube.com/watch?v=corto"])(
    "no reconoce %s",
    (url) => {
      expect(youtubeVideoId(url)).toBeNull();
    },
  );
});

describe("postInputSchema", () => {
  const {
    id: _id,
    createdAt: _c,
    updatedAt: _u,
    ...valid
  } = post("valido", "articoli", "2026-01-01");

  it("acepta un artículo válido", () => {
    expect(postInputSchema.safeParse(valid).success).toBe(true);
  });

  it("rechaza la dirección reservada «categoria» y fechas imposibles", () => {
    expect(postInputSchema.safeParse({ ...valid, slug: "categoria" }).success).toBe(false);
    expect(postInputSchema.safeParse({ ...valid, date: "2026-02-31" }).success).toBe(false);
  });

  it("exige la imagen si la copertina es una imagen", () => {
    const cover = { ...valid.cover, type: "image" as const };
    expect(postInputSchema.safeParse({ ...valid, cover }).success).toBe(false);
  });

  it("no admite secciones que no son para artículos", () => {
    const hero = {
      id: "h",
      type: "hero" as const,
      data: {
        title: "T",
        subtitle: "",
        imageUrl: "",
        imageAlt: "",
        buttonLabel: "",
        buttonHref: "",
      },
    };
    expect(postInputSchema.safeParse({ ...valid, blocks: [hero] }).success).toBe(false);
  });
});

// --- Rutas ---

beforeEach(() => {
  vi.mocked(auth.verifyIdToken).mockReset();
  vi.mocked(auth.verifyIdToken).mockResolvedValue({ admin: true } as unknown as DecodedIdToken);
  vi.mocked(listCategories).mockResolvedValue(categories);
  vi.mocked(listPublishedPosts).mockResolvedValue(published);
  vi.mocked(listAllPosts).mockResolvedValue([...published, draft]);
  vi.mocked(getCategoryById).mockImplementation(
    async (id) => categories.find((c) => c.id === id) ?? null,
  );
  vi.mocked(deleteCategory).mockReset();
});

describe("API pública del blog", () => {
  it("lista solo artículos publicados, filtrados por categoría", async () => {
    const response = await request(createApp()).get("/api/blog/posts?categoria=radio");

    expect(response.status).toBe(200);
    expect(response.body.posts.map((p: Post) => p.slug)).toEqual(["b", "c"]);
  });

  it("responde 404 con una categoría que no existe", async () => {
    const response = await request(createApp()).get("/api/blog/posts?categoria=nessuna");

    expect(response.status).toBe(404);
  });

  it("un borrador responde igual que un artículo que no existe", async () => {
    const response = await request(createApp()).get("/api/blog/posts/bozza");

    expect(response.status).toBe(404);
  });
});

describe("categorías en el panel", () => {
  const remove = (id: string) =>
    request(createApp())
      .delete(`/api/admin/categories/${id}`)
      .set("Authorization", "Bearer token-valido");

  it("no elimina una categoría con artículos, aunque sean borradores", async () => {
    const response = await remove("articoli");

    expect(response.status).toBe(409);
    expect(deleteCategory).not.toHaveBeenCalled();
  });

  it("no elimina una categoría con subcategorías", async () => {
    const response = await remove("interviste");

    expect(response.status).toBe(409);
    expect(deleteCategory).not.toHaveBeenCalled();
  });
});

describe("GET /sitemap.xml", () => {
  const page = (slug: string): Page => ({
    id: slug,
    slug,
    title: slug,
    order: 0,
    published: true,
    showInMenu: true,
    seo: { title: "", description: "" },
    blocks: [],
    updatedAt: "2026-01-01T00:00:00.000Z",
  });

  it("incluye los artículos y las categorías si el blog está publicado", async () => {
    vi.mocked(listPublishedPages).mockResolvedValue([page("home"), page("blog")]);

    const response = await request(createApp()).get("/sitemap.xml");

    expect(response.status).toBe(200);
    expect(response.type).toBe("application/xml");
    expect(response.text).toContain("/blog/d</loc>");
    expect(response.text).toContain("/blog/categoria/radio</loc>");
    expect(response.text).not.toContain("/blog/bozza");
  });

  it("no incluye el blog si su página no está publicada", async () => {
    vi.mocked(listPublishedPages).mockResolvedValue([page("home")]);

    const response = await request(createApp()).get("/sitemap.xml");

    expect(response.text).not.toContain("/blog");
  });
});
