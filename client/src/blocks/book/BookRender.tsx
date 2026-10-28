import type { BlockData } from "@studio/shared";
import { SmartLink } from "../../components/SmartLink";
import { imageSrc } from "../../lib/images";
import styles from "./Book.module.css";

// "Il mio libro": la portada sobre un panel arena y, al lado, etiqueta, título,
// subtítulo, sinopsis, un botón y un enlace secundario.
export function BookRender({ data }: { data: BlockData<"book"> }) {
  return (
    <section className="section">
      <div className={`container ${styles.book}`}>
        {data.coverUrl && (
          <div className={styles.panel}>
            <img
              className={styles.cover}
              src={imageSrc(data.coverUrl)}
              alt={data.coverAlt}
              loading="lazy"
            />
          </div>
        )}

        <div className={styles.column}>
          <div className={styles.text}>
            {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
            <div className={styles.titles}>
              <h2 className={styles.title}>{data.title}</h2>
              {data.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}
            </div>
            {data.text && <p className={styles.synopsis}>{data.text}</p>}
          </div>

          {((data.buttonLabel && data.buttonHref) || (data.linkLabel && data.linkHref)) && (
            <div className={styles.actions}>
              {data.buttonLabel && data.buttonHref && (
                <SmartLink href={data.buttonHref} className="button button-secondary button-large">
                  {data.buttonLabel}
                </SmartLink>
              )}
              {data.linkLabel && data.linkHref && (
                <SmartLink href={data.linkHref} className={styles.link}>
                  {data.linkLabel}
                </SmartLink>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
