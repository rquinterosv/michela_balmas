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
      {settings.photoUrl && (
        <img
          className={styles.contactPhoto}
          src={imageSrc(settings.photoUrl)}
          alt=""
          loading="lazy"
        />
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
