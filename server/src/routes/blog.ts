import {
  categoriesWithCounts,
  paginatePosts,
  relatedPosts,
  type PostWithRelated,
} from "@studio/shared";
import { Router } from "express";
import { z } from "zod";
import { HttpError } from "../middleware/errorHandler";
import { messages } from "../messages.it";
import { listCategories } from "../repositories/categories";
import { listPublishedPosts } from "../repositories/posts";

// /api/blog: lectura del blog para el sitio público. Solo artículos publicados.
export const blogRouter = Router();

blogRouter.get("/categories", async (_req, res) => {
  const [categories, posts] = await Promise.all([listCategories(), listPublishedPosts()]);
  res.json(categoriesWithCounts(categories, posts));
});

// ?categoria=<slug> (opcional) y ?pagina=<n> (empieza en 1).
const listQuerySchema = z.object({
  categoria: z.string().optional(),
  pagina: z.coerce.number().int().min(1).default(1),
});

blogRouter.get("/posts", async (req, res) => {
  const query = listQuerySchema.parse(req.query);
  const [categories, posts] = await Promise.all([listCategories(), listPublishedPosts()]);

  let categoryId: string | undefined;
  if (query.categoria) {
    const category = categories.find((candidate) => candidate.slug === query.categoria);
    if (!category) throw new HttpError(404, messages.categoryNotFound);
    categoryId = category.id;
  }

  res.json(paginatePosts(posts, categories, { categoryId, page: query.pagina }));
});

blogRouter.get("/posts/:slug", async (req, res) => {
  const [categories, posts] = await Promise.all([listCategories(), listPublishedPosts()]);
  // Un artículo sin publicar responde igual que uno que no existe.
  const post = posts.find((candidate) => candidate.slug === req.params.slug);
  if (!post) throw new HttpError(404, messages.postNotFound);

  const body: PostWithRelated = { post, related: relatedPosts(post, posts, categories) };
  res.json(body);
});
