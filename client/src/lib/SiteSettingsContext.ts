import type { SiteSettings } from "@studio/shared";
import { createContext, useContext } from "react";

// Los datos del sitio (nombre, recapiti, motivos de contacto…) se cargan una vez
// en el layout y quedan disponibles para cualquier bloque con useSiteSettings().
export const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function useSiteSettings(): SiteSettings {
  const settings = useContext(SiteSettingsContext);
  if (!settings) {
    throw new Error("useSiteSettings se usó fuera de <SiteSettingsContext.Provider>");
  }
  return settings;
}
