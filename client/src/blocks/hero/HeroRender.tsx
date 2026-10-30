import type { BlockData } from "@studio/shared";
import { Check } from "lucide-react";
import { SmartLink } from "../../components/SmartLink";
import { WhatsappIcon } from "../../components/WhatsappIcon";
import { it } from "../../i18n/it";
import { imageSrc } from "../../lib/images";
import { whatsappHref } from "../../lib/paths";
import { useSiteSettings } from "../../lib/SiteSettingsContext";
import styles from "./Hero.module.css";

// Cabecera de página: título grande (el <h1>), subtítulo, botones, frases cortas con
// una marca e imagen. En escritorio, texto a la izquierda y foto a la derecha; en el
// móvil, la foto debajo.
//
// Botón de WhatsApp, frases y Albo vienen del rediseño: una cabecera guardada antes
// no trae esos campos (undefined) y usa los valores por defecto (todo visible, con
// las frases de it.hero.defaultHighlights). El teléfono y el Albo salen de los datos
// del sitio; si faltan, no se muestran.
export function HeroRender({ data }: { data: BlockData<"hero"> }) {
  const settings = useSiteSettings();
  const { albo, phone } = settings;

  const highlights = (data.highlights ?? it.hero.defaultHighlights)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);
  if ((data.showAlbo ?? true) && albo.region && albo.number) {
    highlights.push(it.hero.albo(albo.region, albo.number));
  }

  const showButton = Boolean(data.buttonLabel && data.buttonHref);
  const showWhatsapp = (data.showWhatsapp ?? true) && Boolean(phone);

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.grid} ${data.imageUrl ? styles.withImage : ""}`}>
        <div className={styles.text}>
          <h1 className={styles.title}>{data.title}</h1>
          {data.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}
          {(showButton || showWhatsapp) && (
            <div className={styles.actions}>
              {showButton && (
                <SmartLink href={data.buttonHref} className="button button-large">
                  {data.buttonLabel}
                </SmartLink>
              )}
              {showWhatsapp && (
                <a
                  href={whatsappHref(phone, settings.texts.whatsappMessage)}
                  className={`button button-secondary button-large ${styles.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsappIcon />
                  {settings.texts.whatsappButton}
                  <span className="visually-hidden"> ({it.common.opensInNewTab})</span>
                </a>
              )}
            </div>
          )}
          {highlights.length > 0 && (
            <ul className={styles.highlights}>
              {highlights.map((line, index) => (
                <li key={index}>
                  <Check className={styles.check} aria-hidden="true" focusable="false" />
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>
        {data.imageUrl && (
          <div className={styles.portrait}>
            <div className={`frame ${styles.frame}`}>
              <img
                src={imageSrc(data.imageUrl)}
                // Sin descripción, la imagen es decorativa y el lector de pantalla la salta.
                alt={data.imageAlt}
                fetchPriority="high"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
