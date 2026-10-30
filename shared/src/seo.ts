import type { Category, Post } from "./blog";
import { HOME_SLUG } from "./slug";
import type { Page, SiteSettings } from "./types";

// Título, descripción e imagen con que se presenta cada dirección del sitio en
// Google y en la vista previa de un enlace (WhatsApp, Facebook…). Los usan el
// navegador (client/src/lib/seo.ts) y el build, que los escribe en el HTML de cada
// dirección (client/siteContentPlugin.ts): la vista previa no ejecuta JavaScript.
//
// Lo que no se rellena en la página o el artículo sale de "Impostazioni del sito" >
// "Anteprima dei collegamenti" y, para la imagen, de la foto profesional.
export interface ShareMeta {
  title: string;
  description: string;
  // Dirección tal como se guarda ("" = sin imagen).
  image: string;
  type: "website" | "article";
}

function defaultImage(settings: SiteSettings): string {
  return settings.seo.imageUrl || settings.photoUrl;
}

export function pageShareMeta(page: Page, settings: SiteSettings): ShareMeta {
  // La Home se presenta con el nombre: "Home | …" no dice nada.
  const fallbackTitle =
    page.slug === HOME_SLUG
      ? `${settings.siteName} | ${settings.professionalTitle}`
      : `${page.title} | ${settings.siteName}`;
  return {
    title: page.seo.title || fallbackTitle,
    description: page.seo.description || settings.seo.description,
    image: page.seo.imageUrl || defaultImage(settings),
    type: "website",
  };
}

export function postShareMeta(post: Post, settings: SiteSettings): ShareMeta {
  return {
    title: post.seo.title || `${post.title} | ${settings.siteName}`,
    description: post.seo.description || post.excerpt,
    image: post.seo.imageUrl || post.cover.imageUrl || defaultImage(settings),
    type: "article",
  };
}

// Lista de una categoría del blog: lo que no tenga, lo toma de la página "blog".
export function categoryShareMeta(
  category: Pick<Category, "name" | "seo">,
  blogPage: Page,
  settings: SiteSettings,
): ShareMeta {
  const blog = pageShareMeta(blogPage, settings);
  return {
    ...blog,
    title: category.seo.title || `${category.name} | ${blogPage.title} | ${settings.siteName}`,
    description: category.seo.description || blog.description,
  };
}
