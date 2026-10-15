import { z } from "zod";
import { blockSchema, type BlockType } from "./blocks";
import { optionalImageUrl, optionalText, optionalUrl, requiredText } from "./fields";
import { SLUG_PATTERN } from "./slug";
import { validation } from "./validationMessages.it";

// --- Constantes ---

// Página normal (colección `pages`) que hace de portada del blog: su título, su
// lugar en el menú, su SEO y sus secciones (el perex) se editan en «Pagine». Si no
// existe o no está publicada, el blog no se ve.
export const BLOG_SLUG = "blog";
// /blog/categoria/<slug>: por eso ningún artículo puede llamarse "categoria".
export const CATEGORY_SEGMENT = "categoria";
// Artículos por carga en el listado ("Carica altri" trae los siguientes).
export const POSTS_PAGE_SIZE = 4;
// Artículos relacionados al final de un artículo.
export const RELATED_POSTS_MAX = 3;
// Tipos de sección que se pueden usar dentro de un artículo.
export const POST_BLOCK_TYPES = ["richText", "image", "zigzag", "video"] satisfies BlockType[];

// --- Esquemas ---

const address = z
  .string(validation.required)
  .trim()
  .min(1, validation.required)
  .max(80, validation.tooLong(80))
  .regex(SLUG_PATTERN, validation.invalidAddress);

// Fecha de calendario "2026-10-15" (sin hora). En Firestore se guarda como
// Timestamp a medianoche UTC; la conversión la hace el repositorio.
const calendarDate = z
  .string(validation.invalidDate)
  .regex(/^\d{4}-\d{2}-\d{2}$/, validation.invalidDate)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    // Descarta fechas imposibles como el 31 de febrero.
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
  }, validation.invalidDate);

const coverSchema = z
  .object({
    type: z.enum(["none", "image", "video"]),
    // Con un video, la imagen es opcional: se ve antes de pulsar play y en el listado.
    imageUrl: optionalImageUrl,
    imageAlt: optionalText(200),
    videoUrl: optionalUrl,
  })
  .superRefine((cover, ctx) => {
    if (cover.type === "image" && !cover.imageUrl) {
      ctx.addIssue({ code: "custom", path: ["imageUrl"], message: validation.coverImageRequired });
    }
    if (cover.type === "video" && !cover.videoUrl) {
      ctx.addIssue({ code: "custom", path: ["videoUrl"], message: validation.coverVideoRequired });
    }
  });

export const postInputSchema = z.object({
  title: requiredText(160),
  slug: address.refine((slug) => slug !== CATEGORY_SEGMENT, validation.reservedSlug),
  categoryId: z.string(validation.chooseCategory).min(1, validation.chooseCategory),
  date: calendarDate,
  excerpt: requiredText(300),
  cover: coverSchema,
  // Vacíos = el autor por defecto: nombre y foto de «Impostazioni del sito».
  author: z.object({
    name: optionalText(120),
    photoUrl: optionalImageUrl,
  }),
  blocks: z
    .array(blockSchema)
    .max(50)
    .superRefine((blocks, ctx) => {
      blocks.forEach((block, index) => {
        if (!(POST_BLOCK_TYPES as BlockType[]).includes(block.type)) {
          ctx.addIssue({
            code: "custom",
            path: [index, "type"],
            message: validation.sectionNotAllowed,
          });
        }
      });
    }),
  published: z.boolean(),
  seo: z.object({
    title: optionalText(70),
    description: optionalText(200),
    // Imagen al compartir en redes. Vacía = la de la copertina.
    imageUrl: optionalImageUrl,
  }),
});

export const categoryInputSchema = z.object({
  name: requiredText(80),
  slug: address,
  // Un solo nivel: la categoría padre no puede tener a su vez un padre.
  parentId: z.string().min(1).nullable(),
  order: z.number().int().min(0),
  seo: z.object({
    title: optionalText(70),
    description: optionalText(200),
  }),
});

// --- Tipos ---

export type PostCover = z.infer<typeof coverSchema>;
export type PostInput = z.infer<typeof postInputSchema>;
export type Post = PostInput & { id: string; createdAt: string; updatedAt: string };

// Lo que necesita una tarjeta del listado (sin las secciones del artículo).
export type PostSummary = Pick<
  Post,
  "id" | "slug" | "title" | "date" | "excerpt" | "cover" | "author" | "categoryId"
>;

export type CategoryInput = z.infer<typeof categoryInputSchema>;
export type Category = CategoryInput & { id: string };

// Categoría con el número de artículos publicados: los suyos y los de sus hijas.
export type CategoryWithCount = Category & { count: number };

// Categoría en el panel: con todos sus artículos, también los borradores.
export type AdminCategory = Category & { postCount: number };

// GET /api/blog/posts
export interface PostsPage {
  posts: PostSummary[];
  total: number;
  page: number;
  pageSize: number;
}

// GET /api/blog/posts/:slug
export interface PostWithRelated {
  post: Post;
  related: PostSummary[];
}

// --- Consultas ---
// Funciones puras sobre las listas completas: el blog tiene pocas decenas de
// artículos, así que se filtra en memoria (como las páginas) y no hacen falta
// índices de Firestore. Las usan el backend y el modo demo.

export function toPostSummary(post: Post): PostSummary {
  const { id, slug, title, date, excerpt, cover, author, categoryId } = post;
  return { id, slug, title, date, excerpt, cover, author, categoryId };
}

// Más reciente primero; con la misma fecha, el creado después.
export function sortPosts<T extends Pick<Post, "date" | "createdAt">>(posts: T[]): T[] {
  return [...posts].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  );
}

// En orden de lectura: cada categoría principal seguida de sus hijas.
// Una hija cuyo padre ya no existe se trata como principal.
export function orderCategories<T extends Category>(categories: T[]): T[] {
  const byOrder = [...categories].sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name, "it"),
  );
  const isTopLevel = (category: T) =>
    !category.parentId || !categories.some((parent) => parent.id === category.parentId);

  return byOrder
    .filter(isTopLevel)
    .flatMap((parent) => [parent, ...byOrder.filter((child) => child.parentId === parent.id)]);
}

// La categoría y sus hijas: lo que se muestra al filtrar por ella.
export function categoryFamilyIds(categories: Category[], id: string): string[] {
  return [id, ...categories.filter((category) => category.parentId === id).map((c) => c.id)];
}

// Categorías con artículos publicados, ordenadas. Las vacías no se muestran.
export function categoriesWithCounts(
  categories: Category[],
  publishedPosts: Pick<Post, "categoryId">[],
): CategoryWithCount[] {
  return orderCategories(categories)
    .map((category) => {
      const ids = categoryFamilyIds(categories, category.id);
      const count = publishedPosts.filter((post) => ids.includes(post.categoryId)).length;
      return { ...category, count };
    })
    .filter((category) => category.count > 0);
}

// Una página del listado (empieza en 1), opcionalmente de una categoría.
export function paginatePosts(
  publishedPosts: Post[],
  categories: Category[],
  options: { categoryId?: string; page: number },
): PostsPage {
  const ids = options.categoryId ? categoryFamilyIds(categories, options.categoryId) : null;
  const filtered = sortPosts(publishedPosts).filter(
    (post) => !ids || ids.includes(post.categoryId),
  );
  const start = (options.page - 1) * POSTS_PAGE_SIZE;

  return {
    posts: filtered.slice(start, start + POSTS_PAGE_SIZE).map(toPostSummary),
    total: filtered.length,
    page: options.page,
    pageSize: POSTS_PAGE_SIZE,
  };
}

// Artículos de la misma categoría; si no llegan, de su categoría principal o hermanas.
export function relatedPosts(
  post: Post,
  publishedPosts: Post[],
  categories: Category[],
): PostSummary[] {
  const others = sortPosts(publishedPosts).filter((other) => other.id !== post.id);
  const parentId = categories.find((c) => c.id === post.categoryId)?.parentId ?? post.categoryId;
  const family = categoryFamilyIds(categories, parentId);

  const sameCategory = others.filter((other) => other.categoryId === post.categoryId);
  const sameFamily = others.filter(
    (other) => other.categoryId !== post.categoryId && family.includes(other.categoryId),
  );
  return [...sameCategory, ...sameFamily].slice(0, RELATED_POSTS_MAX).map(toPostSummary);
}
