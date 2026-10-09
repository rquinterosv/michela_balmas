import type { MenuPage, SiteSettings } from "@studio/shared";
import { Link } from "react-router-dom";
import { it } from "../i18n/it";
import { pagePath, phoneHref } from "../lib/paths";
import styles from "./Footer.module.css";

// Páginas legales: no salen en el menú, solo aquí.
const LEGAL_PAGES = [
  { slug: "privacy-policy", label: it.footer.privacyPolicy },
  { slug: "cookie-policy", label: it.footer.cookiePolicy },
];

interface FooterProps {
  settings: SiteSettings;
  // Páginas publicadas: solo se enlazan las legales que existan.
  pages: MenuPage[];
}

// Pie de página con los datos que la normativa italiana exige a un profesional:
// nombre completo, título, iscrizione all'Albo y Partita IVA, más los enlaces legales.
export function Footer({ settings, pages }: FooterProps) {
  const { albo, social } = settings;
  const legalPages = LEGAL_PAGES.filter((legal) => pages.some((page) => page.slug === legal.slug));
  const socialLinks = [
    { label: "Instagram", url: social.instagram },
    { label: "LinkedIn", url: social.linkedin },
  ].filter((link) => link.url);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          <p className={styles.name}>{settings.siteName}</p>
          <p>{settings.professionalTitle}</p>
          {albo.region && albo.number && <p>{it.footer.albo(albo.region, albo.number)}</p>}
          {settings.vatNumber && <p>{it.footer.vatNumber(settings.vatNumber)}</p>}
        </div>

        <address className={styles.contact}>
          {settings.address && <p>{settings.address}</p>}
          {settings.onlineSessions && <p>{it.footer.onlineSessions}</p>}
          {settings.email && (
            <p>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
          )}
          {settings.phone && (
            <p>
              <a href={phoneHref(settings.phone)}>{settings.phone}</a>
            </p>
          )}
        </address>

        <div>
          {legalPages.length > 0 && (
            <nav aria-label={it.footer.legalLabel}>
              <ul className={styles.links}>
                {legalPages.map((legal) => (
                  <li key={legal.slug}>
                    <Link to={pagePath(legal.slug)}>{legal.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          {socialLinks.length > 0 && (
            <ul className={styles.links} aria-label={it.footer.socialLabel}>
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                    <span className="visually-hidden"> ({it.common.opensInNewTab})</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="container">
        <div className={styles.bottom}>
          <p>{it.footer.copyright(new Date().getFullYear(), settings.siteName)}</p>
          {/* Acceso discreto al panel: una recarga completa, el panel es otra "zona". */}
          <a href="/admin" className={styles.reserved}>
            {it.footer.reservedArea}
          </a>
        </div>
      </div>
    </footer>
  );
}
