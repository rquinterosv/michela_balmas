import type { SiteContent } from "@studio/shared";
import type { Plugin } from "vite";
import {
  BUILT_BLOG_PATH,
  BUILT_CONTENT_ELEMENT_ID,
  BUILT_IMAGES_DIR,
} from "./src/lib/builtContent";

// Plugin de Vite: en el build de producción descarga todo el contenido publicado
// de la API (GET /api/content) y lo deja en el sitio como archivos estáticos:
//
// - datos del sitio y páginas, dentro de index.html (se ven sin ninguna petición);
// - el blog, en /content/blog.json (solo se descarga al entrar en el blog);
// - las imágenes subidas desde el panel, en /images/uploads/<id>.jpg, y las
//   direcciones del contenido cambiadas para apuntar a ellas.
//
// Así el visitante no espera al backend, que en el hosting gratuito se duerme.
// Tras cada cambio en el panel, el backend pide un build nuevo (siteRebuild.ts).
// Lo lee src/lib/api.ts. Sin VITE_API_URL (modo demo) no hace nada.

// El backend gratuito tarda hasta un minuto en despertarse: se espera bastante y se
// reintenta antes de dar el build por fallido.
const REQUEST_TIMEOUT_MS = 90_000;
const ATTEMPTS = 3;

// Dirección que guarda el panel para una imagen subida (UPLOADED_IMAGE_PREFIX).
const UPLOADED_IMAGE_PATTERN = /\/api\/images\/([A-Za-z0-9]+)/g;

async function download(url: string): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
      // 404 es una respuesta válida (p. ej. una imagen borrada): no se reintenta.
      if (response.ok || response.status === 404) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`No se pudo descargar ${url}: ${String(lastError)}`);
}

export function siteContentPlugin(): Plugin {
  let apiUrl = "";
  // Datos del sitio y páginas, listos para index.html.
  let siteJson = "";

  return {
    name: "site-content",
    apply: "build",

    configResolved(config) {
      const demoMode = config.env.VITE_DEMO_MODE === "true" || !config.env.VITE_API_URL;
      apiUrl = demoMode ? "" : String(config.env.VITE_API_URL);
    },

    async buildStart() {
      if (!apiUrl) return;

      const contentResponse = await download(`${apiUrl}/api/content`);
      if (!contentResponse.ok) {
        throw new Error(`${apiUrl}/api/content respondió ${contentResponse.status}`);
      }
      let json = await contentResponse.text();

      // Cada imagen subida se copia como archivo y su dirección pasa a ser la del
      // archivo. Una que ya no existe (404) se deja como estaba.
      const imageIds = new Set([...json.matchAll(UPLOADED_IMAGE_PATTERN)].map((match) => match[1]));
      for (const id of imageIds) {
        const response = await download(`${apiUrl}/api/images/${id}`);
        if (!response.ok) continue;
        const fileName = `${BUILT_IMAGES_DIR}/${id}.jpg`;
        this.emitFile({
          type: "asset",
          fileName,
          source: new Uint8Array(await response.arrayBuffer()),
        });
        json = json.replaceAll(`/api/images/${id}"`, `/${fileName}"`);
      }

      const { settings, pages, categories, posts } = JSON.parse(json) as SiteContent;
      this.emitFile({
        type: "asset",
        fileName: BUILT_BLOG_PATH.slice(1),
        source: JSON.stringify({ categories, posts }),
      });
      siteJson = JSON.stringify({ settings, pages });

      console.log(
        `Contenido del sitio: ${pages.length} páginas, ${posts.length} artículos, ` +
          `${imageIds.size} imágenes (${apiUrl}).`,
      );
    },

    transformIndexHtml() {
      if (!siteJson) return;
      return [
        {
          tag: "script",
          attrs: { id: BUILT_CONTENT_ELEMENT_ID, type: "application/json" },
          // "<" escapado: un texto con "</script>" no puede cerrar la etiqueta antes de tiempo.
          children: siteJson.replaceAll("<", "\\u003c"),
          injectTo: "head",
        },
      ];
    },
  };
}
