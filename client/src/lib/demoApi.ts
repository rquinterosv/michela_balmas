import type { ContactInput, MenuPage, Page, SiteSettings } from "@studio/shared";
import { seedPages, seedSettings } from "@studio/shared/seedContent";
import { it } from "../i18n/it";
import { ApiRequestError } from "./api";

// Modo demo: el sitio público se ve sin backend ni Firebase. Responde a las mismas
// llamadas que `api` (ver api.ts) con el contenido de ejemplo del seed, que va
// incluido en el JavaScript. Sirve para enseñar el diseño antes de conectar nada.
// El formulario de contacto NO envía ni guarda nada, y el panel no está disponible.

const pages: Page[] = Object.entries(seedPages)
  .map(([id, page]) => ({ ...page, id, updatedAt: new Date(0).toISOString() }))
  .filter((page) => page.published)
  .sort((a, b) => a.order - b.order);

export const demoApi = {
  async getMenuPages(): Promise<MenuPage[]> {
    return pages.map(({ title, slug, order, showInMenu }) => ({ title, slug, order, showInMenu }));
  },

  async getPage(slug: string): Promise<Page> {
    const page = pages.find((candidate) => candidate.slug === slug);
    if (!page) throw new ApiRequestError(404, it.notFound.title);
    return page;
  },

  async getSettings(): Promise<SiteSettings> {
    return seedSettings;
  },

  async sendContact(_input: ContactInput): Promise<{ ok: true }> {
    // Pequeña espera para que se vea el estado "Invio in corso…".
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ok: true };
  },
};
