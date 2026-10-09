import type { BlockData } from "@studio/shared";
import { it } from "../../i18n/it";
import { phoneHref } from "../../lib/paths";
import { useSiteSettings } from "../../lib/SiteSettingsContext";
import styles from "./ContactInfo.module.css";

// Recapiti: los datos salen de "Impostazioni del sito"; el bloque decide cuáles mostrar.
export function ContactInfoRender({ data }: { data: BlockData<"contactInfo"> }) {
  const settings = useSiteSettings();

  const showEmail = data.showEmail && settings.email;
  const showPhone = data.showPhone && settings.phone;
  const showAddress = data.showAddress && settings.address;
  const showOnline = data.showOnlineSessions && settings.onlineSessions;

  return (
    <section className={styles.section}>
      <div className="container">
        {data.title && <h2 className={styles.title}>{data.title}</h2>}
        <dl className={styles.list}>
          {showEmail && (
            <div className={styles.item}>
              <dt>{it.contactInfo.email}</dt>
              <dd>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </dd>
            </div>
          )}
          {showPhone && (
            <div className={styles.item}>
              <dt>{it.contactInfo.phone}</dt>
              <dd>
                <a href={phoneHref(settings.phone)}>{settings.phone}</a>
              </dd>
            </div>
          )}
          {showAddress && (
            <div className={styles.item}>
              <dt>{it.contactInfo.address}</dt>
              <dd>{settings.address}</dd>
            </div>
          )}
        </dl>
        {showOnline && <p className={styles.online}>{it.contactInfo.onlineSessions}</p>}
      </div>
    </section>
  );
}
