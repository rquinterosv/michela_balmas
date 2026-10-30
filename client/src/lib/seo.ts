// Metadatos SEO y Open Graph de la página actual. Se actualizan a mano en <head>
// (sin librería): cada página llama a setPageMeta al cargarse, con los valores de
// shared/src/seo.ts. Quien no ejecuta JavaScript (la vista previa de enlaces de
// WhatsApp o Facebook) los lee del HTML que el build escribe para cada dirección
// (siteContentPlugin.ts).

import { imageSrc } from "./images";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? window.location.origin;

// Dirección completa de una ruta del sitio ("/blog" -> "https://…/blog").
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

// Dirección completa de una imagen: las subidas ya llevan la del backend; las del
// propio sitio ("/images/foto.jpg") necesitan la del sitio.
export function absoluteImageUrl(url: string): string {
  const src = imageSrc(url);
  return src.startsWith("/") ? absoluteUrl(src) : src;
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function removeMeta(attribute: "name" | "property", key: string) {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove();
}

function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
}

interface PageMeta {
  title: string;
  description: string;
  // Ruta de la página, p. ej. "/contatti".
  path: string;
  siteName: string;
  // false para páginas que no deben aparecer en buscadores (404, panel).
  index?: boolean;
  // Imagen al compartir en redes (dirección tal como se guarda).
  image?: string;
  // "article" para los artículos del blog.
  type?: "website" | "article";
}

export function setPageMeta({
  title,
  description,
  path,
  siteName,
  index = true,
  image,
  type = "website",
}: PageMeta) {
  const url = absoluteUrl(path);

  document.title = title;
  setMeta("name", "description", description);
  setMeta("name", "robots", index ? "index, follow" : "noindex, nofollow");
  setCanonical(url);

  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  setMeta("property", "og:site_name", siteName);
  setMeta("property", "og:locale", "it_IT");
  setMeta("property", "og:type", type);
  // Sin imagen se quita la de la página anterior.
  if (image) setMeta("property", "og:image", absoluteImageUrl(image));
  else removeMeta("property", "og:image");
}
