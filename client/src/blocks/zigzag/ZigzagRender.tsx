import type { BlockData } from "@studio/shared";
import { RichText } from "../../components/RichText";
import { imageSrc } from "../../lib/images";
import styles from "./Zigzag.module.css";

// Filas de texto e imagen. En el HTML el texto va siempre antes que la imagen (así
// se ve en móvil y así lo lee un lector de pantalla); en pantallas anchas el CSS
// pone la imagen a la izquierda en las filas impares y a la derecha en las pares.
export function ZigzagRender({ data }: { data: BlockData<"zigzag"> }) {
  if (data.rows.length === 0) return null;

  return (
    <section className={styles.zigzag}>
      <div className="container">
        {data.rows.map((row) => (
          <div
            key={row.id}
            className={row.imageUrl ? `${styles.row} ${styles.withImage}` : styles.row}
          >
            <div className={styles.text}>
              {row.title && <h2 className={styles.title}>{row.title}</h2>}
              <RichText html={row.html} />
            </div>
            {row.imageUrl && (
              <img
                className={styles.image}
                src={imageSrc(row.imageUrl)}
                // Sin descripción, la imagen es decorativa y el lector de pantalla la salta.
                alt={row.imageAlt}
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
