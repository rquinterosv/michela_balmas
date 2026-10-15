import type { BlockData } from "@studio/shared";
import { RichText } from "../../components/RichText";
import { SmartLink } from "../../components/SmartLink";
import styles from "./About.module.css";
import { imageSrc } from "../../lib/images";
import { it } from "../../i18n/it";
import { ABOUT_ANCHOR, ABOUT_PAGE_PATH, pagePath } from "../../lib/paths";
import { usePublishedPages } from "../../lib/PublishedPagesContext";

// Presentación: foto, texto, botón opcional y listas (formazione, specializzazioni…).
export function AboutRender({ data }: { data: BlockData<"about"> }) {
  const publishedPages = usePublishedPages();

  // Botón: lo que diga el panel. Un bloque guardado antes de existir el botón no
  // trae los campos (undefined) y usa el botón por defecto, "Scopri di più" a
  // /chi-sono, pero solo si esa página está publicada: así no lleva a un 404.
  // Dejar los campos vacíos en el panel ("") quita el botón.
  const usesDefaultButton = data.buttonLabel === undefined && data.buttonHref === undefined;
  const buttonLabel = data.buttonLabel ?? it.about.defaultButtonLabel;
  const buttonHref = data.buttonHref ?? ABOUT_PAGE_PATH;
  const targetPublished =
    publishedPages === null || // vista previa del panel: no se comprueba
    publishedPages.some((page) => pagePath(page.slug) === buttonHref);
  const showButton = buttonLabel && buttonHref && (!usesDefaultButton || targetPublished);

  return (
    // El id es el ancla del ítem "Chi sono" del menú (/#chi-sono). tabIndex={-1}
    // deja que reciba el foco al llegar por el ancla (ver useScrollToHash).
    <section id={ABOUT_ANCHOR} tabIndex={-1} className={styles.about}>
      <div className="container">
        {/* Sin foto, el texto ocupa todo el ancho en vez de la columna de la foto. */}
        <div className={data.photoUrl ? `${styles.intro} ${styles.withPhoto}` : styles.intro}>
          {data.photoUrl && (
            <img
              className={styles.photo}
              src={imageSrc(data.photoUrl)}
              alt={data.photoAlt}
              loading="lazy"
            />
          )}
          <div>
            <h2 className={styles.title}>{data.title}</h2>
            <RichText html={data.html} />
            {showButton && (
              <SmartLink href={buttonHref} className={`button ${styles.button}`}>
                {buttonLabel}
              </SmartLink>
            )}
          </div>
        </div>

        {data.lists.length > 0 && (
          <div className={styles.lists}>
            {data.lists.map((list, index) => (
              <div key={index} className={styles.list}>
                <h3 className={styles.listTitle}>{list.title}</h3>
                <ul>
                  {list.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
