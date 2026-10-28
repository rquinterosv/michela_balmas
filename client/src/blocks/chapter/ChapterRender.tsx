import type { BlockData } from "@studio/shared";
import { RichText } from "../../components/RichText";
import { imageSrc } from "../../lib/images";
import styles from "./Chapter.module.css";

// Capítulo de lectura larga: el título queda fijo al margen mientras el texto
// avanza al lado, como el título corriente de una página impresa. En el móvil va
// encima del texto. Puede cerrar con una foto y su pie.
export function ChapterRender({ data }: { data: BlockData<"chapter"> }) {
  return (
    <section className="section">
      <div className={`container ${styles.grid}`}>
        <h2 className={styles.title}>{data.title}</h2>
        <div className={styles.prose}>
          <RichText html={data.html} />
          {data.imageUrl && (
            <figure className={styles.figure}>
              <div className={`frame ${styles.frame}`}>
                <img src={imageSrc(data.imageUrl)} alt={data.imageAlt} loading="lazy" />
              </div>
              {data.caption && <figcaption>{data.caption}</figcaption>}
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}
