import { BLOG_SLUG, type BlockType, CATEGORY_SEGMENT, HOME_SLUG } from "@studio/shared";

// Ruta pública de una página: la de inicio vive en "/".
export function pagePath(slug: string): string {
  return slug === HOME_SLUG ? "/" : `/${slug}`;
}

// Sección "Chi sono" de la home: el ítem del menú baja hasta ella con un ancla.
// El id lo pone el bloque "about" (AboutRender).
export const ABOUT_ANCHOR = "chi-sono";
export const ABOUT_HREF = `/#${ABOUT_ANCHOR}`;
// Página con la presentación completa, a la que lleva el botón "Leggi il mio percorso completo".
// No sale en el menú: mientras se ve, el ítem "Chi sono" queda marcado.
export const ABOUT_PAGE_PATH = "/chi-sono";

// Anclas de las secciones de la Home (como en el prototipo: /#per-chi, /#tariffe…).
// La primera sección de cada tipo lleva la suya; las usa el menú. «Chi sono» y las
// preguntas frecuentes ponen su id en su propio componente (ABOUT_ANCHOR, "faq").
export const HOME_SECTION_ANCHORS = {
  services: "per-chi",
  timeline: "come-funziona",
  pricing: "tariffe",
  book: "libro",
} as const satisfies Partial<Record<BlockType, string>>;
export const FAQ_ANCHOR = "faq";

// Página de contacto (con el formulario): destino del botón "Prenota" de la
// cabecera y de la barra de reserva del móvil.
export const CONTACTS_PATH = "/contatti";

// Direcciones del blog.
export const BLOG_PATH = `/${BLOG_SLUG}`;

export function postPath(slug: string): string {
  return `${BLOG_PATH}/${slug}`;
}

export function categoryPath(slug: string): string {
  return `${BLOG_PATH}/${CATEGORY_SEGMENT}/${slug}`;
}

// Un enlace es interno si es una ruta del propio sitio ("/contatti").
export function isInternalLink(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

// "+39 333 123 4567" -> "tel:+393331234567"
export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

// "+39 334 967 5237" -> "https://wa.me/393349675237?text=…" (WhatsApp quiere solo cifras).
export function whatsappHref(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
