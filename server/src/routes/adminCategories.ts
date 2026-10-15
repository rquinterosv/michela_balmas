import {
  categoryInputSchema,
  orderCategories,
  reorderSchema,
  type AdminCategory,
  type Category,
  type CategoryInput,
} from "@studio/shared";
import { Router } from "express";
import { HttpError } from "../middleware/errorHandler";
import { messages } from "../messages.it";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  reorderCategories,
  updateCategory,
} from "../repositories/categories";
import { listAllPosts } from "../repositories/posts";

// /api/admin/categories (protegido con requireAdmin en app.ts): categorías del blog.
export const adminCategoriesRouter = Router();

// Categorías en orden de lectura, con cuántos artículos tiene cada una (también
// borradores: una categoría con artículos no se puede eliminar).
async function listAdminCategories(): Promise<AdminCategory[]> {
  const [categories, posts] = await Promise.all([listCategories(), listAllPosts()]);
  return orderCategories(categories).map((category) => ({
    ...category,
    postCount: posts.filter((post) => post.categoryId === category.id).length,
  }));
}

// Dirección única y un solo nivel de subcategorías. `current`: la que se edita.
function assertValidCategory(input: CategoryInput, all: Category[], current?: Category) {
  const others = all.filter((category) => category.id !== current?.id);

  if (others.some((category) => category.slug === input.slug)) {
    throw new HttpError(409, messages.categorySlugTaken, { slug: messages.categorySlugTaken });
  }

  if (input.parentId) {
    const parent = others.find((category) => category.id === input.parentId);
    if (!parent) {
      throw new HttpError(400, messages.categoryParentInvalid, {
        parentId: messages.categoryParentInvalid,
      });
    }
    if (parent.parentId) {
      throw new HttpError(400, messages.categoryParentNotTopLevel, {
        parentId: messages.categoryParentNotTopLevel,
      });
    }
    if (current && others.some((category) => category.parentId === current.id)) {
      throw new HttpError(400, messages.categoryHasChildrenNoParent, {
        parentId: messages.categoryHasChildrenNoParent,
      });
    }
  }
}

async function getCategoryOrThrow(id: string) {
  const category = await getCategoryById(id);
  if (!category) throw new HttpError(404, messages.categoryNotFound);
  return category;
}

adminCategoriesRouter.get("/", async (_req, res) => {
  res.json(await listAdminCategories());
});

adminCategoriesRouter.post("/", async (req, res) => {
  const all = await listCategories();
  // Una categoría nueva va al final.
  const input = categoryInputSchema.parse({ ...req.body, order: all.length });
  assertValidCategory(input, all);
  await createCategory(input);
  res.status(201).json(await listAdminCategories());
});

// Tiene que ir antes de "/:id": si no, Express tomaría "reorder" como un id.
adminCategoriesRouter.patch("/reorder", async (req, res) => {
  const { ids } = reorderSchema.parse(req.body);
  const existingIds = (await listCategories()).map((category) => category.id);
  const sameIds =
    ids.length === existingIds.length &&
    new Set(ids).size === ids.length &&
    ids.every((id) => existingIds.includes(id));
  if (!sameIds) throw new HttpError(409, messages.categoriesReorderOutdated);

  await reorderCategories(ids);
  res.json(await listAdminCategories());
});

adminCategoriesRouter.put("/:id", async (req, res) => {
  const current = await getCategoryOrThrow(req.params.id);
  const input = categoryInputSchema.parse(req.body);
  assertValidCategory(input, await listCategories(), current);
  await updateCategory(current.id, input);
  res.json(await listAdminCategories());
});

adminCategoriesRouter.delete("/:id", async (req, res) => {
  const category = await getCategoryOrThrow(req.params.id);
  const all = await listAdminCategories();

  if (all.some((other) => other.parentId === category.id)) {
    throw new HttpError(409, messages.categoryHasChildren);
  }
  if ((all.find((other) => other.id === category.id)?.postCount ?? 0) > 0) {
    throw new HttpError(409, messages.categoryNotEmpty);
  }

  await deleteCategory(category.id);
  res.json(all.filter((other) => other.id !== category.id));
});
