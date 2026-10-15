import type { BlockData } from "@studio/shared";
import { RichText } from "../../components/RichText";
import { SmartLink } from "../../components/SmartLink";
import styles from "./About.module.css";
import { imageSrc } from "../../lib/images";
import { ABOUT_ANCHOR } from "../../lib/paths";

// Presentación: foto, texto, botón opcional y listas (formazione, specializzazioni…).
export function AboutRender({ data }: { data: BlockData<"about"> }) {
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
            {data.buttonLabel && data.buttonHref && (
              <SmartLink href={data.buttonHref} className={`button ${styles.button}`}>
                {data.buttonLabel}
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
