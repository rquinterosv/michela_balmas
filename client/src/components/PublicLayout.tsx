import { HOME_SLUG } from "@studio/shared";
import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { it } from "../i18n/it";
import { api } from "../lib/api";
import { PublishedPagesContext } from "../lib/PublishedPagesContext";
import { SiteSettingsContext } from "../lib/SiteSettingsContext";
import { useLoad } from "../lib/useLoad";
import { BookingBar } from "./BookingBar";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PageError, PageLoading } from "./PageStatus";
import styles from "./PublicLayout.module.css";

const MAIN_ID = "contenuto";

// Marco común del sitio público: cabecera, contenido de la página y pie.
// Carga una sola vez los datos del sitio y la lista de páginas publicadas.
export function PublicLayout() {
  // Las secciones de la Home arman el menú (ver Header). Si no cargan, el menú se
  // queda con las páginas: no es motivo para que falle todo el sitio.
  const { state, reload } = useLoad(
    () =>
      Promise.all([
        api.getSettings(),
        api.getMenuPages(),
        api.getPage(HOME_SLUG).then(
          (page) => page.blocks,
          () => null,
        ),
      ]),
    [],
  );
  const { pathname, hash, key } = useLocation();

  // Cada página nueva empieza arriba, y el foco pasa al contenido para que el lector
  // de pantalla anuncie el cambio. En la primera carga no se toca el foco.
  // Con ancla (/#chi-sono) la bajada hasta la sección la hace la página cuando su
  // contenido está listo (useScrollToHash). Aquí solo se sube arriba si además se
  // cambia de página, para que no se quede la posición de la página anterior.
  const previousPathname = useRef<string | null>(null);
  useEffect(() => {
    const isFirstRender = previousPathname.current === null;
    const pageChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;

    if (hash && !pageChanged) return;
    window.scrollTo(0, 0);
    // Con ancla, el foco lo recibe la sección de destino.
    if (isFirstRender || hash) return;
    document.getElementById(MAIN_ID)?.focus({ preventScroll: true });
    // `key` cambia en cada navegación: así "Home" sube arriba aunque ya se esté en "/#chi-sono".
  }, [pathname, hash, key]);

  if (state.status === "loading") return <PageLoading />;
  if (state.status === "error") {
    return <PageError message={state.error.message} onRetry={reload} />;
  }

  const [settings, pages, homeBlocks] = state.data;

  return (
    <SiteSettingsContext.Provider value={settings}>
      <PublishedPagesContext.Provider value={pages}>
        <div className={styles.layout}>
          {/* Primer elemento al tabular: salta el menú y va directo al contenido. */}
          <a href={`#${MAIN_ID}`} className={styles.skipLink}>
            {it.common.skipToContent}
          </a>
          <Header settings={settings} pages={pages} homeBlocks={homeBlocks} />
          <main id={MAIN_ID} tabIndex={-1} className={styles.main}>
            <Outlet />
          </main>
          <Footer settings={settings} pages={pages} />
          <BookingBar settings={settings} />
        </div>
      </PublishedPagesContext.Provider>
    </SiteSettingsContext.Provider>
  );
}
