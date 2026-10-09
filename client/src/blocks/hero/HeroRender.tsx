import type { BlockData } from "@studio/shared";
import { SmartLink } from "../../components/SmartLink";
import styles from "./Hero.module.css";

// Cabecera de página: título grande (el <h1>), subtítulo, botón e imagen.
export function HeroRender({ data }: { data: BlockData<"hero"> }) {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <h1 className={styles.title}>{data.title}</h1>
          {data.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}
          {data.buttonLabel && data.buttonHref && (
            <SmartLink href={data.buttonHref} className="button">
              {data.buttonLabel}
            </SmartLink>
          )}
        </div>
        {data.imageUrl && (
          <img
            className={styles.image}
            src={data.imageUrl}
            // Sin descripción, la imagen es decorativa y el lector de pantalla la salta.
            alt={data.imageAlt}
            width={1200}
            height={800}
          />
        )}
      </div>
    </section>
  );
}
