import {
  withDefaultSiteTexts,
  type Message,
  type MessageStatus,
  type Page,
  type PageInput,
  type SiteSettings,
} from "@studio/shared";
import { auth } from "../firebase";
import { it } from "../i18n/it";
import { apiRequest, ApiRequestError } from "../lib/api";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Llamada a /api/admin/*: añade el ID token del usuario que ha iniciado sesión.
// getIdToken() renueva el token solo si está a punto de caducar.
async function adminRequest<T>(path: string, method: Method = "GET", body?: unknown): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new ApiRequestError(401, it.admin.common.sessionExpired);

  const token = await user.getIdToken();
  return apiRequest<T>(`/admin${path}`, { method, body, token });
}

export const adminApi = {
  listPages: () => adminRequest<Page[]>("/pages"),
  getPage: (id: string) => adminRequest<Page>(`/pages/${id}`),
  createPage: (input: PageInput) => adminRequest<Page>("/pages", "POST", input),
  updatePage: (id: string, input: PageInput) => adminRequest<Page>(`/pages/${id}`, "PUT", input),
  deletePage: (id: string) => adminRequest<void>(`/pages/${id}`, "DELETE"),
  // ids de todas las páginas en su nuevo orden; devuelve la lista ya reordenada.
  reorderPages: (ids: string[]) => adminRequest<Page[]>("/pages/reorder", "PATCH", { ids }),

  getSettings: () => adminRequest<SiteSettings>("/settings").then(withDefaultSiteTexts),
  saveSettings: (settings: SiteSettings) =>
    adminRequest<SiteSettings>("/settings", "PUT", settings),

  listMessages: (status?: MessageStatus) =>
    adminRequest<Message[]>(status ? `/messages?status=${status}` : "/messages"),
  updateMessageStatus: (id: string, status: MessageStatus) =>
    adminRequest<Message>(`/messages/${id}`, "PATCH", { status }),
  deleteMessage: (id: string) => adminRequest<void>(`/messages/${id}`, "DELETE"),

  // Sube un JPEG en base64; devuelve la dirección que se guarda en la página.
  uploadImage: (data: string) => adminRequest<{ url: string }>("/images", "POST", { data }),
};
