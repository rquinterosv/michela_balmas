import type { MenuPage, SiteSettings } from "@studio/shared";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { it } from "../i18n/it";
import { pagePath } from "../lib/paths";
import styles from "./Header.module.css";

interface HeaderProps {
  settings: SiteSettings;
  // Páginas publicadas, ya ordenadas.
  pages: MenuPage[];
}

// Cabecera del sitio: nombre + menú construido con las páginas publicadas que
// tienen "Mostra nel menu". En móvil el menú se abre con un botón.
export function Header({ settings, pages }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const menuPages = pages.filter((page) => page.showInMenu);

  // Al cambiar de página, el menú móvil se cierra.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.name}>{settings.siteName}</span>
          <span className={styles.role}>{settings.professionalTitle}</span>
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
            {menuPages.map((page) => (
              <li key={page.slug}>
                {/* `end` evita que "/" quede marcada como activa en todas las páginas */}
                <NavLink
                  to={pagePath(page.slug)}
                  end
                  className={({ isActive }) => (isActive ? styles.active : undefined)}
                >
                  {page.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
