import type { MenuPage } from "@studio/shared";
import { Router } from "express";
import { HttpError } from "../middleware/errorHandler";
import { messages } from "../messages.it";
import { getPageBySlug, listPublishedPages } from "../repositories/pages";
import { getSettings } from "../repositories/settings";

// Rutas de lectura del sitio público. Solo exponen páginas publicadas.
export const publicRouter = Router();

// Lo mínimo para construir el menú y los enlaces.
publicRouter.get("/pages", async (_req, res) => {
  const pages = await listPublishedPages();
  const menu: MenuPage[] = pages.map(({ title, slug, order, showInMenu }) => ({
    title,
    slug,
    order,
    showInMenu,
  }));
  res.json(menu);
});

publicRouter.get("/pages/:slug", async (req, res) => {
  const page = await getPageBySlug(req.params.slug);
  // Una página sin publicar responde igual que una que no existe.
  if (!page || !page.published) {
    throw new HttpError(404, messages.pageNotFound);
  }
  res.json(page);
});

publicRouter.get("/settings", async (_req, res) => {
  res.json(await getSettings());
});
