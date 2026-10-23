import type { MenuPage, SiteContent } from "@studio/shared";
import { Router } from "express";
import { HttpError } from "../middleware/errorHandler";
import { messages } from "../messages.it";
import { listCategories } from "../repositories/categories";
import { getImage } from "../repositories/images";
import { getPageBySlug, listPublishedPages } from "../repositories/pages";
import { listPublishedPosts } from "../repositories/posts";
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

// Todo el contenido publicado de una vez. Lo descarga el build del frontend, que
// sirve el sitio público como archivos estáticos (client/siteContentPlugin.ts).
publicRouter.get("/content", async (_req, res) => {
  const [settings, pages, categories, posts] = await Promise.all([
    getSettings(),
    listPublishedPages(),
    listCategories(),
    listPublishedPosts(),
  ]);
  const content: SiteContent = { settings, pages, categories, posts };
  res.json(content);
});

// Imágenes subidas desde el panel (siempre JPEG, ver adminImages.ts).
publicRouter.get("/images/:id", async (req, res) => {
  const image = await getImage(req.params.id);
  if (!image) throw new HttpError(404, messages.imageNotFound);

  res.set({
    "Content-Type": "image/jpeg",
    // Una imagen subida no cambia nunca (una nueva tiene otro id): el navegador
    // puede guardarla un año y no volver a pedirla.
    "Cache-Control": "public, max-age=31536000, immutable",
    // helmet solo deja usar las respuestas desde el mismo origen; el sitio público
    // está en otro dominio que el backend y tiene que poder mostrar la imagen.
    "Cross-Origin-Resource-Policy": "cross-origin",
  });
  res.send(image);
});
