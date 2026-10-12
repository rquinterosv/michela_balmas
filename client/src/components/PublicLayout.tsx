import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { it } from "../i18n/it";
import { api } from "../lib/api";
import { SiteSettingsContext } from "../lib/SiteSettingsContext";
import { useLoad } from "../lib/useLoad";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PageError, PageLoading } from "./PageStatus";
import styles from "./PublicLayout.module.css";

const MAIN_ID = "contenuto";

// Marco común del sitio público: cabecera, contenido de la página y pie.
// Carga una sola vez los datos del sitio y la lista de páginas publicadas.
export function PublicLayout() {
  const { state, reload } = useLoad(() => Promise.all([api.getSettings(), api.getMenuPages()]), []);
  const { pathname } = useLocation();

  // Cada página nueva empieza arriba, y el foco pasa al contenido para que el lector
  // de pantalla anuncie el cambio. En la primera carga no se toca el foco.
  const isFirstRender = useRef(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.getElementById(MAIN_ID)?.focus({ preventScroll: true });
  }, [pathname]);

  if (state.status === "loading") return <PageLoading />;
  if (state.status === "error") {
    return <PageError message={state.error.message} onRetry={reload} />;
  }

  const [settings, pages] = state.data;

  return (
    <SiteSettingsContext.Provider value={settings}>
      <div className={styles.layout}>
        {/* Primer elemento al tabular: salta el menú y va directo al contenido. */}
        <a href={`#${MAIN_ID}`} className={styles.skipLink}>
          {it.common.skipToContent}
        </a>
        <Header settings={settings} pages={pages} />
        <main id={MAIN_ID} tabIndex={-1} className={styles.main}>
          <Outlet />
        </main>
        <Footer settings={settings} pages={pages} />
      </div>
    </SiteSettingsContext.Provider>
  );
}
