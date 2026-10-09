// Metadatos SEO y Open Graph de la página actual. Se actualizan a mano en <head>
// (sin librería): cada página llama a setPageMeta al cargarse.
//
// Limitación conocida: al ser una SPA, quien no ejecuta JavaScript (p. ej. la vista
// previa de enlaces de WhatsApp o Facebook) solo ve los valores fijos de index.html.

const SITE_URL = import.meta.env.VITE_SITE_URL ?? window.location.origin;

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
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
}

export function setPageMeta({ title, description, path, siteName, index = true }: PageMeta) {
  const url = `${SITE_URL}${path}`;

  document.title = title;
  setMeta("name", "description", description);
  setMeta("name", "robots", index ? "index, follow" : "noindex, nofollow");
  setCanonical(url);

  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  setMeta("property", "og:site_name", siteName);
  setMeta("property", "og:locale", "it_IT");
  setMeta("property", "og:type", "website");
}
