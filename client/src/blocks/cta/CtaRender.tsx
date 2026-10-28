import type { BlockData } from "@studio/shared";
import { SmartLink } from "../../components/SmartLink";
import styles from "./Cta.module.css";

// Invito all'azione: franja terracota con título y texto a la izquierda y el botón
// a la derecha (debajo, en el móvil).
export function CtaRender({ data }: { data: BlockData<"cta"> }) {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.row}>
          {(data.title || data.text) && (
            <div className={styles.text}>
              {data.title && <h2 className={styles.title}>{data.title}</h2>}
              {data.text && <p>{data.text}</p>}
            </div>
          )}
          <SmartLink href={data.buttonHref} className="button button-light button-large">
            {data.buttonLabel}
          </SmartLink>
        </div>
      </div>
    </section>
  );
}
