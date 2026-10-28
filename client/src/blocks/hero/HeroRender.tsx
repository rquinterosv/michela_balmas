import type { BlockData } from "@studio/shared";
import { SmartLink } from "../../components/SmartLink";
import styles from "./Hero.module.css";
import { imageSrc } from "../../lib/images";

// Cabecera de página: título grande (el <h1>), subtítulo, botón e imagen. En
// escritorio, texto a la izquierda y foto a la derecha; en el móvil, la foto debajo.
export function HeroRender({ data }: { data: BlockData<"hero"> }) {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.grid} ${data.imageUrl ? styles.withImage : ""}`}>
        <div className={styles.text}>
          <h1 className={styles.title}>{data.title}</h1>
          {data.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}
          {data.buttonLabel && data.buttonHref && (
            <div className={styles.actions}>
              <SmartLink href={data.buttonHref} className="button button-large">
                {data.buttonLabel}
              </SmartLink>
            </div>
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
