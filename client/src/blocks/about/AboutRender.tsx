import type { BlockData } from "@studio/shared";
import { ArrowUpRight, Check, ChevronRight } from "lucide-react";
import { RichText } from "../../components/RichText";
import { SmartLink } from "../../components/SmartLink";
import styles from "./About.module.css";
import { imageSrc } from "../../lib/images";
import { it } from "../../i18n/it";
import { ABOUT_ANCHOR, ABOUT_PAGE_PATH, pagePath } from "../../lib/paths";
import { usePublishedPages } from "../../lib/PublishedPagesContext";
import { useSiteSettings } from "../../lib/SiteSettingsContext";

// "https://www.instagram.com/dottoressa_michelabalmas?x=1" -> "@dottoressa_michelabalmas".
// null si la dirección no tiene esa forma.
function instagramHandle(url: string): string | null {
  try {
    const name = new URL(url).pathname.split("/").filter(Boolean)[0];
    return name ? `@${name}` : null;
  } catch {
    return null;
  }
}

// Contorno de Instagram, dibujado aquí (lucide no trae logotipos de marcas).
function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" />
    </svg>
  );
}

// Presentación: foto, texto, botón opcional y listas (formazione, specializzazioni…).
export function AboutRender({ data }: { data: BlockData<"about"> }) {
  const publishedPages = usePublishedPages();
  const settings = useSiteSettings();

  // Botón: lo que diga el panel. Un bloque guardado antes de existir el botón no
  // trae los campos (undefined) y usa el botón por defecto, "Leggi il mio percorso completo" a
  // /chi-sono, pero solo si esa página está publicada: así no lleva a un 404.
  // Dejar los campos vacíos en el panel ("") quita el botón.
  const usesDefaultButton = data.buttonLabel === undefined && data.buttonHref === undefined;
  const buttonLabel = data.buttonLabel ?? it.about.defaultButtonLabel;
  const buttonHref = data.buttonHref ?? ABOUT_PAGE_PATH;
  const targetPublished =
    publishedPages === null || // vista previa del panel: no se comprueba
    publishedPages.some((page) => pagePath(page.slug) === buttonHref);
  const showButton = buttonLabel && buttonHref && (!usesDefaultButton || targetPublished);
  // El perfil de Instagram de «Impostazioni del sito», si lo hay.
  const instagram = settings.social.instagram;

  return (
    // El id es el ancla del ítem "Chi sono" del menú (/#chi-sono). tabIndex={-1}
    // deja que reciba el foco al llegar por el ancla (ver useScrollToHash).
    <section id={ABOUT_ANCHOR} tabIndex={-1} className={`section band-sand ${styles.about}`}>
      <div className="container">
        {/* Sin foto, el texto ocupa todo el ancho en vez de la columna de la foto. */}
        <div className={data.photoUrl ? `${styles.intro} ${styles.withPhoto}` : styles.intro}>
          {data.photoUrl && (
            <div className={`frame ${styles.photo}`}>
              <img src={imageSrc(data.photoUrl)} alt={data.photoAlt} loading="lazy" />
            </div>
          )}
          <div className={styles.text}>
            <h2 className={styles.title}>{data.title}</h2>
            <RichText html={data.html} />

            {/* Cada lista (formazione, specializzazioni…): su título como etiqueta y
                sus elementos en pastillas con una marca. */}
            {data.lists.map((list, index) => (
              <div key={index} className={styles.list}>
                <h3 className="eyebrow">{list.title}</h3>
                <ul>
                  {list.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Check className={styles.check} aria-hidden="true" focusable="false" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {(showButton || instagram) && (
              <div className={styles.actions}>
                {showButton && (
                  <SmartLink
                    href={buttonHref}
                    className={`button button-secondary button-large ${styles.button}`}
                  >
                    {buttonLabel}
                    {/* Flecha en diagonal: el botón lleva a otra página. */}
                    <ArrowUpRight className={styles.arrow} aria-hidden="true" focusable="false" />
                  </SmartLink>
                )}
                {instagram && (
                  <a
                    href={instagram}
                    className={styles.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon />
                    <span>{instagramHandle(instagram) ?? it.about.instagramLabel}</span>
                    <span className="visually-hidden"> ({it.common.opensInNewTab})</span>
                    <ChevronRight className={styles.chevron} aria-hidden="true" focusable="false" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
