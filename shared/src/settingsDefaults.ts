import { DEFAULT_SITE_TEXTS } from "./siteTexts.it";
import type { SiteSettings } from "./types";

// Completa los datos del sitio con los campos que se han ido añadiendo después
// (textos editables, Facebook, ítem "Chi sono" del menú…). Hace falta cuando lo guardado en Firestore, o un
// backend aún sin actualizar, es anterior a ese campo: sin esto llegaría `undefined`.
export function withSettingsDefaults(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    social: { ...settings.social, facebook: settings.social.facebook ?? "" },
    // Antes de existir la opción, el ítem "Chi sono" ya salía en el menú.
    showAboutInMenu: settings.showAboutInMenu ?? true,
    texts: { ...DEFAULT_SITE_TEXTS, ...settings.texts },
  };
}
