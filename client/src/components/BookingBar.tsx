import type { SiteSettings } from "@studio/shared";
import { Link } from "react-router-dom";
import { it } from "../i18n/it";
import { CONTACTS_PATH, whatsappHref } from "../lib/paths";
import styles from "./BookingBar.module.css";
import { WhatsappIcon } from "./WhatsappIcon";

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
          href={whatsappHref(settings.phone, settings.texts.whatsappMessage)}
          className={styles.round}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsappIcon size={22} />
          <span className="visually-hidden">
            {settings.texts.whatsappButton} ({it.common.opensInNewTab})
          </span>
        </a>
      )}
    </div>
  );
}
