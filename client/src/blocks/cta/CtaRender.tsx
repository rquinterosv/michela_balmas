import type { BlockData } from "@studio/shared";
import { SmartLink } from "../../components/SmartLink";
import styles from "./Cta.module.css";

// Invito all'azione: riquadro con titolo, testo breve e un pulsante.
export function CtaRender({ data }: { data: BlockData<"cta"> }) {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.box}>
          {data.title && <h2 className={styles.title}>{data.title}</h2>}
          {data.text && <p className={styles.text}>{data.text}</p>}
          <SmartLink href={data.buttonHref} className="button">
            {data.buttonLabel}
          </SmartLink>
        </div>
      </div>
    </section>
  );
}
