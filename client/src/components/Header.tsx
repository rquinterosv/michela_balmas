import {
  type Block,
  type BlockType,
  HOME_SLUG,
  type MenuPage,
  type SiteSettings,
} from "@studio/shared";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { it } from "../i18n/it";
import {
  ABOUT_ANCHOR,
  ABOUT_HREF,
  ABOUT_PAGE_PATH,
  CONTACTS_PATH,
  FAQ_ANCHOR,
  HOME_SECTION_ANCHORS,
  pagePath,
} from "../lib/paths";
import { ContactIcons } from "./ContactIcons";
import styles from "./Header.module.css";

interface HeaderProps {
  settings: SiteSettings;
  // Páginas publicadas, ya ordenadas.
  pages: MenuPage[];
  // Secciones de la Home, para el menú (null si no se pudo cargar).
  homeBlocks: Block[] | null;
}

interface MenuItem {
  key: string;
  label: string;
  to: string;
  active: boolean;
  // Solo en el menú del móvil, como en el prototipo (FAQ y libro).
  mobileOnly?: boolean;
}

// Secciones de la Home que son voces del menú (además de «Chi sono»).
const SECTION_ITEMS: { type: BlockType; anchor: string; label: string; mobileOnly?: boolean }[] = [
  { type: "services", anchor: HOME_SECTION_ANCHORS.services, label: it.nav.sections.services },
  { type: "timeline", anchor: HOME_SECTION_ANCHORS.timeline, label: it.nav.sections.timeline },
  { type: "pricing", anchor: HOME_SECTION_ANCHORS.pricing, label: it.nav.sections.pricing },
  { type: "faq", anchor: FAQ_ANCHOR, label: it.nav.sections.faq, mobileOnly: true },
  {
    type: "book",
    anchor: HOME_SECTION_ANCHORS.book,
    label: it.nav.sections.book,
    mobileOnly: true,
  },
];

// "/contatti/" y "/contatti" son la misma página.
function withoutTrailingSlash(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

// Cabecera del sitio: logo, menú y botón "Prenota". El menú es el índice de la
// Home (ver más abajo); sin esas secciones, son las páginas
// publicadas que tienen "Mostra nel menu", más el ítem "Chi sono", que va justo
// después de la Home y baja a su sección (/#chi-sono). Si sale y con qué texto se
// decide en el panel ("Impostazioni del sito" > "Menu del sito"). Hasta 900 px el
// menú es un panel que baja al pulsar el botón, con los iconos de contacto.
export function Header({ settings, pages, homeBlocks }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const currentPath = withoutTrailingSlash(pathname);

  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Al cambiar de página (también con atrás/adelante), el menú móvil se cierra.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Con el menú abierto: Esc lo cierra y devuelve el foco al botón; tocar fuera de
  // la cabecera lo cierra (pointerdown y no click: ya está cerrado cuando el dedo
  // llega a lo que se quería tocar); y pasar a pantalla ancha también.
  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      buttonRef.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    const wide = window.matchMedia("(min-width: 901px)");
    function onWide(event: MediaQueryListEvent) {
      if (event.matches) setMenuOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      wide.removeEventListener("change", onWide);
    };
  }, [menuOpen]);

  // "Chi sono" está marcado en la sección de la home y en la página /chi-sono;
  // mientras tanto la Home no, para que no haya dos ítems activos a la vez.
  // Si el ítem está oculto, la Home sigue marcada también en /#chi-sono.
  const onAboutAnchor =
    settings.showAboutInMenu && currentPath === "/" && hash === `#${ABOUT_ANCHOR}`;
  const aboutActive = onAboutAnchor || currentPath === ABOUT_PAGE_PATH;

  const aboutItem: MenuItem = {
    key: ABOUT_ANCHOR,
    label: settings.texts.aboutMenu,
    to: ABOUT_HREF,
    active: aboutActive,
  };

  // Una página también queda marcada en sus subpáginas (/blog/…).
  const pageItem = (page: MenuPage): MenuItem => {
    const to = pagePath(page.slug);
    return {
      key: page.slug,
      label: page.title,
      to,
      active: currentPath === to || currentPath.startsWith(`${to}/`),
    };
  };
  const menuPages = pages.filter((page) => page.showInMenu);

  // Menú del diseño: un índice de la Home. Cada sección de SECTION_ITEMS que tenga la
  // Home es una voz que baja hasta ella, en el orden de la página; detrás, las páginas
  // con "Mostra nel menu" (salvo la Home: a ella lleva el logo).
  const sectionItems: MenuItem[] = [];
  for (const block of homeBlocks ?? []) {
    if (block.type === "about") {
      if (settings.showAboutInMenu && !sectionItems.includes(aboutItem)) {
        sectionItems.push(aboutItem);
      }
      continue;
    }
    const section = SECTION_ITEMS.find((candidate) => candidate.type === block.type);
    if (!section || sectionItems.some((item) => item.key === section.anchor)) continue;
    sectionItems.push({
      key: section.anchor,
      label: section.label,
      to: `/#${section.anchor}`,
      active: currentPath === "/" && hash === `#${section.anchor}`,
      mobileOnly: section.mobileOnly,
    });
  }

  const items: MenuItem[] = [];
  if (sectionItems.some((item) => item !== aboutItem)) {
    items.push(...sectionItems);
    items.push(...menuPages.filter((page) => page.slug !== HOME_SLUG).map(pageItem));
  } else {
    // Home sin las secciones del diseño: el menú de siempre (las páginas, con
    // "Chi sono" justo después de la Home).
    for (const page of menuPages) {
      const isHome = page.slug === HOME_SLUG;
      items.push(
        isHome
          ? { ...pageItem(page), active: currentPath === "/" && !onAboutAnchor }
          : pageItem(page),
      );
      if (isHome && settings.showAboutInMenu) items.push(aboutItem);
    }
    // Si la Home no está en el menú, "Chi sono" va el primero.
    if (settings.showAboutInMenu && !items.includes(aboutItem)) items.unshift(aboutItem);
  }

  // Las mismas voces en la barra de escritorio y en el panel del móvil (este, además,
  // con las de `mobileOnly`). Solo se ve una de las dos a la vez (la otra tiene
  // display: none), así que no se repiten.
  // Link y no NavLink: NavLink marcaría la Home también en "/#chi-sono".
  // Se cierra el menú al pulsar: ir a "/#chi-sono" desde "/" no cambia de página.
  const renderItems = (staggered: boolean) =>
    items
      .filter((item) => staggered || !item.mobileOnly)
      .map((item, index) => (
        <li key={item.key} style={staggered ? ({ "--i": index } as CSSProperties) : undefined}>
          <Link
            to={item.to}
            className={item.active ? styles.active : undefined}
            aria-current={item.active ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        </li>
      ));

  return (
    <>
      <header ref={headerRef} className={`${styles.header} ${menuOpen ? styles.open : ""}`}>
        <div className={`container ${styles.bar}`}>
          <Link to="/" className={styles.brand}>
            {/* Monograma (client/public/images/logo.png) usado como máscara: toma el
                color del texto. Decorativo: el nombre va al lado. */}
            <span className={styles.monogram} aria-hidden="true">
              <span className={styles.mark} />
            </span>
            <span className={styles.identity}>
              <span className={styles.name}>{settings.siteName}</span>
              <span className={styles.role}>{settings.professionalTitle}</span>
            </span>
          </Link>

          <nav aria-label={it.nav.label} className={styles.desktopNav}>
            <ul>{renderItems(false)}</ul>
            <Link to={CONTACTS_PATH} className="button">
              {it.nav.bookCta}
            </Link>
          </nav>

          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="visually-hidden">{menuOpen ? it.nav.closeMenu : it.nav.openMenu}</span>
            {/* Tres rayas y una X superpuestas que se cambian: el botón no se mueve. */}
            <span className={styles.signs} aria-hidden="true">
              <svg className={styles.signOpen} width="24" height="24" viewBox="0 0 24 24">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              <svg className={styles.signClose} width="24" height="24" viewBox="0 0 24 24">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </span>
          </button>
        </div>

        {/* Panel del móvil: baja desde la cabecera y cubre la página sin empujarla.
            No es un diálogo modal (la página sigue a la vista): se cierra con Esc,
            tocando fuera o eligiendo una voz. El botón "Prenota" no está aquí:
            en el móvil vive en la barra fija de abajo, que sigue visible. */}
        <div id="main-menu" className={styles.panel}>
          <div className={styles.panelClip}>
            <div className={styles.panelBody}>
              <nav aria-label={it.nav.label}>
                <ul>{renderItems(true)}</ul>
              </nav>
              <div className={styles.panelIcons} style={{ "--i": items.length } as CSSProperties}>
                <ContactIcons settings={settings} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Con el menú abierto, la página de debajo se aleja: desenfocada y un poco más
          oscura. Fuera de la cabecera: su backdrop-filter rompería el position: fixed. */}
      <div className={`${styles.veil} ${menuOpen ? styles.veilVisible : ""}`} aria-hidden="true" />
    </>
  );
}
