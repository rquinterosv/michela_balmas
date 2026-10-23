import {
  withSettingsDefaults,
  type ApiError,
  type CategoryWithCount,
  type ContactInput,
  type MenuPage,
  type Page,
  type PostsPage,
  type PostWithRelated,
  type SiteSettings,
} from "@studio/shared";
import { it } from "../i18n/it";
import { ApiRequestError } from "./apiError";
import { BUILT_BLOG_PATH, BUILT_CONTENT_ELEMENT_ID } from "./builtContent";
import { createStaticApi, type StaticBlog, type StaticSite } from "./staticApi";

export { ApiRequestError };

// Vacío en desarrollo: las peticiones a /api las redirige Vite al backend local.
export const API_URL = import.meta.env.VITE_API_URL ?? "";

// Modo demo: un build de producción sin VITE_API_URL no tiene a quién pedirle el
// contenido, así que el sitio público muestra el contenido de ejemplo (demoApi.ts).
// Se apaga solo al definir VITE_API_URL. VITE_DEMO_MODE=true lo fuerza en desarrollo.
export const DEMO_MODE =
  import.meta.env.VITE_DEMO_MODE === "true" || (import.meta.env.PROD && API_URL === "");

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  // ID token de Firebase Auth, para las rutas /admin.
  token?: string;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.token) headers["Authorization"] = `Bearer ${options.token}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiRequestError(0, it.common.error);
  }

  // 204 = todo bien, sin contenido (p. ej. al eliminar).
  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const apiError = data as ApiError | null;
    throw new ApiRequestError(
      response.status,
      apiError?.error ?? it.common.error,
      apiError?.fields,
    );
  }

  return data as T;
}

// Llamadas del sitio público contra el backend.
const liveApi = {
  getMenuPages: () => apiRequest<MenuPage[]>("/pages"),
  getPage: (slug: string) => apiRequest<Page>(`/pages/${encodeURIComponent(slug)}`),
  getSettings: () => apiRequest<SiteSettings>("/settings").then(withSettingsDefaults),
  sendContact: (input: ContactInput) =>
    apiRequest<{ ok: true }>("/contact", { method: "POST", body: input }),
  getBlogCategories: () => apiRequest<CategoryWithCount[]>("/blog/categories"),
  // Una página del listado (empieza en 1), opcionalmente de una categoría.
  getPosts: (categorySlug: string | undefined, page: number) => {
    const params = new URLSearchParams({ pagina: String(page) });
    if (categorySlug) params.set("categoria", categorySlug);
    return apiRequest<PostsPage>(`/blog/posts?${params.toString()}`);
  },
  getPost: (slug: string) => apiRequest<PostWithRelated>(`/blog/posts/${encodeURIComponent(slug)}`),
};

type PublicApi = typeof liveApi;

// El contenido de ejemplo se carga con import() para que no pese en el sitio real.
async function loadDemoApi() {
  const { demoApi } = await import("./demoApi");
  return demoApi;
}

// Copia del contenido publicado hecha en el build (ver client/siteContentPlugin.ts):
// los datos del sitio y las páginas van dentro de index.html, y el blog en
// /content/blog.json. Así el sitio público no espera a la API, que en el hosting
// gratuito tarda casi un minuto en despertarse. No existe en desarrollo ni en un
// build sin VITE_API_URL: entonces se usa la API (o el modo demo).
function readBuiltSite(): StaticSite | null {
  const json = document.getElementById(BUILT_CONTENT_ELEMENT_ID)?.textContent;
  return json ? (JSON.parse(json) as StaticSite) : null;
}

// El blog se descarga una sola vez, al entrar en él. Si falla, se reintenta en la
// próxima llamada.
let builtBlog: Promise<StaticBlog> | null = null;

function loadBuiltBlog(): Promise<StaticBlog> {
  builtBlog ??= fetch(BUILT_BLOG_PATH)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json() as Promise<StaticBlog>;
    })
    .catch(() => {
      builtBlog = null;
      throw new ApiRequestError(0, it.common.error);
    });
  return builtBlog;
}

const builtSite = DEMO_MODE ? null : readBuiltSite();

// Llamadas del sitio público. Las lecturas salen de la copia del build si la hay;
// el formulario de contacto siempre va a la API.
export const api: PublicApi = DEMO_MODE
  ? {
      getMenuPages: async () => (await loadDemoApi()).getMenuPages(),
      getPage: async (slug) => (await loadDemoApi()).getPage(slug),
      getSettings: async () => (await loadDemoApi()).getSettings(),
      sendContact: async (input) => (await loadDemoApi()).sendContact(input),
      getBlogCategories: async () => (await loadDemoApi()).getBlogCategories(),
      getPosts: async (categorySlug, page) => (await loadDemoApi()).getPosts(categorySlug, page),
      getPost: async (slug) => (await loadDemoApi()).getPost(slug),
    }
  : builtSite
    ? { ...createStaticApi(builtSite, loadBuiltBlog), sendContact: liveApi.sendContact }
    : liveApi;

// Despierta el backend sin esperar respuesta. Se llama al abrir el formulario de
// contacto y el panel: el hosting gratuito lo duerme tras 15 minutos sin uso y
// tarda casi un minuto en arrancar; así, al pulsar "Invia" o "Accedi" ya está listo.
export function wakeUpBackend(): void {
  if (DEMO_MODE) return;
  fetch(`${API_URL}/api/health`).catch(() => {
    // Si no responde, el error se verá en la petición de verdad.
  });
}
