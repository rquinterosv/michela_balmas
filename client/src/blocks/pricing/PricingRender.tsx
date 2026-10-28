import type { BlockData } from "@studio/shared";
import { Icon } from "../../lib/icons";
import styles from "./Pricing.module.css";

// "Tariffe": la lista de precios en un recuadro y, debajo, las informaciones
// prácticas (dónde, pago, cancelación…), cada una con su icono.
export function PricingRender({ data }: { data: BlockData<"pricing"> }) {
  if (data.prices.length === 0 && data.notes.length === 0) return null;

  return (
    <section className="section band-light">
      <div className="container">
        {(data.title || data.intro) && (
          <div className={`section-title section-title-centered ${styles.intro}`}>
            {data.title && <h2>{data.title}</h2>}
            {data.intro && <p>{data.intro}</p>}
          </div>
        )}

        <div className={styles.body}>
          {data.prices.length > 0 && (
            <ul className={styles.prices}>
              {data.prices.map((item) => (
                <li key={item.id} className={styles.price}>
                  <h3 className={styles.name}>{item.name}</h3>
                  {item.description && <p className={styles.description}>{item.description}</p>}
                  <p className={styles.amount}>{item.price}</p>
                </li>
              ))}
            </ul>
          )}

          {data.notes.length > 0 && (
            <ul className={styles.notes}>
              {data.notes.map((note) => (
                <li key={note.id} className={styles.note}>
                  <Icon name={note.icon} className={styles.icon} />
                  <h3 className={styles.noteTitle}>{note.title}</h3>
                  {note.text && <p className={styles.noteText}>{note.text}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
