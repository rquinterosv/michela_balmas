import type { MenuPage, SiteSettings } from "@studio/shared";
import { Link } from "react-router-dom";
import { it } from "../i18n/it";
import { DEMO_MODE } from "../lib/api";
import { pagePath, phoneHref } from "../lib/paths";
import { ContactIcons } from "./ContactIcons";
import styles from "./Footer.module.css";

// Páginas legales: no salen en el menú, solo aquí. Se enlazan con su título.
const LEGAL_SLUGS = ["privacy-policy", "cookie-policy"];

interface FooterProps {
  settings: SiteSettings;
  // Páginas publicadas: solo se enlazan las legales que existan.
  pages: MenuPage[];
}

// Pie de página con los datos que la normativa italiana exige a un profesional:
// nombre completo, título, iscrizione all'Albo y Partita IVA, más los enlaces legales.
// Fondo oscuro y cuatro columnas (una sola en el móvil), como en el diseño.
export function Footer({ settings, pages }: FooterProps) {
  const { albo, social, texts } = settings;
  const legalPages = pages.filter((page) => LEGAL_SLUGS.includes(page.slug));
  // Los mismos iconos redondos que el menú del móvil (Facebook, Instagram, email,
  // teléfono). LinkedIn no tiene icono: va como enlace de texto debajo.
  const hasContactIcons = Boolean(
    social.facebook || social.instagram || social.linkedin || settings.email || settings.phone,
  );

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.columns}>
          <div className={styles.column}>
            <p className={styles.name}>{settings.siteName}</p>
            <p>{settings.professionalTitle}</p>
            {albo.region && albo.number && (
              <p>{it.footer.albo(texts.alboPrefix, albo.region, albo.number)}</p>
            )}
            {settings.vatNumber && <p>{it.footer.vatNumber(texts.vatLabel, settings.vatNumber)}</p>}
          </div>

          <address className={styles.column}>
            <p className={styles.title}>{it.footer.contactsTitle}</p>
            {settings.phone && <a href={phoneHref(settings.phone)}>{settings.phone}</a>}
            {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
            {settings.address && <p>{settings.address}</p>}
            {settings.officeHours && <p>{settings.officeHours}</p>}
            {settings.onlineSessions && <p>{texts.onlineSessions}</p>}
          </address>

          {hasContactIcons && (
            <div className={styles.column}>
              <p className={styles.title}>{it.footer.socialTitle}</p>
              <div className={styles.icons}>
                <ContactIcons settings={settings} />
              </div>
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                  <span className="visually-hidden"> ({it.common.opensInNewTab})</span>
                </a>
              )}
            </div>
          )}

          <div className={styles.column}>
            <p className={styles.title}>{it.footer.infoTitle}</p>
            {legalPages.length > 0 && (
              <nav aria-label={it.footer.legalLabel}>
                <ul className={styles.links}>
                  {legalPages.map((legal) => (
                    <li key={legal.slug}>
                      <Link to={pagePath(legal.slug)}>{legal.title}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {/* Acceso discreto al panel: una recarga completa, el panel es otra "zona".
                En modo demo no hay panel (necesita Firebase), así que no se enlaza. */}
            {!DEMO_MODE && <a href="/admin">{it.footer.reservedArea}</a>}
          </div>
        </div>

        <div className={styles.bottom}>
          <p>{it.footer.emergency}</p>
          <p>{it.footer.copyright(new Date().getFullYear(), settings.siteName, texts.copyright)}</p>
        </div>
      </div>
    </footer>
  );
}
