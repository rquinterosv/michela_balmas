import { HOME_SLUG, pageInputSchema, reorderSchema, type PageInput } from "@studio/shared";
import { Router } from "express";
import { HttpError } from "../middleware/errorHandler";
import { messages } from "../messages.it";
import {
  createPage,
  deletePage,
  getPageById,
  getPageBySlug,
  listAllPages,
  reorderPages,
  updatePage,
} from "../repositories/pages";
import { sanitizeBlocks } from "../services/sanitizeHtml";

// /api/admin/pages (protegido con requireAdmin en app.ts).
export const adminPagesRouter = Router();

// Valida el cuerpo de la petición y limpia el HTML de los bloques.
function parsePageInput(body: unknown): PageInput {
  const input = pageInputSchema.parse(body);
  return { ...input, blocks: sanitizeBlocks(input.blocks) };
}

// El slug debe ser único. `ownId` es la página que se está editando (puede conservar el suyo).
async function assertSlugIsFree(slug: string, ownId?: string) {
  const existing = await getPageBySlug(slug);
  if (existing && existing.id !== ownId) {
    throw new HttpError(409, messages.slugTaken, { slug: messages.slugTaken });
  }
}

async function getPageOrThrow(id: string) {
  const page = await getPageById(id);
  if (!page) throw new HttpError(404, messages.pageNotFound);
  return page;
}

adminPagesRouter.get("/", async (_req, res) => {
  res.json(await listAllPages());
});

adminPagesRouter.post("/", async (req, res) => {
  const input = parsePageInput(req.body);
  await assertSlugIsFree(input.slug);
  res.status(201).json(await createPage(input));
});

// Tiene que ir antes de "/:id": si no, Express tomaría "reorder" como un id.
adminPagesRouter.patch("/reorder", async (req, res) => {
  const { ids } = reorderSchema.parse(req.body);

  // La lista debe contener exactamente las páginas que existen, sin repetir.
  const existingIds = (await listAllPages()).map((page) => page.id);
  const sameIds =
    ids.length === existingIds.length &&
    new Set(ids).size === ids.length &&
    ids.every((id) => existingIds.includes(id));
  if (!sameIds) {
    throw new HttpError(409, messages.reorderOutdated);
  }

  await reorderPages(ids);
  res.json(await listAllPages());
});

adminPagesRouter.get("/:id", async (req, res) => {
  res.json(await getPageOrThrow(req.params.id));
});

adminPagesRouter.put("/:id", async (req, res) => {
  const current = await getPageOrThrow(req.params.id);
  const input = parsePageInput(req.body);

  // La página inicial se sirve en "/": no puede cambiar de dirección ni ocultarse.
  if (current.slug === HOME_SLUG) {
    if (input.slug !== HOME_SLUG) {
      throw new HttpError(400, messages.homeSlugLocked, { slug: messages.homeSlugLocked });
    }
    if (!input.published) {
      throw new HttpError(400, messages.homeMustStayPublished, {
        published: messages.homeMustStayPublished,
      });
    }
  }

  await assertSlugIsFree(input.slug, current.id);
  res.json(await updatePage(current.id, input));
});

adminPagesRouter.delete("/:id", async (req, res) => {
  const page = await getPageOrThrow(req.params.id);
  if (page.slug === HOME_SLUG) {
    throw new HttpError(400, messages.homeCannotBeDeleted);
  }
  await deletePage(page.id);
  res.status(204).end();
});
