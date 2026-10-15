import { SmartLink } from "../components/SmartLink";
import { it } from "../i18n/it";
import { imageSrc } from "../lib/images";
import { phoneHref } from "../lib/paths";
import { useSiteSettings } from "../lib/SiteSettingsContext";
import styles from "./Blog.module.css";

const CONTACTS_PATH = "/contatti";

// Tarjeta de contacto de la barra lateral. Todo sale de «Impostazioni del sito»:
// foto, título profesional, nombre, teléfono, horario y email.
export function ContactCard() {
  const settings = useSiteSettings();
  const { texts } = settings;

  return (
    <section
      aria-labelledby="blog-contact-name"
      className={`${styles.sideCard} ${styles.contactCard}`}
    >
      {/* Foto redonda. Hasta que se suba una en «Impostazioni del sito», un icono
          genérico de persona. Decorativa: el nombre va justo debajo. */}
      {settings.photoUrl ? (
        <img
          className={styles.contactPhoto}
          src={imageSrc(settings.photoUrl)}
          alt=""
          loading="lazy"
        />
      ) : (
        <span className={`${styles.contactPhoto} ${styles.contactPhotoPlaceholder}`}>
          <UserIcon />
        </span>
      )}
      <p className={styles.contactRole}>{settings.professionalTitle}</p>
      <h2 id="blog-contact-name" className={styles.contactName}>
        {settings.siteName}
      </h2>

      <dl className={styles.contactDetails}>
        {settings.phone && (
          <div>
            <dt>{texts.phoneLabel}</dt>
            <dd>
              <a href={phoneHref(settings.phone)}>{settings.phone}</a>
            </dd>
          </div>
        )}
        {settings.officeHours && (
          <div>
            <dt>{texts.officeHoursLabel}</dt>
            <dd>{settings.officeHours}</dd>
          </div>
        )}
        {settings.email && (
          <div>
            <dt>{texts.emailLabel}</dt>
            <dd>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </dd>
          </div>
        )}
      </dl>

      <SmartLink href={CONTACTS_PATH} className={`button ${styles.contactButton}`}>
        {texts.contactCardButton}
        <span className="visually-hidden"> ({it.blog.contactCardLabel})</span>
      </SmartLink>
    </section>
  );
}

// Silueta genérica de persona (cabeza y hombros), recortada por el círculo.
function UserIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="24" r="12" fill="currentColor" />
      <path d="M8 64c0-14 10.7-22 24-22s24 8 24 22z" fill="currentColor" />
    </svg>
  );
}
