import { HOME_SLUG } from "@studio/shared";

// Ruta pública de una página: la de inicio vive en "/".
export function pagePath(slug: string): string {
  return slug === HOME_SLUG ? "/" : `/${slug}`;
}

// Un enlace es interno si es una ruta del propio sitio ("/contatti").
export function isInternalLink(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

// "+39 333 123 4567" -> "tel:+393331234567"
export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}
