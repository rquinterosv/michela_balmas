import type { BlockData } from "@studio/shared";
import { Icon } from "../../lib/icons";
import styles from "./Features.module.css";

// Tarjetas con icono: en fila en escritorio, apiladas en móvil.
export function FeaturesRender({ data }: { data: BlockData<"features"> }) {
  if (data.items.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        {data.title && <h2 className={styles.title}>{data.title}</h2>}
        <ul className={styles.grid}>
          {data.items.map((item) => (
            <li key={item.id} className={styles.card}>
              <span className={styles.badge}>
                <Icon name={item.icon} className={styles.icon} />
              </span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              {item.text && <p className={styles.cardText}>{item.text}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
