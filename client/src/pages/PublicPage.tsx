import { HOME_SLUG, type Page } from "@studio/shared";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { BlockList } from "../blocks/BlockRenderer";
import { PageError, PageLoading } from "../components/PageStatus";
import { it } from "../i18n/it";
import { api } from "../lib/api";
import { pagePath } from "../lib/paths";
import { setPageMeta } from "../lib/seo";
import { useSiteSettings } from "../lib/SiteSettingsContext";
import { useLoad } from "../lib/useLoad";
import { NotFound } from "./NotFound";
import styles from "./PublicPage.module.css";

// Página pública genérica: carga la página por su slug y dibuja sus bloques.
// Sirve "/" (slug "home") y "/:slug".
export function PublicPage() {
  const params = useParams();
  const slug = params.slug ?? HOME_SLUG;
  const { state, reload } = useLoad(() => api.getPage(slug), [slug]);

  // "/home" es la misma página que "/": se redirige para no tener dos direcciones.
  if (params.slug === HOME_SLUG) return <Navigate to="/" replace />;

  if (state.status === "loading") return <PageLoading />;
  if (state.status === "error") {
    if (state.error.status === 404) return <NotFound />;
    return <PageError message={state.error.message} onRetry={reload} />;
  }

  return <PageContent page={state.data} />;
}

// Contenido de una página ya cargada. También lo usará la vista previa del panel.
export function PageContent({ page }: { page: Page }) {
  const settings = useSiteSettings();

  useEffect(() => {
    setPageMeta({
      title: page.seo.title || `${page.title} | ${settings.siteName}`,
      description: page.seo.description || it.seo.defaultDescription,
      path: pagePath(page.slug),
      siteName: settings.siteName,
    });
  }, [page, settings.siteName]);

  // Cada página necesita un <h1>. El bloque "Intestazione" trae el suyo;
  // si la página no empieza por uno, el título de la página hace de <h1>.
  const startsWithHero = page.blocks[0]?.type === "hero";

  return (
    <>
      {!startsWithHero && (
        <div className={`container ${styles.pageTitle}`}>
          <h1>{page.title}</h1>
        </div>
      )}
      <BlockList blocks={page.blocks} />
    </>
  );
}
