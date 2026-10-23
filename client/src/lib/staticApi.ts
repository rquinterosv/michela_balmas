import {
  categoriesWithCounts,
  paginatePosts,
  relatedPosts,
  type CategoryWithCount,
  type MenuPage,
  type Page,
  type PostsPage,
  type PostWithRelated,
  type SiteContent,
  type SiteSettings,
} from "@studio/shared";
import { it } from "../i18n/it";
import { ApiRequestError } from "./apiError";

// Lo que necesita cualquier página (cabecera, pie y contenido) y lo que solo
// necesita el blog, que se carga aparte porque puede crecer mucho.
export type StaticSite = Pick<SiteContent, "settings" | "pages">;
export type StaticBlog = Pick<SiteContent, "categories" | "posts">;

// Responde a las mismas lecturas que la API (ver api.ts) a partir de una copia del
// contenido publicado: la que el build mete en el sitio o la de ejemplo del modo
// demo. Las consultas del blog son las mismas funciones que usa el backend.
// `site.pages` solo trae páginas publicadas, ordenadas.
export function createStaticApi(site: StaticSite, loadBlog: () => Promise<StaticBlog>) {
  return {
    async getMenuPages(): Promise<MenuPage[]> {
      return site.pages.map(({ title, slug, order, showInMenu }) => ({
        title,
        slug,
        order,
        showInMenu,
      }));
    },

    async getPage(slug: string): Promise<Page> {
      const page = site.pages.find((candidate) => candidate.slug === slug);
      if (!page) throw new ApiRequestError(404, it.notFound.title);
      return page;
    },

    async getSettings(): Promise<SiteSettings> {
      return site.settings;
    },

    async getBlogCategories(): Promise<CategoryWithCount[]> {
      const { categories, posts } = await loadBlog();
      return categoriesWithCounts(categories, posts);
    },

    async getPosts(categorySlug: string | undefined, page: number): Promise<PostsPage> {
      const { categories, posts } = await loadBlog();
      const category = categories.find((candidate) => candidate.slug === categorySlug);
      if (categorySlug && !category) throw new ApiRequestError(404, it.notFound.title);
      return paginatePosts(posts, categories, { categoryId: category?.id, page });
    },

    async getPost(slug: string): Promise<PostWithRelated> {
      const { categories, posts } = await loadBlog();
      const post = posts.find((candidate) => candidate.slug === slug);
      if (!post) throw new ApiRequestError(404, it.notFound.title);
      return { post, related: relatedPosts(post, posts, categories) };
    },
  };
}
