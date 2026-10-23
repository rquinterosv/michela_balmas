// Dónde deja el build la copia del contenido publicado (siteContentPlugin.ts) y
// dónde la busca el sitio (api.ts). Sin dependencias: lo importan los dos lados.

// <script type="application/json" id="..."> dentro de index.html: datos del sitio
// y páginas publicadas.
export const BUILT_CONTENT_ELEMENT_ID = "site-content";
// Categorías y artículos publicados del blog.
export const BUILT_BLOG_PATH = "/content/blog.json";
// Imágenes subidas desde el panel, copiadas como archivos: /images/uploads/<id>.jpg.
export const BUILT_IMAGES_DIR = "images/uploads";
