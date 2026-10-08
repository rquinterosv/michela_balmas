import type { z } from "zod";
import type {
  MESSAGE_STATUSES,
  contactSchema,
  pageInputSchema,
  siteSettingsSchema,
} from "./schemas";

// Los tipos salen de los esquemas zod (z.infer) para que validación y tipos
// no puedan desincronizarse. Los tipos de bloques están en blocks.ts.
//
// Las fechas viajan por la API como texto ISO 8601 ("2026-01-31T10:00:00.000Z").
// En Firestore se guardan como Timestamp; la conversión la hace el backend.

// Lo que el panel envía al crear o editar una página.
export type PageInput = z.infer<typeof pageInputSchema>;

export type Page = PageInput & {
  id: string;
  updatedAt: string;
};

// Lo mínimo para construir el menú (GET /api/pages).
export type MenuPage = Pick<Page, "title" | "slug" | "order" | "showInMenu">;

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

// Lo que envía el formulario de contacto.
export type ContactInput = z.infer<typeof contactSchema>;

export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
  consent: true;
  consentAt: string;
  status: MessageStatus;
  createdAt: string;
}

// Forma de todos los errores de la API. `error` está en italiano y se puede
// mostrar tal cual; `fields` trae los errores por campo (clave = nombre del campo).
export interface ApiError {
  error: string;
  fields?: Record<string, string>;
}
