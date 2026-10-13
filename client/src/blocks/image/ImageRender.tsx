import type { BlockData } from "@studio/shared";
import styles from "./Image.module.css";
import { imageSrc } from "../../lib/images";

// Una imagen con pie de foto opcional.
export function ImageRender({ data }: { data: BlockData<"image"> }) {
  // Mientras no se haya puesto la dirección de la imagen, no se muestra nada.
  if (!data.url) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        <figure className={styles.figure}>
          <img className={styles.image} src={imageSrc(data.url)} alt={data.alt} loading="lazy" />
          {data.caption && <figcaption className={styles.caption}>{data.caption}</figcaption>}
        </figure>
      </div>
    </section>
  );
}
