import { HOME_SLUG, type MenuPage, type SiteSettings } from "@studio/shared";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { it } from "../i18n/it";
import { ABOUT_ANCHOR, ABOUT_HREF, ABOUT_PAGE_PATH, pagePath } from "../lib/paths";
import { ContactIcons } from "./ContactIcons";
import styles from "./Header.module.css";

interface HeaderProps {
  settings: SiteSettings;
  // Páginas publicadas, ya ordenadas.
  pages: MenuPage[];
}

interface MenuItem {
  key: string;
  label: string;
  to: string;
  active: boolean;
}

// "/contatti/" y "/contatti" son la misma página.
function withoutTrailingSlash(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

// Cabecera del sitio: nombre, iconos de contacto y menú. El menú son las páginas
// publicadas que tienen "Mostra nel menu", más el ítem "Chi sono", que va justo
// después de la Home y baja a su sección (/#chi-sono). Si sale y con qué texto se
// decide en el panel ("Impostazioni del sito" > "Menu del sito"). En móvil el menú
// se abre con un botón.
export function Header({ settings, pages }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const currentPath = withoutTrailingSlash(pathname);

  // Al cambiar de página (también con atrás/adelante), el menú móvil se cierra.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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

  const items: MenuItem[] = [];
  for (const page of pages.filter((candidate) => candidate.showInMenu)) {
    const to = pagePath(page.slug);
    const isHome = page.slug === HOME_SLUG;
    items.push({
      key: page.slug,
      label: page.title,
      to,
      active: currentPath === to && !(isHome && onAboutAnchor),
    });
    if (isHome && settings.showAboutInMenu) items.push(aboutItem);
  }
  // Si la Home no está en el menú, "Chi sono" va el primero.
  if (settings.showAboutInMenu && !items.includes(aboutItem)) items.unshift(aboutItem);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          {/* Logo fijo (client/public/images/logo.png). Decorativo: el nombre va al lado. */}
          <img className={styles.logo} src="/images/logo.png" alt="" width={113} height={128} />
          <span className={styles.brandText}>
            <span className={styles.name}>{settings.siteName}</span>
            <span className={styles.role}>{settings.professionalTitle}</span>
          </span>
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="visually-hidden">{menuOpen ? it.nav.closeMenu : it.nav.openMenu}</span>
          {/* Icono: tres rayas, o una X cuando está abierto */}
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d={menuOpen ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <nav
          id="main-menu"
          aria-label={it.nav.label}
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
        >
          <ul>
            {items.map((item) => (
              <li key={item.key}>
                {/* Link y no NavLink: NavLink marcaría la Home también en "/#chi-sono".
                    Se cierra el menú al pulsar: ir a "/#chi-sono" desde "/" no cambia de página. */}
                <Link
                  to={item.to}
                  className={item.active ? styles.active : undefined}
                  aria-current={item.active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.icons}>
          <ContactIcons settings={settings} />
        </div>
      </div>
    </header>
  );
}
