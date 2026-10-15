import { postInputSchema, sortPosts, type PostInput } from "@studio/shared";
import { Router } from "express";
import { HttpError } from "../middleware/errorHandler";
import { messages } from "../messages.it";
import { getCategoryById } from "../repositories/categories";
import {
  createPost,
  deletePost,
  getPostById,
  getPostBySlug,
  listAllPosts,
  updatePost,
} from "../repositories/posts";
import { sanitizeBlocks } from "../services/sanitizeHtml";

// /api/admin/posts (protegido con requireAdmin en app.ts): artículos del blog.
export const adminPostsRouter = Router();

// Valida el cuerpo, limpia el HTML de las secciones y comprueba la categoría y
// que la dirección no la use otro artículo. `ownId`: el artículo que se edita.
async function parsePostInput(body: unknown, ownId?: string): Promise<PostInput> {
  const input = postInputSchema.parse(body);

  if (!(await getCategoryById(input.categoryId))) {
    throw new HttpError(400, messages.categoryMissing, { categoryId: messages.categoryMissing });
  }
  const sameSlug = await getPostBySlug(input.slug);
  if (sameSlug && sameSlug.id !== ownId) {
    throw new HttpError(409, messages.postSlugTaken, { slug: messages.postSlugTaken });
  }

  return { ...input, blocks: sanitizeBlocks(input.blocks) };
}

async function getPostOrThrow(id: string) {
  const post = await getPostById(id);
  if (!post) throw new HttpError(404, messages.postNotFound);
  return post;
}

adminPostsRouter.get("/", async (_req, res) => {
  res.json(sortPosts(await listAllPosts()));
});

adminPostsRouter.post("/", async (req, res) => {
  res.status(201).json(await createPost(await parsePostInput(req.body)));
});

adminPostsRouter.get("/:id", async (req, res) => {
  res.json(await getPostOrThrow(req.params.id));
});

adminPostsRouter.put("/:id", async (req, res) => {
  const current = await getPostOrThrow(req.params.id);
  res.json(await updatePost(current.id, await parsePostInput(req.body, current.id)));
});

adminPostsRouter.delete("/:id", async (req, res) => {
  const post = await getPostOrThrow(req.params.id);
  await deletePost(post.id);
  res.status(204).end();
});
