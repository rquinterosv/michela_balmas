import type { MenuPage } from "@studio/shared";
import { createContext, useContext } from "react";

// Páginas publicadas (estén o no en el menú). Las carga PublicLayout una vez.
// Fuera del sitio público (la vista previa del panel) no hay lista: vale null.
export const PublishedPagesContext = createContext<MenuPage[] | null>(null);

export function usePublishedPages(): MenuPage[] | null {
  return useContext(PublishedPagesContext);
}
