import {
  BLOG_SLUG,
  categoriesWithCounts,
  categoryShareMeta,
  pageShareMeta,
  postShareMeta,
  withSettingsDefaults,
  type ShareMeta,
  type SiteContent,
} from "@studio/shared";
import type { Plugin } from "vite";
import {
  BUILT_BLOG_PATH,
  BUILT_CONTENT_ELEMENT_ID,
  BUILT_IMAGES_DIR,
} from "./src/lib/builtContent";
import { categoryPath, pagePath, postPath } from "./src/lib/paths";

// Plugin de Vite: en el build de producción descarga todo el contenido publicado
// de la API (GET /api/content) y lo deja en el sitio como archivos estáticos:
//
// - datos del sitio y páginas, dentro de index.html (se ven sin ninguna petición);
// - el blog, en /content/blog.json (solo se descarga al entrar en el blog);
// - las imágenes subidas desde el panel, en /images/uploads/<id>.jpg, y las
//   direcciones del contenido cambiadas para apuntar a ellas;
// - una copia de index.html por dirección (/chi-sono/index.html, /blog/<artículo>/
//   index.html…) con su título, descripción e imagen: la vista previa de un enlace
//   en WhatsApp o Facebook no ejecuta JavaScript y solo ve el HTML. Vercel sirve
//   esos archivos antes de pasar al rewrite general a /index.html.
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

// Lo que el build escribe en el HTML de cada dirección, entre los comentarios
// "share-meta" de index.html.
const SHARE_META_PATTERN = /<!-- share-meta -->[\s\S]*?<!-- \/share-meta -->/;

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// Etiquetas de título, descripción y vista previa (Open Graph) de una dirección.
// `siteUrl` hace falta para las direcciones completas; sin él no se ponen ni la
// dirección ni la imagen.
function shareMetaTags(meta: ShareMeta, path: string, siteName: string, siteUrl: string): string {
  // Una imagen que no se pudo copiar (borrada) conserva la dirección del backend.
  const image = meta.image && !meta.image.startsWith("/api/") ? meta.image : "";
  const imageUrl = image.startsWith("/") ? (siteUrl ? `${siteUrl}${image}` : "") : image;
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
  ];
  if (siteUrl) {
    tags.push(`<link rel="canonical" href="${escapeHtml(siteUrl + path)}" />`);
    tags.push(`<meta property="og:url" content="${escapeHtml(siteUrl + path)}" />`);
  }
  if (imageUrl) {
    tags.push(`<meta property="og:image" content="${escapeHtml(imageUrl)}" />`);
    tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
  }
  return tags.join("\n    ");
}

// Cada dirección pública con su vista previa.
function sharePages(content: SiteContent): { path: string; meta: ShareMeta }[] {
  const settings = withSettingsDefaults(content.settings);
  const list = content.pages.map((page) => ({
    path: pagePath(page.slug),
    meta: pageShareMeta(page, settings),
  }));

  // El blog solo existe si está publicada su página (ver BlogShell).
  const blogPage = content.pages.find((page) => page.slug === BLOG_SLUG);
  if (blogPage) {
    for (const post of content.posts) {
      list.push({ path: postPath(post.slug), meta: postShareMeta(post, settings) });
    }
    for (const category of categoriesWithCounts(content.categories, content.posts)) {
      list.push({
        path: categoryPath(category.slug),
        meta: categoryShareMeta(category, blogPage, settings),
      });
    }
  }
  return list;
}

export function siteContentPlugin(): Plugin {
  let apiUrl = "";
  // Dirección pública del sitio, para las direcciones completas de la vista previa.
  let siteUrl = "";
  // Datos del sitio y páginas, listos para index.html.
  let siteJson = "";
  let content: SiteContent | null = null;

  return {
    name: "site-content",
    apply: "build",

    configResolved(config) {
      const demoMode = config.env.VITE_DEMO_MODE === "true" || !config.env.VITE_API_URL;
      apiUrl = demoMode ? "" : String(config.env.VITE_API_URL);
      // En Vercel, sin VITE_SITE_URL, vale el dominio de producción del proyecto.
      const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
      siteUrl = String(config.env.VITE_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : ""));
      siteUrl = siteUrl.replace(/\/$/, "");
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

      content = JSON.parse(json) as SiteContent;
      const { settings, pages, categories, posts } = content;
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

    // index.html ya está terminado ("post": después de que Vite lo escriba): se le
    // pone la vista previa de la Home y se copia para cada una de las demás
    // direcciones con la suya.
    generateBundle: {
      order: "post",
      handler(_options, bundle) {
        const indexHtml = bundle["index.html"];
        if (!content || indexHtml?.type !== "asset") return;
        const html = String(indexHtml.source);
        const siteName = withSettingsDefaults(content.settings).siteName;

        for (const { path, meta } of sharePages(content)) {
          const tags = shareMetaTags(meta, path, siteName, siteUrl);
          const page = html.replace(SHARE_META_PATTERN, tags);
          if (path === "/") indexHtml.source = page;
          else
            this.emitFile({ type: "asset", fileName: `${path.slice(1)}/index.html`, source: page });
        }
      },
    },
  };
}
