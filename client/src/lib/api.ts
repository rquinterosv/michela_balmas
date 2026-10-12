import type { ApiError, ContactInput, MenuPage, Page, SiteSettings } from "@studio/shared";
import { it } from "../i18n/it";

// Vacío en desarrollo: las peticiones a /api las redirige Vite al backend local.
const API_URL = import.meta.env.VITE_API_URL ?? "";

// Modo demo: un build de producción sin VITE_API_URL no tiene a quién pedirle el
// contenido, así que el sitio público muestra el contenido de ejemplo (demoApi.ts).
// Se apaga solo al definir VITE_API_URL. VITE_DEMO_MODE=true lo fuerza en desarrollo.
export const DEMO_MODE =
  import.meta.env.VITE_DEMO_MODE === "true" || (import.meta.env.PROD && API_URL === "");

// Error de una llamada a la API. `message` está en italiano y se puede mostrar;
// `fields` trae los errores por campo cuando falla la validación.
// `status` es 0 si ni siquiera hubo respuesta (sin conexión, backend caído).
export class ApiRequestError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields: Record<string, string> = {},
  ) {
    super(message);
  }
}

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
  getSettings: () => apiRequest<SiteSettings>("/settings"),
  sendContact: (input: ContactInput) =>
    apiRequest<{ ok: true }>("/contact", { method: "POST", body: input }),
};

type PublicApi = typeof liveApi;

// El contenido de ejemplo se carga con import() para que no pese en el sitio real.
async function loadDemoApi() {
  const { demoApi } = await import("./demoApi");
  return demoApi;
}

// Llamadas del sitio público.
export const api: PublicApi = DEMO_MODE
  ? {
      getMenuPages: async () => (await loadDemoApi()).getMenuPages(),
      getPage: async (slug) => (await loadDemoApi()).getPage(slug),
      getSettings: async () => (await loadDemoApi()).getSettings(),
      sendContact: async (input) => (await loadDemoApi()).sendContact(input),
    }
  : liveApi;
