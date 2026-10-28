import type { SiteSettings } from "@studio/shared";
import { Link } from "react-router-dom";
import { it } from "../i18n/it";
import { CONTACTS_PATH, whatsappHref } from "../lib/paths";
import styles from "./BookingBar.module.css";

// Barra fija abajo, solo hasta 900 px: el botón "Prenota" (lleva a "Contatti") y,
// si hay teléfono en "Impostazioni del sito", un botón redondo de WhatsApp con el
// mensaje ya escrito. Queda por encima del menú abierto: es el mismo elemento con
// el menú abierto o cerrado, así que el botón no se mueve.
export function BookingBar({ settings }: { settings: SiteSettings }) {
  return (
    <div className={styles.bar} role="region" aria-label={it.nav.bookingBarLabel}>
      <Link to={CONTACTS_PATH} className={`button button-large ${styles.cta}`}>
        {it.nav.bookCta}
      </Link>

      {settings.phone && (
        <a
          href={whatsappHref(settings.phone, it.nav.whatsappMessage)}
          className={styles.round}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* Bocadillo genérico, no el logotipo de WhatsApp. */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z" />
          </svg>
          <span className="visually-hidden">
            {it.nav.whatsapp} ({it.common.opensInNewTab})
          </span>
        </a>
      )}
    </div>
  );
}
