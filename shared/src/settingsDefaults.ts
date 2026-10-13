import { DEFAULT_SITE_TEXTS } from "./siteTexts.it";
import type { SiteSettings } from "./types";

// Completa los datos del sitio con los campos que se han ido añadiendo después
// (textos editables, Facebook…). Hace falta cuando lo guardado en Firestore, o un
// backend aún sin actualizar, es anterior a ese campo: sin esto llegaría `undefined`.
export function withSettingsDefaults(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    social: { ...settings.social, facebook: settings.social.facebook ?? "" },
    texts: { ...DEFAULT_SITE_TEXTS, ...settings.texts },
  };
}
