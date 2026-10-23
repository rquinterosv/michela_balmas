import type { Category, ContactInput, Page, Post } from "@studio/shared";
import { seedCategories, seedPages, seedPosts, seedSettings } from "@studio/shared/seedContent";
import { createStaticApi } from "./staticApi";

// Modo demo: el sitio público se ve sin backend ni Firebase. Responde a las mismas
// llamadas que `api` (ver api.ts) con el contenido de ejemplo del seed, que va
// incluido en el JavaScript. Sirve para enseñar el diseño antes de conectar nada.
// El formulario de contacto NO envía ni guarda nada, y el panel no está disponible.

const pages: Page[] = Object.entries(seedPages)
  .map(([id, page]) => ({ ...page, id, updatedAt: new Date(0).toISOString() }))
  .filter((page) => page.published)
  .sort((a, b) => a.order - b.order);

const categories: Category[] = Object.entries(seedCategories).map(([id, category]) => ({
  ...category,
  id,
}));

const posts: Post[] = Object.entries(seedPosts)
  .map(([id, post]) => {
    const timestamp = `${post.date}T00:00:00.000Z`;
    return { ...post, id, createdAt: timestamp, updatedAt: timestamp };
  })
  .filter((post) => post.published);

export const demoApi = {
  ...createStaticApi({ settings: seedSettings, pages }, async () => ({ categories, posts })),

  async sendContact(_input: ContactInput): Promise<{ ok: true }> {
    // Pequeña espera para que se vea el estado "Invio in corso…".
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ok: true };
  },
};
