import {
  categoriesWithCounts,
  paginatePosts,
  relatedPosts,
  type Category,
  type CategoryWithCount,
  type ContactInput,
  type MenuPage,
  type Page,
  type Post,
  type PostsPage,
  type PostWithRelated,
  type SiteSettings,
} from "@studio/shared";
import { seedCategories, seedPages, seedPosts, seedSettings } from "@studio/shared/seedContent";
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

  async getBlogCategories(): Promise<CategoryWithCount[]> {
    return categoriesWithCounts(categories, posts);
  },

  async getPosts(categorySlug: string | undefined, page: number): Promise<PostsPage> {
    const category = categories.find((candidate) => candidate.slug === categorySlug);
    if (categorySlug && !category) throw new ApiRequestError(404, it.notFound.title);
    return paginatePosts(posts, categories, { categoryId: category?.id, page });
  },

  async getPost(slug: string): Promise<PostWithRelated> {
    const post = posts.find((candidate) => candidate.slug === slug);
    if (!post) throw new ApiRequestError(404, it.notFound.title);
    return { post, related: relatedPosts(post, posts, categories) };
  },

  async sendContact(_input: ContactInput): Promise<{ ok: true }> {
    // Pequeña espera para que se vea el estado "Invio in corso…".
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ok: true };
  },
};
